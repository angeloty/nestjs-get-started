import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/models/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}
}
