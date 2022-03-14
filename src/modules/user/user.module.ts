import { Module } from '@nestjs/common';
import { UserRepository } from 'src/models/repositories/user.repository';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './services/user/user.service';
import { UserResolver } from './resolvers/user/user.resolver';
import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [DatabaseModule.forFeature([UserRepository])],
  providers: [UserService, UserResolver],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
