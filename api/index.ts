// Suppress url.parse() deprecation warning from parseurl package (Express dependency)
// This is a known issue in Express ecosystem - parseurl@1.3.3 uses legacy url.parse()
// See: https://github.com/pillarjs/parseurl/issues/18
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  if (typeof warning === 'string' && warning.includes('url.parse()')) {
    return;
  }
  return originalEmitWarning.call(process, warning, ...args as [string?, string?]);
};

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
