import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

import appConfig from '../../../config/app.config';

import { User } from '../entities/user.entity';

import { UserReadService } from './user.read.service';

import { CreateBorrowerInput } from '../dto/create-borrower-input.dto';
import { CreateLenderInput } from '../dto/create-lender-input.dto';

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

  public async createLender(input: CreateLenderInput) {
    const { documentNumber, email, password, phoneNumber, fullName, address } =
      input;

    const {
      acl: {
        roles: { lenderCode },
      },
    } = this.appConfiguration;

    // check if the user already exists by document number
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

    // check if the user already exists by email
    const exisingUserByPhoneNumber = await this.readService.getOneByFields({
      fields: {
        phoneNumber,
      },
      loadRelationIds: false,
    });

    if (exisingUserByPhoneNumber) {
      throw new ConflictException(
        `already exist an user with the phone number ${phoneNumber}.`,
      );
    }

    const aclUser = await this.basicAclService.createUser({
      email,
      password,
      phone: `+57${phoneNumber}`,
      roleCode: lenderCode,
      sendEmail: true,
      emailTemplateParams: {
        fullName,
      },
    });

    try {
      const { authUid } = aclUser;

      const createdUser = this.userRepository.create({
        authUid,
        documentNumber,
        fullName,
        email,
        phoneNumber,
        address,
      });

      const savedUser = await this.userRepository.save(createdUser);

      const preloaded = await this.userRepository.preload({
        id: savedUser.id,
        lender: {
          id: savedUser.id,
        },
      });

      await this.userRepository.save(preloaded);

      return savedUser;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UserCreateService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });
    }
  }

  public async createBorrower(input: CreateBorrowerInput): Promise<User> {
    const { documentNumber, email, password, phoneNumber, fullName, address } =
      input;

    // check if the user already exists by document number
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

    // check if the user already exists by email
    const exisingUserByPhoneNumber = await this.readService.getOneByFields({
      fields: {
        phoneNumber,
      },
      loadRelationIds: false,
    });

    if (exisingUserByPhoneNumber) {
      throw new ConflictException(
        `already exist an user with the phone number ${phoneNumber}.`,
      );
    }

    const roleCode = '01BO'; // TODO: get the role code from the config

    const aclUser = await this.basicAclService.createUser({
      email,
      password,
      phone: `+57${phoneNumber}`,
      roleCode: roleCode,
      sendEmail: true,
      emailTemplateParams: {
        fullName,
      },
    });

    try {
      const { authUid } = aclUser;

      const createdUser = this.userRepository.create({
        authUid,
        documentNumber,
        fullName,
        email,
        phoneNumber,
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
