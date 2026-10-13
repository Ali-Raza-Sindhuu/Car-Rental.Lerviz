import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readConfig } from './config';
import { configureApp } from './setup';

async function bootstrap() {
  const config = readConfig();
  const app = await NestFactory.create(AppModule);
  configureApp(app, config.origins);
  await app.listen(config.port, '0.0.0.0');
}

bootstrap().catch(() => {
  console.error('API startup failed. Check backend configuration and dependencies.');
  process.exitCode = 1;
});
