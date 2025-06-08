import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Bắt tất cả lỗi
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal server error' };

        // Ghi log lỗi
        this.logger.error(
            `Error at ${request.url}: ${JSON.stringify(message)}`,
            exception instanceof Error ? exception.stack : '',
        );

        // Trả về phản hồi chuẩn hóa
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : (message as any).message || 'Internal server error',
        });
    }
}