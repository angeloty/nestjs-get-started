import { Injectable } from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';
import { UserRepository } from 'src/models/repositories/user.repository';
import { CreateUserInputDTO } from '../../models/dtos/user.in.dto';
import { UserOutputDTO } from '../../models/dtos/user.out.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}
  async getUsers(): Promise<UserOutputDTO[]> {
    try {
      return (await this.repository.find({})) as UserOutputDTO[];
    } catch (e) {
      throw e;
    }
  }
  async getUserById(id: number): Promise<UserOutputDTO> {
    try {
      return (await this.repository.findOneOrFail(id)) as UserOutputDTO;
    } catch (e) {
      throw e;
    }
  }
  async createUser({
    email,
    firstName,
    lastName,
  }: CreateUserInputDTO): Promise<UserOutputDTO> {
    try {
      const user: User = this.repository.create({ email, firstName, lastName });
      return (await this.repository.save(user)) as UserOutputDTO;
    } catch (e) {
      throw e;
    }
  }
}
