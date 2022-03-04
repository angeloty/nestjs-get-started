import { DynamicModule, Global, Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Global()
@Module({})
export class CacheManagerModule {
  static forRoot(config: RedisClientOptions): DynamicModule {
    const cacheModule = CacheModule.register<RedisClientOptions>({
      store: redisStore,
      ...config,
    });
    return {
      global: true,
      module: CacheManagerModule,
      imports: [cacheModule],
      providers: [],
      exports: [cacheModule],
    };
  }
}
