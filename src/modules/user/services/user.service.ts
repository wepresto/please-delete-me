import { Injectable } from '@nestjs/common';

import { UserCreateService } from './user.create.service';
import { UserReadService } from './user.read.service';
import { UserUpdateService } from './user.update.service';
import { UserDeleteService } from './user.delete.service';

@Injectable()
export class UserService {
  constructor(
    public readonly createService: UserCreateService,
    public readonly readService: UserReadService,
    public readonly updateService: UserUpdateService,
    public readonly deleteService: UserDeleteService,
  ) {}
}
