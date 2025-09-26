"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = require("connect-redis");
const redis_1 = require("redis");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
        credentials: true,
    });
    const redisClient = (0, redis_1.createClient)({
        socket: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: Number(process.env.REDIS_PORT ?? 6379),
            reconnectStrategy: (retries) => Math.min(retries * 500, 5000),
        },
    });
    redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });
    await redisClient.connect();
    app.use((0, express_session_1.default)({
        store: new connect_redis_1.RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET ?? 'dev_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        name: 'sid',
    }));
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map