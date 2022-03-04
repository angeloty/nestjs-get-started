import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Error {
    if (host.getType() === 'http') {
      const status = exception.getStatus();
      return new HttpException(exception.message, status || 500);
    } else if (host.getType() === 'rpc') {
      // do something that is only important in the context of Microservice requests
    } else if (host.getType<GqlContextType>() === 'graphql') {
      const status = exception.getStatus();
      const message = exception['response']?.message
        ? typeof exception['response']?.message === 'object' &&
          exception['response']?.message.hasOwnProperty('length')
          ? exception['response']?.message.join('./n')
          : exception['response']?.message
        : exception.message;
      return new HttpException(message, status || 500);
    }
  }
}
