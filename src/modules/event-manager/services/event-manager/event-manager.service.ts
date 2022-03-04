import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, Observer, Subscription } from 'rxjs';
import Redis from 'ioredis';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventSubscriptions } from '../../data/event-subscriptions.data';

@Injectable()
export class EventManagerService implements OnModuleInit {
  private channels: { [channel: string]: Observable<any> } = {};
  public constructor(
    @Inject('REDIS_SUBSCRIBER_CLIENT')
    private readonly redisSubscriberClient: Redis.Redis,
    @Inject('REDIS_PUBLISHER_CLIENT')
    private readonly redisPublisherClient: Redis.Redis,
    private eventEmitter: EventEmitter2,
  ) {
    if (this.redisPublisherClient) {
      this.redisPublisherClient.setMaxListeners(1000);
      this.redisSubscriberClient.setMaxListeners(1000);
    }
  }

  get emitter(): EventEmitter2 {
    return this.eventEmitter;
  }

  onModuleInit(): void {
    if (EventSubscriptions.length) {
      EventSubscriptions.forEach(({ eventName, fn }) => {
        this.on(eventName, fn);
      });
    }
  }

  public channel<T>(eventName: string): Observable<T> {
    if (this.redisSubscriberClient) {
      this.redisSubscriberClient.subscribe(eventName);
    }
    if (!this.channels[eventName]) {
      this.channels[eventName] = new Observable((observer: Observer<T>) => {
        if (this.redisSubscriberClient) {
          this.redisSubscriberClient.on('message', (channel, message) => {
            if (channel === eventName) {
              observer.next(JSON.parse(message) as T);
            }
          });
        }
        this.eventEmitter.on(eventName, (data: T) => {
          observer.next(data);
        });
      });
    }
    return this.channels[eventName];
  }

  public subscribe<T>(eventName: string, fn: (args: T) => any): Subscription {
    return this.channel(eventName).subscribe(fn);
  }

  public on<T>(eventName: string, fn: (args: T) => any): Subscription {
    return this.channel(eventName).subscribe(fn);
  }

  public async publish<T>(
    channel: string,
    value: T,
    global = false,
  ): Promise<number> {
    if (global) {
      return new Promise<number>((resolve, reject) => {
        return this.redisPublisherClient.publish(
          channel,
          JSON.stringify(value),
          (error, reply) => {
            if (error) {
              return reject(error);
            }
            return resolve(reply);
          },
        );
      });
    }
    return this.eventEmitter.emit(channel, value) ? 1 : 0;
  }
}
