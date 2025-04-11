import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: any, res: any, next: NextFunction) {
        const { method, headers, url, params, query, body } = req;

        const logMessage = 
            `[${new Date().toLocaleTimeString()}]` +
            `\n • Method: ${method} ` +
            `\n • API: ${url} ` +
            `\n • Headers: ${JSON.stringify(headers)} ` +
            `\n • Params: ${JSON.stringify(params)} ` +
            `\n • Query: ${JSON.stringify(query)} ` +
            `\n • Body: ${JSON.stringify(body)}`;

        console.log(logMessage);
        next();
    }
}