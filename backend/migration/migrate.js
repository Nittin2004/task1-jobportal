/**
 * ╔══════════════════════════════════════════════════════════════╗
 *  MongoDB Atlas Migration Script
 *  Transfers local Compass export → Atlas
 * ╚══════════════════════════════════════════════════════════════╝
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const ATLAS_URI = process.env.MONGO_URI;

console.log('Using URI:', ATLAS_URI ? ATLAS_URI.replace(/:([^@]+)@/, ':****@') : 'NOT FOUND - check .env');
const DB_NAME  = 'jobportal';

// Map file names → collection names
const FILE_MAP = {
  'jobportal.users.json':        'users',
  'jobportal.jobs.json':         'jobs',
  'jobportal.applications.json': 'applications',
  'jobportal.companies.json':    'companies',
  'jobportal.submissions.json':  'submissions',
  'jobportal.savedjobs.json':    'savedjobs',
  'jobportal.bookings.json':     'bookings',
  'jobportal.transactions.json': 'transactions',
  'jobportal.courses.json':      'courses',
};

// ── Convert MongoDB Extended JSON ($oid, $date) to native types ──
function convertExtendedJSON(obj) {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(convertExtendedJSON);
  }

  if (typeof obj === 'object') {
    // Handle $oid
    if (obj.$oid !== undefined) {
      return new ObjectId(obj.$oid);
    }
    // Handle $date
    if (obj.$date !== undefined) {
      return new Date(obj.$date);
    }
    // Recurse into nested objects
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = convertExtendedJSON(obj[key]);
    }
    return result;
  }

  return obj;
}

async function migrate() {
  const client = new MongoClient(ATLAS_URI);

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('  🚀 MongoDB Atlas Migration Starting...   ');
  console.log('╚══════════════════════════════════════════╝\n');

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!\n');

    const db = client.db(DB_NAME);
    const migrationDir = __dirname;

    let totalImported = 0;
    let totalSkipped  = 0;

    // Process each file
    for (const [fileName, collectionName] of Object.entries(FILE_MAP)) {
      const filePath = path.join(migrationDir, fileName);

      // Skip if file doesn't exist
      if (!fs.existsSync(filePath)) {
        console.log(`⏭️  Skipping  [${collectionName}] — file not found`);
        totalSkipped++;
        continue;
      }

      try {
        // Read & parse JSON
        const raw  = fs.readFileSync(filePath, 'utf-8');
        const docs = JSON.parse(raw);

        if (!Array.isArray(docs) || docs.length === 0) {
          console.log(`⚠️  Empty     [${collectionName}] — no documents`);
          continue;
        }

        // Convert Extended JSON → native MongoDB types
        const converted = docs.map(convertExtendedJSON);

        const collection = db.collection(collectionName);

        // Drop existing data to avoid duplicates
        await collection.deleteMany({});

        // Insert all documents
        const result = await collection.insertMany(converted, { ordered: false });

        console.log(`✅ Imported  [${collectionName}] — ${result.insertedCount} documents`);
        totalImported += result.insertedCount;

      } catch (err) {
        console.error(`❌ Failed    [${collectionName}] — ${err.message}`);
      }
    }

    console.log('\n╔══════════════════════════════════════════╗');
    console.log(`  ✅ Migration Complete!`);
    console.log(`  📦 Total Documents Imported: ${totalImported}`);
    console.log(`  ⏭️  Collections Skipped:      ${totalSkipped}`);
    console.log('╚══════════════════════════════════════════╝\n');
    console.log('🎉 Your data is now live on MongoDB Atlas!\n');

  } catch (err) {
    console.error('\n❌ Migration Failed:', err.message);
    console.error('   Check your MONGO_URI in .env and try again.\n');
  } finally {
    await client.close();
  }
}

migrate();
