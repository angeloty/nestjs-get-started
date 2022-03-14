import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserOutputDTO {
  @Field({ nullable: false })
  id: number;
  @Field({ nullable: false })
  email: string;
  @Field({ nullable: false })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
}
