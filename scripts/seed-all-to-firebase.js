import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const apiKey = process.env.VITE_FIREBASE_API_KEY;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (!apiKey || !projectId) {
  console.error('❌ Missing Firebase credentials in .env!');
  process.exit(1);
}

const firestoreBaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function objectToFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('_')) continue; // Skip internal Convex _id, _creationTime
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

async function commitBatch(writes) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Firestore Commit Failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

async function migrateCollection(collectionName, idField = 'customId') {
  const filePath = path.join(rootDir, 'convex-data-backup', collectionName, 'documents.jsonl');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Backup not found for ${collectionName}, skipping.`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) {
    console.log(`ℹ️ ${collectionName} has 0 records, skipping.`);
    return;
  }

  const lines = content.split('\n').filter(Boolean);
  console.log(`\n📂 Migrating ${collectionName} (${lines.length} records)...`);

  const writes = [];
  for (const line of lines) {
    try {
      const doc = JSON.parse(line);
      const docId = String(doc[idField] || doc.id || doc._id);
      const fields = objectToFirestoreFields(doc);

      // Map common normalized fields
      if (collectionName === 'notifications') {
        fields.url = fields.url || toFirestoreValue('');
        fields.read = fields.read || fields.isRead || toFirestoreValue(false);
        fields.timestamp = fields.timestamp || toFirestoreValue(doc._creationTime || Date.now());
      }
      if (collectionName === 'subscribers') {
        fields.status = fields.status || toFirestoreValue('Active');
      }

      writes.push({
        update: {
          name: `projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}`,
          fields,
        },
      });
    } catch (e) {
      console.warn(`Could not parse line in ${collectionName}:`, e.message);
    }
  }

  // Batch commit in chunks of 50
  const CHUNK_SIZE = 50;
  for (let i = 0; i < writes.length; i += CHUNK_SIZE) {
    const chunk = writes.slice(i, i + CHUNK_SIZE);
    await commitBatch(chunk);
    console.log(`  ✅ Written ${collectionName} ${i + 1} to ${Math.min(i + chunk.length, writes.length)}`);
  }
  console.log(`🎉 ${collectionName} migration complete!`);
}

async function run() {
  console.log('====================================================');
  console.log('  Swadesh Vaani - Migrating All Backup Data to Firebase');
  console.log(`  Target Project: ${projectId}`);
  console.log('====================================================');

  await migrateCollection('adminUsers', 'username');
  await migrateCollection('subscribers', 'customId');
  await migrateCollection('users', 'customId');
  await migrateCollection('notifications', 'customId');

  console.log('\n🌟 ALL BACKUP COLLECTIONS HAVE BEEN IMPORTED TO FIREBASE!');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
