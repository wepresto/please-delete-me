import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../config/app.config';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
