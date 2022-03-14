import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserInputDTO,
  GetUserInputDTO,
} from '../../models/dtos/user.in.dto';
import { UserOutputDTO } from '../../models/dtos/user.out.dto';
import { UserService } from '../../services/user/user.service';

@Resolver(() => UserOutputDTO)
export class UserResolver {
  constructor(private readonly service: UserService) {}
  @Query(() => [UserOutputDTO])
  async getUsers(): Promise<UserOutputDTO[]> {
    try {
      return await this.service.getUsers();
    } catch (e) {
      throw e;
    }
  }
  @Query(() => UserOutputDTO)
  async getUser(@Args() { id }: GetUserInputDTO): Promise<UserOutputDTO> {
    try {
      return await this.service.getUserById(id);
    } catch (e) {
      throw e;
    }
  }

  @Mutation(() => UserOutputDTO)
  async createUser(@Args() data: CreateUserInputDTO): Promise<UserOutputDTO> {
    try {
      return await this.service.createUser(data);
    } catch (e) {
      throw e;
    }
  }
}
