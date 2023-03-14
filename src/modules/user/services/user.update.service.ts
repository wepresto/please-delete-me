import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicAclService } from 'nestjs-basic-acl-sdk';
import { Repository } from 'typeorm';

import appConfig from '../../../config/app.config';

import { User } from '../entities/user.entity';

import { UserReadService } from './user.read.service';

import { ChangeUserEmailInput } from '../dto/change-user-email-input.dto';
import { ChangeUserPhoneInput } from '../dto/change-user-phone-input.dto';
import { ChangeUserAddressInput } from '../dto/change-user-address-input.dto';
import { SendUserResetPasswordEmail } from '../dto/send-user-reset-password-email-input.dto';
import { GetOneUserInput } from '../dto/get-one-user-input.dto';
import { ChangeUserPasswordInput } from '../dto/change-user-password-input.dto';

@Injectable()
export class UserUpdateService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly readService: UserReadService,
    private readonly basicAclService: BasicAclService,
  ) {}

  public async changeEmail(input: ChangeUserEmailInput): Promise<User> {
    const { authUid } = input;

    // get the user
    const existingUser = await this.readService.getOneByFields({
      fields: {
        authUid,
      },
      checkIfExists: true,
      loadRelationIds: false,
    });

    // update the user in ACL
    const { email } = input;

    await this.basicAclService.changeEmail({
      authUid: existingUser.authUid,
      email,
      emailTemplateParams: {
        fullName: existingUser.fullName,
      },
    });

    // update the user in DB
    const preloadedUser = await this.userRepository.preload({
      id: existingUser.id,
      email,
    });

    const updatedUser = await this.userRepository.save(preloadedUser);

    return updatedUser;
  }

  public async changePhone(input: ChangeUserPhoneInput): Promise<User> {
    const { authUid } = input;

    const existingUser = await this.readService.getOneByFields({
      fields: {
        authUid,
      },
      checkIfExists: true,
      loadRelationIds: false,
    });

    const { phone } = input;

    // change the phone in the ACL
    try {
      await this.basicAclService.changePhone({
        authUid: existingUser.authUid,
        phone: `+57${phone}`,
      });
    } catch (error) {
      if (error?.message.includes('user not found')) {
        throw new ConflictException(`the phone ${phone} it's already used.`);
      }
    }

    // update the user in DB
    const preloadedUser = await this.userRepository.preload({
      id: existingUser.id,
      phoneNumber: phone,
    });

    const updatedUser = await this.userRepository.save(preloadedUser);

    return updatedUser;
  }

  public async changeAddress(input: ChangeUserAddressInput): Promise<User> {
    const { authUid } = input;

    const existingUser = await this.readService.getOneByFields({
      fields: {
        authUid,
      },
      checkIfExists: true,
      loadRelationIds: false,
    });

    const { address } = input;

    // update the user in DB
    const preloadedUser = await this.userRepository.preload({
      id: existingUser.id,
      address,
    });

    const updatedUser = await this.userRepository.save(preloadedUser);

    return updatedUser;
  }

  public async sendResetPasswordEmail(input: SendUserResetPasswordEmail) {
    const { email } = input;

    await this.basicAclService.sendResetPasswordEmail({
      email,
    });

    return {
      message: 'email message was sent',
    };
  }

  public async changePassword(
    paramInput: GetOneUserInput,
    bodyInput: ChangeUserPasswordInput,
  ) {
    const { authUid } = paramInput;

    const existingUser = await this.readService.getOneByFields({
      fields: {
        authUid,
      },
      checkIfExists: true,
      loadRelationIds: false,
    });

    const { oldPassword, newPassword } = bodyInput;

    try {
      await this.basicAclService.changePassword({
        authUid: existingUser.authUid,
        oldPassword,
        newPassword,
        emailTemplateParams: {
          fullName: existingUser.fullName,
        },
      });
    } catch (error) {
      if (error?.message.includes('incorrect')) {
        throw new UnauthorizedException(
          'the password is incorrect.',
          UserUpdateService.name,
        );
      }
      throw error;
    }

    return {
      message: 'password was changed',
    };
  }
}
