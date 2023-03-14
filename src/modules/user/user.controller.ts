import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionName, Public } from 'nestjs-basic-acl-sdk';

import { UserService } from './services/user.service';

import { CreateBorrowerInput } from './dto/create-borrower-input.dto';
import { GetOneUserInput } from './dto/get-one-user-input.dto';
import { ChangeUserEmailInput } from './dto/change-user-email-input.dto';
import { ChangeUserPhoneInput } from './dto/change-user-phone-input.dto';
import { ChangeUserAddressInput } from './dto/change-user-address-input.dto';
import { SendUserResetPasswordEmail } from './dto/send-user-reset-password-email-input.dto';
import { ChangeUserPasswordInput } from './dto/change-user-password-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('lender')
  createLender(@Body() input: CreateBorrowerInput) {
    return this.userService.createService.createLender(input);
  }

  @Public()
  @Post('borrower')
  createBorrower(@Body() input: CreateBorrowerInput) {
    return this.userService.createService.createBorrower(input);
  }

  @PermissionName('users:read')
  @Get('/:authUid')
  getOne(@Param() input: GetOneUserInput) {
    return this.userService.readService.getOne(input);
  }

  @PermissionName('users:handle')
  @Delete('borrower')
  deleteBorrower(@Query() input: GetOneUserInput) {
    return this.userService.deleteService.deleteBorrower(input);
  }

  @PermissionName('user:handle')
  @Patch('email')
  changeEmail(@Body() input: ChangeUserEmailInput) {
    return this.userService.updateService.changeEmail(input);
  }

  @PermissionName('user:handle')
  @Patch('phone')
  changePhone(@Body() input: ChangeUserPhoneInput) {
    return this.userService.updateService.changePhone(input);
  }

  @PermissionName('user:handle')
  @Patch('address')
  changeAddress(@Body() input: ChangeUserAddressInput) {
    return this.userService.updateService.changeAddress(input);
  }

  @Public()
  @Post('reset-password-email')
  sendResetPasswordEmail(@Body() input: SendUserResetPasswordEmail) {
    return this.userService.updateService.sendResetPasswordEmail(input);
  }

  @PermissionName('user:handle')
  @Patch('/password')
  changePassword(
    @Query() paramInput: GetOneUserInput,
    @Body() bodyInput: ChangeUserPasswordInput,
  ) {
    return this.userService.updateService.changePassword(paramInput, bodyInput);
  }
}
