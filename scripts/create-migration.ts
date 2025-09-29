import * as fs from 'node:fs';
import * as path from 'node:path';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('You need to provide a name for the migration.');
  console.error('Example: npm run migrate:create migration-name-here');
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, '')
  .slice(0, 14);

const fileName = `${timestamp}-${migrationName}.ts`;
const filePath = path.join(process.cwd(), 'src/migrations', fileName);

const template = `
import type { Db, ClientSession } from 'mongodb';

export async function up(db: Db, client: ClientSession): Promise<void> {
}

export async function down(db: Db, client: ClientSession): Promise<void> {
}
`;

fs.writeFileSync(filePath, template, { flag: 'wx' });
console.log(`Migration created: src/migrations/${fileName}`);
