import { Module } from '@nestjs/common';
import { ConnectionOptions, DatabaseType } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './models/entities/user.entity';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { CacheManagerModule } from './modules/cache-manager/cache-manager.module';
import { EventManagerModule } from './modules/event-manager/event-manager.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    DatabaseModule.forRoot({
      type: process.env.DB_ADAPTER as DatabaseType,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      entities: [User],
    } as ConnectionOptions),
    CacheManagerModule.forRoot({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      password: process.env.REDIS_AUTH,
    }),
    UserModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
      storage: new ThrottlerStorageRedisService({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_AUTH,
      }),
    }),
    EventManagerModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_AUTH,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
