import { Module } from '@nestjs/common';

import { redisOptionsModuleFactory } from './redis.config.js';
import { createRedisConnection } from './redis.service.js';
import { REDIS_MODULE_OPTIONS, REDIS_TOKEN } from './redis.constant.js';

const config = redisOptionsModuleFactory();
const { url } = config.config;

@Module({
  providers: [
    {
      provide: REDIS_MODULE_OPTIONS,
      useValue: {
        url: url,
      },
    },
    {
      inject: [REDIS_MODULE_OPTIONS],
      provide: REDIS_TOKEN,
      useFactory: async () => {
        const client = createRedisConnection(config);

        return client;
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class RedisModule {}