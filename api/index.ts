import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { json } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule.forRoot(), {
      logger: ['error', 'warn'],
    });

    // UTF-8 인코딩 명시적 설정
    app.use(json({ limit: '10mb' }));

    // CORS 설정
    app.enableCors({
      origin: [
        'http://localhost:3000',
        /\.vercel\.app$/,
      ],
      credentials: true,
    });

    // Controllers already have 'api/' prefix, so no global prefix needed

    await app.init();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const nestApp = await bootstrap();
  const expressApp = nestApp.getHttpAdapter().getInstance();

  // Vercel rewrites /api/:path* to /api?path=...
  // Reconstruct the original URL
  if (req.query.path) {
    const pathSegments = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
    req.url = `/api/${pathSegments.join('/')}`;
    delete req.query.path;
  }

  expressApp(req, res);
}
