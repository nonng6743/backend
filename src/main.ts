import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      reconnectStrategy: (retries) => Math.min(retries * 500, 5000),
    },
  });
  redisClient.on('error', (err) => {
    // Prevent unhandled 'error' from crashing the process
    console.error('Redis Client Error:', err);
  });
  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: process.env.SESSION_SECRET ?? 'dev_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      name: 'sid',
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
