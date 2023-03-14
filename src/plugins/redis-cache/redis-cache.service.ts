import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { createClient, RedisClientType } from 'redis';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { GetInput } from './dto/get-input.dto';
import { SetInput } from './dto/set-input.dto';

@Injectable()
export class RedisCacheService {
  private client: RedisClientType;
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    this.init();
  }

  private async init() {
    const {
      redis: { url },
    } = this.appConfiguration;
    this.client = createClient({
      url,
    });

    this.client.on('error', (err) => {
      Logger.error(`Redis Client Error: ${err}`, RedisCacheService.name);
      throw err;
    });

    await this.client.connect();
  }

  public async set(input: SetInput): Promise<void> {
    const { keys, value, ttl = 0 } = input;

    const {
      redis: { keyPrefix },
    } = this.appConfiguration;

    const key = Object.keys(keys)
      .map((key) => keys[key])
      .join(':');

    const newValue = JSON.stringify(value);

    await this.client.set(keyPrefix + key, newValue, {
      EX: ttl,
      NX: true,
    });
  }

  public async get(input: GetInput) {
    const { keys } = input;

    const {
      redis: { keyPrefix },
    } = this.appConfiguration;

    const key = Object.keys(keys)
      .map((key) => keys[key])
      .join(':');

    const value = await this.client.get(keyPrefix + key);

    if (!value) return null;

    try {
      return JSON.parse(value as string);
    } catch (error) {
      console.error(error);
      return value;
    }
  }
}
