import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

import appConfig from '../../../config/app.config';

import { User } from '../entities/user.entity';

import { UserReadService } from './user.read.service';

import { GetOneUserInput } from '../dto/get-one-user-input.dto';

@Injectable()
export class UserDeleteService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly readService: UserReadService,
    private readonly basicAclService: BasicAclService,
  ) {}

  public async deleteBorrower(input: GetOneUserInput): Promise<User> {
    // get the user
    const existingUser = await this.readService.getOneByFields({
      fields: {
        authUid: input.authUid,
      },
      checkIfExists: true,
      loadRelationIds: false,
    });

    // check if the user exists
    if (!existingUser) {
      throw new NotFoundException(
        `the user with the authUid ${input.authUid} does not exist.`,
      );
    }

    // delete the user
    const deletedUser = await this.userRepository.remove(existingUser);

    // delete the user in ACL
    await this.basicAclService.deleteUser({
      authUid: deletedUser.authUid,
    });

    return deletedUser;
  }
}
