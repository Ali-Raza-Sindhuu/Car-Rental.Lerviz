import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(app: INestApplication, origins: string[]) {
  app.enableCors({ origin: origins, credentials: true, methods: ['GET', 'HEAD', 'OPTIONS'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.enableShutdownHooks();
}
