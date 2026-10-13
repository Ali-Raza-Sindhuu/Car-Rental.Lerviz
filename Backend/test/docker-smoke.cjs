// Run inside the production image with DATABASE_URL pointing to a migrated test DB.
const assert = require('node:assert/strict');
const { NestFactory } = require('/app/node_modules/@nestjs/core');
const { AppModule } = require('/app/dist/src/app.module');
const { configureApp } = require('/app/dist/src/setup');

(async () => {
  const app = await NestFactory.create(AppModule, { logger: false });
  configureApp(app, ['http://localhost:5173']);
  try {
    assert.notEqual(process.getuid(), 0, 'Runtime must not run as root');
    await app.listen(0, '127.0.0.1');
    const base = await app.getUrl();
    for (const path of ['/health/ready', '/api/v1/vehicles']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      await response.json();
      console.log(`${path} OK`);
    }
  } finally {
    await app.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
