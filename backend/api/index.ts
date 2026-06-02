import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import express, { Express } from 'express';
import { AppModule } from '../src/app.module';

let cachedServer: any;

async function bootstrap(): Promise<Express> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn'],
  });

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3000',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });

  // API prefix 설정
  app.setGlobalPrefix('api');

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const expressApp = await bootstrap();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer(req, res);
}
