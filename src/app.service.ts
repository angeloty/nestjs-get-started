import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Subscribe } from './modules/event-manager/decorators/subscribe.decorator';
import { EventManagerService } from './modules/event-manager/services/event-manager/event-manager.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emitter: EventManagerService,
  ) {
    this.emitter.subscribe('global.event', (data) => {
      console.log('Global');
      console.log(data);
    });
    this.emitter.subscribe('local.event', (data) => {
      console.log('Local');
      console.log(data);
    });
  }
  getHello(): string {
    return 'Hello World!';
  }

  async saveInCache<T>(key: string, data: T): Promise<T> {
    try {
      return await this.cacheManager.set<T>(key, data, { ttl: 300 });
    } catch (e) {
      throw e;
    }
  }

  async getFromCache<T>(key: string): Promise<T> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (e) {
      throw e;
    }
  }

  async emit<T>(data: T): Promise<boolean> {
    try {
      await this.emitter.publish<T>('global.event', data, true);
      await this.emitter.publish<T>('local.event', data);
      return true;
    } catch (e) {
      throw e;
    }
  }

  @Subscribe('global.event')
  async globalSub(data: any): Promise<any> {
    try {
      console.log('Global Subs');
      console.log(data);
    } catch (e) {
      throw e;
    }
  }

  @Subscribe('local.event')
  async localSub(data: any): Promise<any> {
    try {
      console.log('Local Subs');
      console.log(data);
    } catch (e) {
      throw e;
    }
  }
}
