import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

import appConfig from '../../../config/app.config';

import { User } from '../entities/user.entity';

import { UserReadService } from './user.read.service';

import { CreateBorrowerInput } from '../dto/create-borrower-input.dto';

@Injectable()
export class UserCreateService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly readService: UserReadService,
    private readonly basicAclService: BasicAclService,
  ) {}

  public async createBorrower(input: CreateBorrowerInput): Promise<User> {
    // check if the user already exists by document number
    const { documentNumber } = input;

    const existingUserByDocumentNumber = await this.readService.getOneByFields({
      fields: {
        documentNumber,
      },
      loadRelationIds: false,
    });

    if (existingUserByDocumentNumber) {
      throw new ConflictException(
        `already exist an user with the document number ${documentNumber}.`,
      );
    }

    // check if the user already exists by email
    const { email } = input;

    const exisingUserByEmail = await this.readService.getOneByFields({
      fields: {
        email,
      },
      loadRelationIds: false,
    });

    if (exisingUserByEmail) {
      throw new ConflictException(
        `already exist an user with the email ${email}.`,
      );
    }

    const { phone } = input;

    const exisingUserByPhoneNumber = await this.readService.getOneByFields({
      fields: {
        phone,
      },
      loadRelationIds: false,
    });

    if (exisingUserByPhoneNumber) {
      throw new ConflictException(
        `already exist an user with the phone number ${phone}.`,
      );
    }

    const { password, fullName } = input;

    const roleCode = '01BO'; // TODO: get the role code from the config

    const aclUser = await this.basicAclService.createUser({
      email,
      password,
      phone: `+57${phone}`,
      roleCode: roleCode,
      sendEmail: true,
      emailTemplateParams: {
        fullName,
      },
    });

    try {
      const { authUid } = aclUser;

      const { address } = input;

      const createdUser = this.userRepository.create({
        authUid,
        documentNumber,
        fullName,
        email,
        phoneNumber: phone,
        address,
      });

      const savedUser = await this.userRepository.save(createdUser);

      return savedUser;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UserCreateService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });
    }
  }
}
