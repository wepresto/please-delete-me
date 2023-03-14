import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicAclModule } from 'nestjs-basic-acl-sdk';

import appConfig from '../../config/app.config';

import { User } from './entities/user.entity';
import { Lender } from './entities/lender.entity';

import { UserReadService } from './services/user.read.service';
import { UserCreateService } from './services/user.create.service';
import { UserUpdateService } from './services/user.update.service';
import { UserDeleteService } from './services/user.delete.service';
import { UserService } from './services/user.service';

import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([User, Lender]),
    BasicAclModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          companyUid: configService.get<string>('config.acl.companyUid'),
          accessKey: configService.get<string>('config.acl.accessKey'),
        };
      },
    }),
  ],
  providers: [
    UserReadService,
    UserCreateService,
    UserUpdateService,
    UserDeleteService,
    UserService,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
