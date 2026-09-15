#!/usr/bin/env node

/**
 * Migration / Seeding Script: Convex Backup Articles -> Firebase Firestore
 * 
 * Reads all 109 articles from `convex-data-backup/articles/documents.jsonl`
 * and imports them directly into Firebase Firestore using your .env credentials.
 * 
 * Usage:
 *   npm run seed:firebase
 *   node scripts/seed-articles-to-firebase.js
 *   node scripts/seed-articles-to-firebase.js --upload-cloudinary
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BACKUP_FILE = path.join(ROOT_DIR, "convex-data-backup", "articles", "documents.jsonl");

const apiKey = (process.env.VITE_FIREBASE_API_KEY || "").trim();
const projectId = (process.env.VITE_FIREBASE_PROJECT_ID || "").trim();
const shouldUploadCloudinary = process.argv.includes("--upload-cloudinary");
const cloudinaryCloudName = (process.env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
const cloudinaryPreset = (process.env.VITE_CLOUDINARY_UPLOAD_PRESET || "").trim();

const isFirebaseConfigured = Boolean(
  apiKey &&
  projectId &&
  !apiKey.includes("your_") &&
  !projectId.includes("your_")
);

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

async function uploadBase64ToCloudinary(base64Data, filename) {
  if (!cloudinaryCloudName || !cloudinaryPreset || cloudinaryCloudName.includes("your_")) {
    return null;
  }
  try {
    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("upload_preset", cloudinaryPreset);
    formData.append("folder", "swadeshvaani/articles");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.secure_url;
    }
  } catch (err) {
    console.warn(`[Cloudinary Warning] Could not upload image for ${filename}:`, err.message);
  }
  return null;
}

async function main() {
  console.log("=================================================");
  console.log("  Swadesh Vaani - Article Migration to Firebase  ");
  console.log("=================================================\n");

  if (!fs.existsSync(BACKUP_FILE)) {
    console.error(`❌ Backup file not found at: ${BACKUP_FILE}`);
    process.exit(1);
  }

  if (!isFirebaseConfigured) {
    console.error("❌ Firebase credentials missing in .env!");
    console.error("Please add VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID to your .env file.");
    process.exit(1);
  }

  // Read and parse backup articles
  console.log(`📂 Reading backup from: ${path.relative(ROOT_DIR, BACKUP_FILE)}...`);
  const articles = [];
  const fileStream = fs.createReadStream(BACKUP_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const doc = JSON.parse(trimmed);
      articles.push(doc);
    } catch (e) {
      console.warn("Skipping invalid JSON line:", e.message);
    }
  }

  console.log(`✅ Loaded ${articles.length} articles from backup!\n`);
  console.log(`🔗 Target Firebase Project: ${projectId}`);
  console.log(`☁️  Cloudinary Cloud: ${cloudinaryCloudName || "None"} (preset: ${cloudinaryPreset || "None"})\n`);

  // Test Firestore connectivity
  const testUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/articles?key=${apiKey}&pageSize=1`;
  const testRes = await fetch(testUrl);
  const testJson = await testRes.json();

  if (!testRes.ok && testJson.error) {
    if (testJson.error.status === "PERMISSION_DENIED" || testJson.error.message?.includes("permissions")) {
      console.error("❌ Firestore Permission Denied (Production Mode Rules)");
      console.error("Aapne Production mode chuna hai, isliye Firestore ne default me 'allow read, write: if false;' laga diya hai.");
      console.error("\n👉 Kripya Firebase Console me 'Rules' tab par jayein:");
      console.error(`   https://console.firebase.google.com/project/${projectId}/firestore/databases/-default-/rules`);
      console.error("\nAur rules ko badal kar yeh kar dein aur 'Publish' dabayein:\n");
      console.error("rules_version = '2';");
      console.error("service cloud.firestore {");
      console.error("  match /databases/{database}/documents {");
      console.error("    match /{document=**} {");
      console.error("      allow read, write: if true;");
      console.error("    }");
      console.error("  }");
      console.error("}\n");
      console.error("Rules Publish karne ke baad dobara run karein: npm run seed:firebase\n");
      process.exit(1);
    } else if (testJson.error.message?.includes("has not been used")) {
      console.error("❌ Firestore Database is not enabled yet in your Firebase Project!");
      console.error("👉 Please enable Firestore by visiting the Firebase Console:");
      console.error(`   https://console.firebase.google.com/project/${projectId}/firestore\n`);
      process.exit(1);
    } else {
      console.error("❌ Firestore connection error:", testJson.error.message);
      process.exit(1);
    }
  }

  console.log("🚀 Uploading articles to Firestore...");

  let uploadedCloudinary = 0;
  let successCount = 0;
  const batchSize = 10;

  for (let i = 0; i < articles.length; i += batchSize) {
    const chunk = articles.slice(i, i + batchSize);

    // Concurrent Cloudinary image uploads for this batch
    if (shouldUploadCloudinary) {
      await Promise.all(
        chunk.map(async (raw, idx) => {
          const docId = String(raw.customId || raw._id || `art-${Date.now()}-${i + idx}`);
          if (raw.image && raw.image.startsWith("data:image/")) {
            const cUrl = await uploadBase64ToCloudinary(raw.image, docId);
            if (cUrl) {
              raw.image = cUrl;
              uploadedCloudinary++;
              console.log(`  [${i + idx + 1}/${articles.length}] ☁️  Cloudinary image uploaded (${docId})`);
            } else {
              console.log(`  [${i + idx + 1}/${articles.length}] ⚠️  Cloudinary failed, falling back (${docId})`);
            }
          }
        })
      );
    }

    const writes = [];
    for (let j = 0; j < chunk.length; j++) {
      const raw = chunk[j];
      const docId = String(raw.customId || raw._id || `art-${Date.now()}-${i + j}`);
      const imageUrl = raw.image || "";

      const articleData = {
        customId: docId,
        title: raw.title || "",
        slug: raw.slug || "",
        category: raw.category || "झारखंड",
        district: raw.district || "Ranchi",
        subDistrict: raw.subDistrict || "",
        author: raw.author || raw.reporter || "स्वदेश वाणी ब्यूरो",
        reporter: raw.reporter || raw.author || "स्वदेश वाणी ब्यूरो",
        excerpt: raw.excerpt || "",
        content: raw.content || "",
        image: imageUrl,
        date: raw.date || "",
        readTime: raw.readTime || "2 min",
        status: "Published",
        createdAt: raw._creationTime || Date.now(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
      };

      writes.push({
        update: {
          name: `projects/${projectId}/databases/(default)/documents/articles/${docId}`,
          fields: toFirestoreFields(articleData),
        },
      });
    }

    // Commit batch to Firestore
    const commitUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit?key=${apiKey}`;
    const commitRes = await fetch(commitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ writes }),
    });

    if (!commitRes.ok) {
      const err = await commitRes.json().catch(() => ({}));
      console.error(`❌ Batch write error (${i + 1}-${i + chunk.length}):`, err.error?.message || commitRes.statusText);
    } else {
      successCount += chunk.length;
      console.log(`  ✅ Written articles ${i + 1} to ${Math.min(i + chunk.length, articles.length)} of ${articles.length} into Firestore`);
    }
  }

  console.log("\n=================================================");
  console.log("  Migration Summary:                             ");
  console.log(`  Total articles in backup: ${articles.length}   `);
  console.log(`  Successfully saved in Firestore: ${successCount}`);
  if (shouldUploadCloudinary) {
    console.log(`  Images stored on Cloudinary: ${uploadedCloudinary}`);
  }
  console.log("=================================================\n");
  console.log("🎉 All news articles are now active in Firebase Firestore!");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
