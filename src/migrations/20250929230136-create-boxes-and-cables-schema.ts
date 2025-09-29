import { Db, ClientSession } from 'mongodb';

export async function up(db: Db, _client: ClientSession): Promise<void> {
  await db.createCollection('boxes');
  await db.collection('boxes').createIndex({ ispId: 1 }, { unique: true });
  await db.collection('boxes').createIndex({ createdAt: 1 });
  await db.collection('boxes').createIndex({ updatedAt: 1 });

  await db.createCollection('cables');
  await db.collection('cables').createIndex({ ispId: 1 }, { unique: true });
  await db.collection('cables').createIndex({ createdAt: 1 });
  await db.collection('cables').createIndex({ updatedAt: 1 });
  await db.collection('cables').createIndex({ boxA: 1 });
  await db.collection('cables').createIndex({ boxB: 1 });
}

export async function down(db: Db, _client: ClientSession): Promise<void> {
  await db.collection('boxes').drop();
  await db.collection('cables').drop();
}
