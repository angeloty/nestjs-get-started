import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Error {
    const message = exception['response']?.message
      ? typeof exception['response']?.message === 'object' &&
        exception['response']?.message.hasOwnProperty('length')
        ? exception['response']?.message.join('./n')
        : exception['response']?.message
      : exception.message;

    const status: number = exception.getStatus ? exception.getStatus() : 400;
    let request: Request;
    let response: Response;
    if (host.getType<GqlContextType>() === 'graphql') {
      const gqlHost: GqlArgumentsHost = GqlArgumentsHost.create(host);
      const ctx: HttpArgumentsHost = gqlHost.switchToHttp();
      const incomingMessage = ctx.getNext();
      request = incomingMessage.req;
      response = incomingMessage.req.res;
    } else {
      const ctx: HttpArgumentsHost = host.switchToHttp();
      request = ctx.getRequest<Request>();
      response = ctx.getResponse<Response>();
      response.status(status);
    }
    response
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      })
      .end();
    return;
  }
}
