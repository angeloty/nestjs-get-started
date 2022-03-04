import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';

@Module({})
@Global()
export class DatabaseModule {
  static forRoot(opt: TypeOrmModuleOptions): DynamicModule {
    const dbModule = TypeOrmModule.forRoot(opt as TypeOrmModuleOptions);
    return {
      global: true,
      module: DatabaseModule,
      imports: [dbModule],
      exports: [dbModule],
    };
  }
  static forFeature(models: EntityClassOrSchema[]): DynamicModule {
    const dbModule = TypeOrmModule.forFeature(models as EntityClassOrSchema[]);
    const repositories: Provider[] = (models || []).filter(
      (m: any) => m instanceof Repository,
    ) as Provider[];
    return {
      module: DatabaseModule,
      providers: [...(repositories || [])],
      imports: [dbModule],
      exports: [dbModule, ...(repositories || [])],
    };
  }
}
