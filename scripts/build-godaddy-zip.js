import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ZipArchive } from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

async function createPackage() {
  // 0. Ensure server/dist is synchronized with fresh root dist
  const distPath = path.join(projectRoot, "dist");
  const serverDistPath = path.join(projectRoot, "server", "dist");
  if (fs.existsSync(distPath)) {
    if (fs.existsSync(serverDistPath)) {
      fs.rmSync(serverDistPath, { recursive: true, force: true });
    }
    fs.cpSync(distPath, serverDistPath, { recursive: true });
    console.log("✅ Synchronized fresh dist/ to server/dist/");
  }

  const zipPath = path.join(projectRoot, "swadeshvaani-latest.zip");
  const fallbackZipPath = path.join(projectRoot, "godaddy-fullstack-deploy.zip");
  
  [zipPath, fallbackZipPath].forEach((p) => {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  const output = fs.createWriteStream(zipPath);
  const archive = new ZipArchive({
    zlib: { level: 9 },
    forceLocalTime: true,
  });

  return new Promise((resolve, reject) => {
    output.on("close", () => {
      fs.copyFileSync(zipPath, fallbackZipPath);
      console.log(`\n🎉 Successfully packaged ${archive.pointer()} total bytes!`);
      console.log(`📦 Latest Output: ${zipPath}`);
      console.log(`📦 Fallback Output: ${fallbackZipPath}\n`);
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    // 1. Generate optimized production package.json for GoDaddy Node.js installer
    const productionPackageJson = {
      name: "swadeshvaani",
      version: "1.0.0",
      private: true,
      type: "module",
      main: "server/index.js",
      scripts: {
        start: "node server/index.js",
        build: "echo 'Frontend pre-built in dist/'",
      },
      engines: {
        node: ">=18.0.0",
      },
      dependencies: {
        "@whiskeysockets/baileys": "^6.7.9",
        cors: "^2.8.5",
        dotenv: "^16.4.7",
        express: "^4.21.2",
        nodemailer: "^9.0.5",
        pino: "^9.6.0",
        qrcode: "^1.5.4",
      },
    };

    archive.append(JSON.stringify(productionPackageJson, null, 2), {
      name: "package.json",
    });

    // 2. Root configuration files
    const rootFiles = [
      "index.html",
      ".env",
    ];

    rootFiles.forEach((file) => {
      const fullPath = path.join(projectRoot, file);
      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: file });
      }
    });

    // 3. Directories (src, public, server, dist, convex, .airo)
    const dirs = ["src", "public", "server", "dist", "convex", ".airo"];
    dirs.forEach((dir) => {
      const fullDir = path.join(projectRoot, dir);
      if (fs.existsSync(fullDir)) {
        archive.directory(fullDir, dir, (entry) => {
          // Force POSIX forward slashes & ignore node_modules / .ps1 / .git
          if (
            entry.name.includes("node_modules") ||
            entry.name.endsWith(".ps1") ||
            entry.name.includes(".git")
          ) {
            return false;
          }
          entry.name = entry.name.replace(/\\/g, "/");
          return entry;
        });
      }
    });

    archive.finalize();
  });
}

createPackage().catch((err) => {
  console.error("Error creating package:", err);
  process.exit(1);
});
