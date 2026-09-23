import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module.js';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from '../config/redis/redis.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'account',
    }),
    UserModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    RedisModule
  ],
})
export class AppModule {}
