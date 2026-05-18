import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (개발/프로덕션 환경 모두 지원)
  const allowedOrigins = [
    'http://localhost:3000',
    'https://flow-sync.vercel.app',
  ];

  // VERCEL_URL 환경변수가 있으면 해당 URL도 허용
  if (process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
