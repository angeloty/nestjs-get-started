import { configLoader } from './helpers/config.helper';
configLoader();
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
    }),
  );
  app.enableCors({
    maxAge: 86400,
    origin: true,
    preflightContinue: false,
  });
  await app.listen(process.env.PORT);
}
bootstrap();
