import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';

export class CreateLenderInput {
  @Length(5, 25)
  @IsNumberString()
  readonly documentNumber: string;

  @Length(5, 160)
  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @Length(10, 10)
  @IsNumberString()
  readonly phoneNumber: string;

  @Length(5, 160)
  @IsString()
  readonly address: string;

  @Length(6, 16)
  @IsString()
  readonly password: string;
}
