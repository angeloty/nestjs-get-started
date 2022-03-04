import { DynamicModule, Global, Module } from '@nestjs/common';
import { EventManagerService } from './services/event-manager/event-manager.service';
import Redis from 'ioredis';
import { EventEmitterModule } from '@nestjs/event-emitter';

export interface IEventManagerConfigOptions {
  redis?: {
    host?: string;
    port?: number;
    db?: number;
    password?: string;
  };
}

@Module({
  providers: [EventManagerService],
})
@Global()
export class EventManagerModule {
  static forRoot(config?: IEventManagerConfigOptions): DynamicModule {
    const emitterModule: DynamicModule = EventEmitterModule.forRoot();
    let redisConfig;
    if (config?.redis) {
      redisConfig = {
        host: config?.redis?.host || 'localhost',
        port: Number(config?.redis?.port || 6379),
        db: Number(config?.redis?.db || 1),
        password: config?.redis?.password || undefined,
      };
    }
    return {
      global: true,
      module: EventManagerModule,
      imports: [emitterModule],
      providers: [
        {
          useFactory: (): Redis.Redis => {
            return redisConfig ? new Redis(redisConfig) : null;
          },
          provide: 'REDIS_SUBSCRIBER_CLIENT',
        },
        {
          useFactory: (): Redis.Redis => {
            return redisConfig ? new Redis(redisConfig) : null;
          },
          provide: 'REDIS_PUBLISHER_CLIENT',
        },
        EventManagerService,
      ],
      exports: [emitterModule, EventManagerService],
    };
  }
}
