import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
@ArgsType()
export class GetUserInputDTO {
  @Field({ nullable: false })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
@InputType()
@ArgsType()
export class CreateUserInputDTO {
  @Field({ nullable: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @Field({ nullable: false })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;
}
