import { Module } from '@nestjs/common';
import { UserRepository } from 'src/models/repositories/user.repository';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './services/user/user.service';

@Module({
  imports: [DatabaseModule.forFeature([UserRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
