import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const envPath = new URL('.env', import.meta.url);
const content = [
  '# Generated local development credentials. Do not commit or share.',
  `MYSQL_ROOT_PASSWORD=${randomBytes(32).toString('hex')}`,
  `LERVIZ_DB_PASSWORD=${randomBytes(32).toString('hex')}`,
  'MYSQL_PORT=3306',
  'PHPMYADMIN_PORT=8080',
  '',
].join('\n');

try {
  writeFileSync(envPath, content, { flag: 'wx', mode: 0o600 });
  console.log('Created infra/shared/.env with random local passwords. Open it locally for phpMyAdmin login.');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('Existing shared .env preserved. No credentials were changed.');
}
