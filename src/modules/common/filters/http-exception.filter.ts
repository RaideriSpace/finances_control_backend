import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponseBody {
  message?: unknown;
  error?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status: number = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      !isHttpException ||
      status >= (HttpStatus.INTERNAL_SERVER_ERROR as number)
    ) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const rawBody = isHttpException ? exception.getResponse() : null;
    const body: ErrorResponseBody =
      typeof rawBody === 'object' && rawBody !== null ? rawBody : {};

    const message = isHttpException
      ? (body.message ?? exception.message)
      : 'Erro interno do servidor';

    response.status(status).json({
      statusCode: status,
      message,
      error: isHttpException ? exception.name : 'InternalServerError',
    });
  }
}
