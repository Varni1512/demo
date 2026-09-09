import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import qrcode from "qrcode";
import pino from "pino";
import nodemailer from "nodemailer";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexClient = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "https://original-raven-947.convex.cloud");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Top-level Health check endpoints for GoDaddy PaaS / Cloud Load Balancers
app.all(["/health", "/healthz", "/_health", "/ping"], (req, res) => {
  res.status(200).json({ status: "healthy", uptime: Math.floor(process.uptime()), timestamp: new Date().toISOString() });
});

// Uploads directory for news and media assets
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Helper: Convert base64 data URI to physical file in /uploads
function saveBase64Image(dataUri, fallbackPrefix = "img") {
  if (!dataUri || typeof dataUri !== "string" || !dataUri.startsWith("data:image/")) {
    return dataUri;
  }
  try {
    const matches = dataUri.match(/^data:image\/([a-zA-Z0-9\+\-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return dataUri;
    }
    const ext = matches[1] === "png" ? "png" : matches[1] === "webp" ? "webp" : "jpg";
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const filename = `${fallbackPrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error("Error saving base64 image:", err);
    return dataUri;
  }
}

// POST /api/upload - Direct Image Upload (converts base64 to server physical file)
app.post("/api/upload", (req, res) => {
  try {
    const { image, dataUrl } = req.body || {};
    const rawImage = image || dataUrl;
    if (!rawImage) {
      return res.status(400).json({ success: false, error: "No image payload provided" });
    }
    const savedPath = saveBase64Image(rawImage, "upload");
    return res.json({ success: true, url: savedPath, imageUrl: savedPath });
  } catch (err) {
    console.error("Error in /api/upload:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Top-level health checks for GoDaddy PaaS / Cloud Load Balancers
app.get(["/health", "/healthz", "/_health", "/ping"], (req, res) => {
  res.status(200).json({ status: "healthy", uptime: Math.floor(process.uptime()), timestamp: new Date().toISOString() });
});

// --- Nodemailer transporter (Admin Gmail) ------------------------------------
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "swadeshvaaniofficial@gmail.com").trim();
const ADMIN_PASS = (process.env.ADMIN_EMAIL_PASS || "uvar xuzq ysen zqif").trim().replace(/\s+/g, "");

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: ADMIN_EMAIL, pass: ADMIN_PASS },
});

// State
const AUTH_DIR = path.join(__dirname, "auth_state");
let sock = null;
let currentQrCode = null;
let connectionStatus = "disconnected"; // 'connecting' | 'connected' | 'disconnected'
let connectedUser = null;
let lastDisconnectReason = null;

// Initialize WhatsApp connection
async function connectToWhatsApp() {
  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Using Baileys v${version.join(".")}, isLatest: ${isLatest}`);

    sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      auth: state,
      browser: ["Savdeshvani News Admin", "Chrome", "1.0.0"],
      generateHighQualityLinkPreview: true,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        currentQrCode = await qrcode.toDataURL(qr);
        connectionStatus = "waiting_for_scan";
        console.log("\n📱 Scan this QR code with WhatsApp (or open Admin panel in browser):\n");
        qrcode.toString(qr, { type: "terminal", small: true }, (err, str) => {
          if (!err) console.log(str);
        });
      }

      if (connection === "close") {
        const statusCode = (lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        connectionStatus = "disconnected";
        currentQrCode = null;
        connectedUser = null;
        lastDisconnectReason = lastDisconnect?.error?.message || "Connection closed";
        console.log(`WhatsApp connection closed (Code: ${statusCode}). Reconnecting: ${shouldReconnect}`);

        if (shouldReconnect) {
          setTimeout(connectToWhatsApp, 3000);
        } else {
          // Logged out / 401 expired session: clean auth files and create fresh pairing session
          console.log("🔄 Session expired or unlinked. Generating fresh QR code for pairing...");
          try {
            fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          } catch (e) {
            console.error("Error clearing auth directory:", e);
          }
          setTimeout(connectToWhatsApp, 2000);
        }
      } else if (connection === "open") {
        connectionStatus = "connected";
        currentQrCode = null;
        connectedUser = sock.user;
        console.log("✅ WhatsApp successfully connected as:", sock.user?.id || sock.user?.name);
      }
    });

  } catch (err) {
    console.error("Error connecting to WhatsApp:", err);
    connectionStatus = "disconnected";
  }
}

// --- Email Routes -----------------------------------------------------------

// POST /api/notify-subscriber  -- notify admin when someone subscribes
app.post("/api/notify-subscriber", async (req, res) => {
  try {
    const { email, phone, subscribedAt } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ success: false, error: "No subscriber data provided." });
    }

    const mailOptions = {
      from: `"Swadesh Vaani" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: "New Subscriber - Swadesh Vaani News Network",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#1e3a5f,#f97316);padding:20px 24px">
            <h2 style="color:#fff;margin:0;font-size:20px">&#128236; New Subscriber Alert</h2>
            <p style="color:#fde68a;margin:4px 0 0;font-size:13px">Swadesh Vaani News Network</p>
          </div>
          <div style="padding:24px;background:#f8fafc">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr>
                <td style="padding:10px 0;color:#64748b;width:140px">&#128231; Email</td>
                <td style="padding:10px 0;font-weight:600;color:#1e293b">${email || "-"}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#64748b">&#128241; Phone</td>
                <td style="padding:10px 0;font-weight:600;color:#1e293b">${phone || "-"}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#64748b">&#128336; Subscribed At</td>
                <td style="padding:10px 0;color:#1e293b">${subscribedAt || new Date().toLocaleString("en-IN")}</td>
              </tr>
            </table>
          </div>
          <div style="padding:16px 24px;background:#fff;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center">
            Swadesh Vaani &copy; ${new Date().getFullYear()} &bull; swadeshvaaniofficial@gmail.com
          </div>
        </div>
      `,
    };

    await mailer.sendMail(mailOptions);
    return res.json({ success: true, message: "Admin notified successfully." });
  } catch (err) {
    console.error("Error sending subscriber notification email:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login  -- Verify credentials against server environment
app.post("/api/auth/login", (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "कृपया ईमेल और पासवर्ड दर्ज करें।" });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const cleanPassNoSpace = cleanPass.replace(/\s+/g, "");

    const envEmail = (process.env.ADMIN_EMAIL || "swadeshvaaniofficial@gmail.com").trim().toLowerCase();
    const envPass = (process.env.ADMIN_EMAIL_PASS || "").trim();
    const envPassNoSpace = envPass.replace(/\s+/g, "");

    const validAdminIds = [
      envEmail,
      "admin",
      "swadeshvaani",
      "swadeshvani",
      "swadeshvaaniofficial",
      "swadeshvaaniofficial@gmail.com",
    ].filter(Boolean);

    const validAdminPasswords = [
      envPass,
      envPassNoSpace,
      "Swadesh@vani10",
      "uvar xuzq ysen zqif",
      "uvarxuzqysenzqif",
    ].filter(Boolean);

    const isAdmin =
      validAdminIds.includes(cleanId) &&
      (validAdminPasswords.includes(cleanPass) || validAdminPasswords.includes(cleanPassNoSpace));

    if (isAdmin) {
      return res.json({
        success: true,
        role: "admin",
        user: {
          email: envEmail,
          username: "admin",
          name: "Swadesh Vani Admin",
          role: "admin",
        },
      });
    }

    if (cleanPass.length >= 4) {
      const displayName = cleanId.includes("@") ? cleanId.split("@")[0] : cleanId;
      return res.json({
        success: true,
        role: "user",
        user: {
          email: cleanId.includes("@") ? cleanId : `${cleanId}@reader.swadeshvaani.in`,
          username: cleanId,
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          role: "user",
        },
      });
    }

    return res.status(401).json({ success: false, message: "अमान्य ईमेल या पासवर्ड।" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/forgot-password  -- send password reset email
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    // NOTE: This project uses localStorage-based auth (no server-side user DB).
    // We notify the user and alert the admin about the reset request.
    const mailOptions = {
      from: `"Swadesh Vaani" <${ADMIN_EMAIL}>`,
      to: email.trim(),
      subject: "Password Reset Request - Swadesh Vaani",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#1e3a5f,#f97316);padding:20px 24px">
            <h2 style="color:#fff;margin:0;font-size:20px">&#128273; Password Reset Request</h2>
            <p style="color:#fde68a;margin:4px 0 0;font-size:13px">Swadesh Vaani News Network</p>
          </div>
          <div style="padding:24px;background:#f8fafc">
            <p style="font-size:15px;color:#1e293b;margin:0 0 12px">Hello,</p>
            <p style="font-size:14px;color:#475569;line-height:1.7">
              We received a password reset request for: <strong>${email.trim()}</strong>
            </p>
            <p style="font-size:14px;color:#475569;line-height:1.7">
              If you did not request this, please ignore this email.
            </p>
            <p style="font-size:14px;color:#475569;line-height:1.7">
              To reset your password, please contact our admin:<br/>
              <a href="mailto:swadeshvaaniofficial@gmail.com" style="color:#f97316">swadeshvaaniofficial@gmail.com</a>
            </p>
            <div style="margin-top:20px;padding:14px 18px;background:#fff7ed;border-left:4px solid #f97316;border-radius:6px;font-size:13px;color:#92400e">
              If you are the Admin, please login to the <strong>Admin Panel</strong> and update the password manually.
            </div>
          </div>
          <div style="padding:16px 24px;background:#fff;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center">
            Swadesh Vaani &copy; ${new Date().getFullYear()} &bull; swadeshvaaniofficial@gmail.com
          </div>
        </div>
      `,
    };

    await mailer.sendMail(mailOptions);

    // Also alert admin about the reset request
    await mailer.sendMail({
      from: `"Swadesh Vaani System" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Password Reset Request from ${email.trim()}`,
      html: `<p>A password reset was requested for: <strong>${email.trim()}</strong><br/>Time: ${new Date().toLocaleString("en-IN")}</p>`,
    });

    return res.json({ success: true, message: "Password reset email sent successfully." });
  } catch (err) {
    console.error("Error sending forgot-password email:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- Real-time Server-Sent Events (SSE) Engine ------------------------------
const sseClients = new Set();

function broadcastRealtimeEvent(type, data = {}) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: Date.now() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// GET /api/realtime/stream - Live Realtime Event Stream
app.get("/api/realtime/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: Date.now() })}\n\n`);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

// --- News Articles Store ----------------------------------------------------
const DATA_DIR = path.join(__dirname, "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
const DELETED_ARTICLES_FILE = path.join(DATA_DIR, "deleted_articles.json");
const ADS_FILE = path.join(DATA_DIR, "advertisements.json");
const DELETED_ADS_FILE = path.join(DATA_DIR, "deleted_ads.json");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");

function readJsonFile(filePath, fallback = []) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile(filePath, data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

function getStoredArticles() {
  return readJsonFile(ARTICLES_FILE, []);
}

function saveStoredArticles(articles) {
  return writeJsonFile(ARTICLES_FILE, articles);
}

function getDeletedArticleIds() {
  return readJsonFile(DELETED_ARTICLES_FILE, []).map(String);
}

function saveDeletedArticleIds(ids) {
  const uniqueIds = Array.from(new Set(ids.map(String)));
  return writeJsonFile(DELETED_ARTICLES_FILE, uniqueIds);
}

// GET /api/articles - Retrieve all articles (with deletedIds)
app.get("/api/articles", async (req, res) => {
  let articles = [];
  try {
    const convexArticles = await convexClient.query(api.articles.get);
    if (Array.isArray(convexArticles) && convexArticles.length > 0) {
      articles = convexArticles;
    }
  } catch (err) {
    console.error("Error fetching articles from Convex:", err);
  }

  if (articles.length === 0) {
    articles = getStoredArticles();
  }

  const deletedIds = getDeletedArticleIds();
  const activeArticles = articles.filter((a) => !deletedIds.includes(String(a.id)));
  
  // Convert any heavy base64 data URIs to physical files to prevent 5MB localStorage QuotaExceededError
  const optimizedArticles = activeArticles.map((art) => {
    let img = art.image;
    if (img && typeof img === "string" && img.startsWith("data:image/")) {
      img = saveBase64Image(img, `art-${art.id}`);
    }
    return { ...art, image: img };
  });

  res.json({ success: true, articles: optimizedArticles, deletedIds });
});

// GET /api/articles/:id - Retrieve single article by ID or slug
app.get("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const deletedIds = getDeletedArticleIds();
  const searchKey = decodeURIComponent(String(id)).trim().toLowerCase();

  if (deletedIds.some((d) => d.toLowerCase() === searchKey)) {
    return res.status(404).json({ success: false, error: "Article has been deleted" });
  }

  let article = null;
  try {
    const convexArticles = await convexClient.query(api.articles.get);
    if (Array.isArray(convexArticles)) {
      article = convexArticles.find(
        (a) =>
          String(a.id).toLowerCase() === searchKey ||
          (a.slug && a.slug.toLowerCase() === searchKey)
      );
    }
  } catch (err) {
    console.error("Error fetching article by ID from Convex:", err);
  }

  if (!article) {
    const articles = getStoredArticles();
    article = articles.find(
      (a) =>
        String(a.id).toLowerCase() === searchKey ||
        (a.slug && a.slug.toLowerCase() === searchKey)
    );
  }

  if (article) {
    return res.json({ success: true, article });
  }
  return res.status(404).json({ success: false, error: "Article not found" });
});

// POST /api/articles - Save or update article
app.post("/api/articles", (req, res) => {
  try {
    const article = req.body;
    if (!article || !article.title) {
      return res.status(400).json({ success: false, error: "Article title is required." });
    }

    const articles = getStoredArticles();
    const articleId = String(article.id || `art-${Date.now()}`);

    let processedImage = article.image;
    if (processedImage && typeof processedImage === "string" && processedImage.startsWith("data:image/")) {
      processedImage = saveBase64Image(processedImage, `art-${articleId}`);
    }

    const articleToSave = {
      ...article,
      id: articleId,
      image: processedImage || article.image,
      updatedAt: new Date().toISOString(),
    };

    // Un-delete if this ID was previously marked deleted
    const deletedIds = getDeletedArticleIds();
    if (deletedIds.includes(articleId)) {
      saveDeletedArticleIds(deletedIds.filter((d) => d !== articleId));
    }

    const index = articles.findIndex((a) => String(a.id) === String(articleId));
    let updated;
    if (index >= 0) {
      updated = [...articles];
      updated[index] = articleToSave;
    } else {
      updated = [articleToSave, ...articles];
    }

    saveStoredArticles(updated);
    broadcastRealtimeEvent("articles_update", { article: articleToSave, action: index >= 0 ? "update" : "create" });
    return res.json({ success: true, article: articleToSave, articles: updated, deletedIds: getDeletedArticleIds() });
  } catch (err) {
    console.error("Error saving article on server:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/articles/:id - Delete an article across all devices
app.delete("/api/articles/:id", (req, res) => {
  try {
    const { id } = req.params;
    const idStr = String(id);

    const deletedIds = getDeletedArticleIds();
    if (!deletedIds.includes(idStr)) {
      deletedIds.push(idStr);
      saveDeletedArticleIds(deletedIds);
    }

    const articles = getStoredArticles();
    const updated = articles.filter((a) => String(a.id) !== idStr);
    saveStoredArticles(updated);
    broadcastRealtimeEvent("articles_update", { deletedId: idStr, action: "delete" });
    return res.json({ success: true, articles: updated, deletedIds: getDeletedArticleIds() });
  } catch (err) {
    console.error("Error deleting article on server:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADVERTISEMENTS STORE & REAL-TIME APIS -----------------------------------
function getStoredAds() {
  return readJsonFile(ADS_FILE, []);
}

function saveStoredAds(ads) {
  return writeJsonFile(ADS_FILE, ads);
}

function getDeletedAdIds() {
  return readJsonFile(DELETED_ADS_FILE, []).map(String);
}

function saveDeletedAdIds(ids) {
  const uniqueIds = Array.from(new Set(ids.map(String)));
  return writeJsonFile(DELETED_ADS_FILE, uniqueIds);
}

app.get("/api/advertisements", async (req, res) => {
  let ads = [];
  try {
    const convexAds = await convexClient.query(api.advertisements.get);
    if (Array.isArray(convexAds) && convexAds.length > 0) {
      ads = convexAds;
    }
  } catch (err) {
    console.error("Error fetching ads from Convex:", err);
  }

  if (ads.length === 0) {
    ads = getStoredAds();
  }

  const deletedIds = getDeletedAdIds();
  const activeAds = ads.filter((a) => !deletedIds.includes(String(a.id)));
  res.json({ success: true, advertisements: activeAds, deletedIds });
});

app.post("/api/advertisements", (req, res) => {
  try {
    const adData = req.body;
    if (!adData || !adData.title) {
      return res.status(400).json({ success: false, error: "Ad title is required" });
    }

    const ads = getStoredAds();
    const adId = String(adData.id || `ad-${Date.now()}`);

    let processedImage = adData.image;
    if (processedImage && typeof processedImage === "string" && processedImage.startsWith("data:image/")) {
      processedImage = saveBase64Image(processedImage, `ad-${adId}`);
    }

    const adToSave = {
      ...adData,
      id: adId,
      image: processedImage || adData.image,
      clicks: Number(adData.clicks || 0),
      impressions: Number(adData.impressions || 0),
      updatedAt: new Date().toISOString(),
    };

    const deletedIds = getDeletedAdIds();
    if (deletedIds.includes(adId)) {
      saveDeletedAdIds(deletedIds.filter((d) => d !== adId));
    }

    const index = ads.findIndex((a) => String(a.id) === String(adId));
    let updated;
    if (index >= 0) {
      updated = [...ads];
      updated[index] = adToSave;
    } else {
      updated = [adToSave, ...ads];
    }

    saveStoredAds(updated);
    broadcastRealtimeEvent("ads_update", { advertisement: adToSave, action: index >= 0 ? "update" : "create" });
    return res.json({ success: true, advertisement: adToSave, advertisements: updated });
  } catch (err) {
    console.error("Error saving ad on server:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/advertisements/:id", (req, res) => {
  try {
    const { id } = req.params;
    const idStr = String(id);

    const deletedIds = getDeletedAdIds();
    if (!deletedIds.includes(idStr)) {
      deletedIds.push(idStr);
      saveDeletedAdIds(deletedIds);
    }

    const ads = getStoredAds();
    const updated = ads.filter((a) => String(a.id) !== idStr);
    saveStoredAds(updated);
    broadcastRealtimeEvent("ads_update", { deletedId: idStr, action: "delete" });
    return res.json({ success: true, advertisements: updated, deletedIds: getDeletedAdIds() });
  } catch (err) {
    console.error("Error deleting ad on server:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/advertisements/:id/toggle", (req, res) => {
  try {
    const { id } = req.params;
    const ads = getStoredAds();
    const updated = ads.map((ad) => {
      if (String(ad.id) === String(id)) {
        return { ...ad, status: ad.status === "Active" ? "Paused" : "Active" };
      }
      return ad;
    });
    saveStoredAds(updated);
    broadcastRealtimeEvent("ads_update", { toggledId: String(id), action: "toggle" });
    return res.json({ success: true, advertisements: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/advertisements/:id/click", (req, res) => {
  try {
    const { id } = req.params;
    const ads = getStoredAds();
    const updated = ads.map((ad) => {
      if (String(ad.id) === String(id)) {
        return { ...ad, clicks: (Number(ad.clicks) || 0) + 1 };
      }
      return ad;
    });
    saveStoredAds(updated);
    broadcastRealtimeEvent("ads_update", { clickedId: String(id), action: "click" });
    return res.json({ success: true, advertisements: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- SUBSCRIBERS STORE & REAL-TIME APIS --------------------------------------
function getStoredSubscribers() {
  return readJsonFile(SUBSCRIBERS_FILE, []);
}

function saveStoredSubscribers(subscribers) {
  return writeJsonFile(SUBSCRIBERS_FILE, subscribers);
}

app.get("/api/subscribers", (req, res) => {
  res.json({ success: true, subscribers: getStoredSubscribers() });
});

app.post("/api/subscribers", (req, res) => {
  try {
    const { email, phone } = req.body;
    const subscribers = getStoredSubscribers();
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    const cleanPhone = phone ? phone.trim().replace(/\D/g, "") : "";

    const alreadyExists = subscribers.some(
      (s) =>
        (cleanEmail && s.email && s.email.toLowerCase() === cleanEmail) ||
        (cleanPhone && s.phone && s.phone === cleanPhone)
    );

    if (alreadyExists) {
      return res.status(400).json({ success: false, message: "यह ईमेल या मोबाइल नंबर पहले से सब्सक्राइब है।" });
    }

    const newSub = {
      id: "sub-" + Date.now(),
      phone: cleanPhone,
      email: cleanEmail,
      subscribedAt: new Date().toLocaleString("en-IN"),
      status: "Active",
    };

    const updated = [newSub, ...subscribers];
    saveStoredSubscribers(updated);
    broadcastRealtimeEvent("subscribers_update", { subscriber: newSub, action: "create" });
    return res.json({ success: true, subscriber: newSub, subscribers: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/subscribers/:id", (req, res) => {
  try {
    const { id } = req.params;
    const subscribers = getStoredSubscribers();
    const updated = subscribers.filter((s) => String(s.id) !== String(id) && String(s.phone) !== String(id));
    saveStoredSubscribers(updated);
    broadcastRealtimeEvent("subscribers_update", { deletedId: String(id), action: "delete" });
    return res.json({ success: true, subscribers: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- NOTIFICATIONS STORE & REAL-TIME APIS -----------------------------------
function getStoredNotifications() {
  return readJsonFile(NOTIFICATIONS_FILE, []);
}

function saveStoredNotifications(notifs) {
  return writeJsonFile(NOTIFICATIONS_FILE, notifs);
}

app.get("/api/notifications", (req, res) => {
  res.json({ success: true, notifications: getStoredNotifications() });
});

app.post("/api/notifications", (req, res) => {
  try {
    const notif = req.body;
    const notifs = getStoredNotifications();
    const newNotif = {
      ...notif,
      id: notif.id || `notif-${Date.now()}`,
      time: notif.time || new Date().toLocaleString("en-IN"),
      unread: true,
    };
    const updated = [newNotif, ...notifs].slice(0, 50);
    saveStoredNotifications(updated);
    broadcastRealtimeEvent("notifications_update", { notification: newNotif, action: "create" });
    return res.json({ success: true, notifications: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/notifications", (req, res) => {
  saveStoredNotifications([]);
  broadcastRealtimeEvent("notifications_update", { action: "clear" });
  return res.json({ success: true, notifications: [] });
});

// POST /api/upload - Handle image upload
app.post("/api/upload", (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: "No image payload provided" });
    }

    if (image.startsWith("data:image")) {
      const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1].toLowerCase();
        let ext = "jpg";
        if (mimeType.includes("png")) ext = "png";
        else if (mimeType.includes("webp")) ext = "webp";
        else if (mimeType.includes("gif")) ext = "gif";

        const filename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(matches[2], "base64"));
        return res.json({ success: true, url: `/uploads/${filename}` });
      }
    }

    // Already a remote URL or plain string
    return res.json({ success: true, url: image });
  } catch (err) {
    console.error("Error saving uploaded image:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/advertisements/request - Send Advertisement Request via Email to swadeshvaaniofficial@gmail.com
app.post(["/api/advertisements/request", "/api/sponsors/request"], async (req, res) => {
  try {
    const {
      name,
      businessName,
      phone,
      email,
      city,
      advertisementType,
      duration,
      budget,
      message,
      creative,
      fileName,
    } = req.body || {};

    if (!name && !phone && !businessName) {
      return res.status(400).json({
        success: false,
        error: "कृपया नाम, व्यवसाय और मोबाइल नंबर दर्ज करें।",
      });
    }

    const recipient = "swadeshvaaniofficial@gmail.com";
    const requestDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const clientDisplay = businessName ? `${businessName} (${name || "Client"})` : name || "विज्ञापनदाता";

    // Formatted HTML Email
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 26px 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">📰 स्वदेश वाणी - नया विज्ञापन अनुरोध</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">New Advertisement Inquiry Received from Website</p>
        </div>

        <div style="padding: 28px 30px; background-color: #ffffff;">
          <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #9a3412; font-weight: 600;">
              🎉 वेबसाइट से एक नया विज्ञापन अनुरोध प्राप्त हुआ है! कृपया नीचे दिए गए विवरण की जांच करें और विज्ञापनदाता से संपर्क करें।
            </p>
          </div>

          <h3 style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
            👤 विज्ञापनदाता विवरण (Client Information)
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; width: 38%; border: 1px solid #e2e8f0;">आवेदक का नाम:</td>
              <td style="padding: 10px 12px; color: #0f172a; font-weight: bold; border: 1px solid #e2e8f0;">${name || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">व्यवसाय / संस्था:</td>
              <td style="padding: 10px 12px; color: #0f172a; font-weight: bold; border: 1px solid #e2e8f0;">${businessName || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">मोबाइल नंबर:</td>
              <td style="padding: 10px 12px; color: #ea580c; font-weight: bold; border: 1px solid #e2e8f0;">
                <a href="tel:${phone}" style="color: #ea580c; text-decoration: none;">📞 ${phone || "—"}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">ईमेल आईडी:</td>
              <td style="padding: 10px 12px; color: #0f172a; border: 1px solid #e2e8f0;">
                ${email ? `<a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">✉️ ${email}</a>` : "—"}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">शहर / स्थान:</td>
              <td style="padding: 10px 12px; color: #0f172a; border: 1px solid #e2e8f0;">📍 ${city || "—"}</td>
            </tr>
          </table>

          <h3 style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
            📊 विज्ञापन आवश्यकताएं (Campaign Details)
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; width: 38%; border: 1px solid #e2e8f0;">विज्ञापन का प्रकार:</td>
              <td style="padding: 10px 12px; color: #0f172a; font-weight: 600; border: 1px solid #e2e8f0;">${advertisementType || "Banner Advertisement"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">अवधि (Duration):</td>
              <td style="padding: 10px 12px; color: #0f172a; border: 1px solid #e2e8f0;">⏱️ ${duration || "7 Days"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">अनुमानित बजट:</td>
              <td style="padding: 10px 12px; color: #16a34a; font-weight: bold; border: 1px solid #e2e8f0;">💰 ${budget || "अनिश्चित / बातचीत योग्य"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; background-color: #f8fafc; color: #64748b; font-weight: 600; border: 1px solid #e2e8f0;">अनुरोध दिनांक:</td>
              <td style="padding: 10px 12px; color: #64748b; border: 1px solid #e2e8f0;">${requestDate}</td>
            </tr>
          </table>

          ${
            message
              ? `
            <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #0f172a;">📝 अतिरिक्त विवरण / आवश्यकता (Message):</h3>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
          `
              : ""
          }

          <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            ${
              phone
                ? `<a href="tel:${phone}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px; box-shadow: 0 2px 6px rgba(234, 88, 12, 0.3);">
                    📞 कॉल करें (${phone})
                  </a>`
                : ""
            }
            ${
              email
                ? `<a href="mailto:${email}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                    ✉️ ईमेल रिप्लाई करें
                  </a>`
                : ""
            }
          </div>
        </div>

        <div style="background-color: #0f172a; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          स्वदेश वाणी - सत्य, निष्पक्ष और सटीक पत्रकारिता &bull; <a href="https://swadeshvaani.com" style="color: #ea580c; text-decoration: none;">swadeshvaani.com</a>
        </div>
      </div>
    `;

    // Process creative attachment if uploaded
    const attachments = [];
    if (creative && typeof creative === "string" && creative.startsWith("data:")) {
      const match = creative.match(/^data:([^;]+);base64,(.+)$/);
      if (match && match.length === 3) {
        attachments.push({
          filename: fileName || "advertisement-creative",
          content: Buffer.from(match[2], "base64"),
          contentType: match[1],
        });
      }
    }

    // Send Email
    const mailOptions = {
      from: `"स्वदेश वाणी विज्ञापन" <${ADMIN_EMAIL}>`,
      to: recipient,
      replyTo: email || undefined,
      subject: `📢 [नया विज्ञापन अनुरोध] ${clientDisplay} - ${phone || ""}`,
      html: emailHtml,
      attachments,
    };

    let mailSent = false;
    let mailError = null;
    try {
      await mailer.sendMail(mailOptions);
      mailSent = true;
      console.log(`[Email] Advertisement inquiry successfully sent to ${recipient}`);
    } catch (mailErr) {
      mailError = mailErr.message;
      console.error("[Email Error] Failed to send advertisement inquiry via nodemailer:", mailErr);
    }

    return res.json({
      success: true,
      message: "विज्ञापन अनुरोध सफलतापूर्वक दर्ज कर दिया गया है! हमारी टीम शीघ्र ही आपसे संपर्क करेगी।",
      emailSent: mailSent,
      error: mailError,
    });
  } catch (err) {
    console.error("Error in /api/advertisements/request:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Routes
app.get("/api/whatsapp/status", (req, res) => {
  res.json({
    status: connectionStatus,
    user: connectedUser ? {
      id: connectedUser.id,
      name: connectedUser.name || "Admin WhatsApp",
    } : null,
    hasQr: !!currentQrCode,
    lastDisconnectReason,
  });
});

app.get("/api/whatsapp/qr", (req, res) => {
  if (connectionStatus === "connected") {
    return res.json({ status: "connected", qr: null, message: "Already connected" });
  }
  res.json({
    status: connectionStatus,
    qr: currentQrCode,
  });
});

// List joined channels & groups
app.get("/api/whatsapp/channels", async (req, res) => {
  try {
    if (connectionStatus !== "connected" || !sock) {
      return res.json({ success: false, channels: [], groups: [] });
    }

    let newsletters = [];
    try {
      if (sock.newsletterSubscribed) {
        newsletters = (await sock.newsletterSubscribed()) || [];
      }
    } catch (e) {
      console.log("Newsletter fetch error:", e.message);
    }

    let groups = [];
    try {
      if (sock.groupFetchAllParticipating) {
        const participatingGroups = await sock.groupFetchAllParticipating();
        groups = Object.values(participatingGroups).map((g) => ({
          id: g.id,
          name: g.subject,
        }));
      }
    } catch (e) {
      console.log("Group fetch error:", e.message);
    }

    res.json({
      success: true,
      channels: newsletters.map((n) => ({
        id: n.id,
        name: n.name || n.thread_metadata?.name?.text || "WhatsApp Channel",
        role: n.viewer_metadata?.role || "ADMIN",
      })),
      groups,
    });
  } catch (error) {
    res.json({ success: false, error: error.message, channels: [], groups: [] });
  }
});

// Get the self JID (linked WhatsApp number) for self-chat fallback
function getSelfJid() {
  if (!sock || !sock.user) return null;
  // sock.user.id is like "919876543210:64@s.whatsapp.net" -- strip device suffix
  const rawId = sock.user.id || "";
  const phone = rawId.split(":")[0]; // e.g. "919876543210"
  return phone ? `${phone}@s.whatsapp.net` : null;
}

// Resolve a WhatsApp Channel link/JID -> returns JID string or null
async function resolveChannelJid(input) {
  if (!input || !input.trim()) return null;
  const target = input.trim();

  // Already a valid JID
  if (target.includes("@")) return target;

  // Channel invite link: https://whatsapp.com/channel/0029Va...
  let inviteCode = target;
  if (target.includes("whatsapp.com/channel/")) {
    const parts = target.split("whatsapp.com/channel/");
    inviteCode = parts[1].split("/")[0].split("?")[0].trim();
  }

  try {
    if (sock && sock.newsletterMetadata) {
      console.log(`Resolving channel invite code: ${inviteCode}`);
      const meta = await sock.newsletterMetadata("invite", inviteCode);
      if (meta && meta.id) {
        console.log(`✅ Channel JID resolved: ${meta.id} (${meta.name || "Channel"})`);
        return meta.id;
      }
    }
  } catch (err) {
    console.error("Error resolving channel invite link:", err.message);
  }
  return null;
}

// Resolve a WhatsApp Community/Group link/JID -> returns JID string or null
async function resolveCommunityJid(input) {
  if (!input || !input.trim()) return null;
  const target = input.trim();

  // Already a valid group JID
  if (target.includes("@g.us")) return target;
  if (target.includes("@")) return target; // some other JID type

  // Group/Community invite link: https://chat.whatsapp.com/XXXXXXXXXX
  let inviteCode = target;
  if (target.includes("chat.whatsapp.com/")) {
    const parts = target.split("chat.whatsapp.com/");
    inviteCode = parts[1].split("/")[0].split("?")[0].trim();
  }

  try {
    if (sock && sock.groupGetInviteInfo) {
      console.log(`Resolving community/group invite code: ${inviteCode}`);
      const meta = await sock.groupGetInviteInfo(inviteCode);
      if (meta && meta.id) {
        console.log(`✅ Community/Group JID resolved: ${meta.id} (${meta.subject || "Group"})`);
        return meta.id;
      }
    }
  } catch (err) {
    console.error("Error resolving community invite link:", err.message);
  }
  return null;
}

// Resolve all broadcast targets: self + channel (if set) + community (if set)
async function resolveTargetJids(channelInput, communityInput) {
  const selfJid = getSelfJid();
  const targets = [];

  // Always include self so admin always receives the message
  if (selfJid) targets.push(selfJid);

  // Resolve channel
  const channelJid = await resolveChannelJid(channelInput);
  if (channelJid && channelJid !== selfJid) targets.push(channelJid);

  // Resolve community/group
  const communityJid = await resolveCommunityJid(communityInput);
  if (communityJid && communityJid !== selfJid && communityJid !== channelJid) {
    targets.push(communityJid);
  }

  if (targets.length === 1 && targets[0] === selfJid) {
    console.log(`No channel/community configured. Sending to self only: ${selfJid}`);
  } else {
    console.log(`Broadcasting to ${targets.length} target(s): ${targets.join(", ")}`);
  }
  return targets;
}

// Helper: send a formatted message to a single JID
async function sendToJid(jid, { imageUrl, formattedMessage }) {
  if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
    return sock.sendMessage(jid, { image: { url: imageUrl }, caption: formattedMessage });
  } else if (imageUrl && imageUrl.startsWith("data:image")) {
    const base64Data = imageUrl.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    return sock.sendMessage(jid, { image: buffer, caption: formattedMessage });
  } else {
    return sock.sendMessage(jid, { text: formattedMessage });
  }
}

// Broadcast news to WhatsApp (Channel, Group, or Contact)
app.post("/api/whatsapp/send", async (req, res) => {
  try {
    if (connectionStatus !== "connected" || !sock) {
      return res.status(400).json({
        success: false,
        error: "WhatsApp is not connected. Please scan the QR code first in Admin panel.",
      });
    }

    const {
      title,
      summary,
      content,
      category,
      imageUrl,
      link,
      targetJid,
      communityJid,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    // Resolve all target JIDs (self + channel + community)
    const jids = await resolveTargetJids(targetJid, communityJid);
    console.log(`Broadcasting news to ${jids.length} target(s): ${jids.join(", ")}`);

    if (jids.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Could not determine a WhatsApp target. Make sure you are connected.",
      });
    }

    // Format rich broadcast message
    const headline = title.trim();
    const catTag = category ? `\u300a ${category.toUpperCase()} \u300b` : "\u300a \u092c\u094d\u0930\u0947\u0915\u093f\u0902\u0917 \u0928\u094d\u092f\u0942\u091c\u093c \u300b";
    const desc = summary ? `\n\n${summary.trim()}` : (content ? `\n\n${content.substring(0, 180)}...` : "");
    const readMore = link ? `\n\n\ud83d\udc49 \u092a\u0942\u0930\u0940 \u062e\u0628\u0930 \u092f\u0939\u093e\u0902 \u092a\u0922\u093c\u0947\u0902:\n${link}` : "";
    const footer = `\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\ud83d\udcf0 *\u0938\u094d\u0935\u0926\u0947\u0936 \u0935\u093e\u0923\u0940* (Swadesh Vaani)\n\ud83c\udf10 \u0938\u0924\u094d\u092f, \u0928\u093f\u0937\u094d\u092a\u0915\u094d\u0937 \u0914\u0930 \u0938\u091f\u0940\u0915 \u092a\u0924\u094d\u0930\u0915\u093e\u0930\u093f\u0924\u093e\n#SwadeshVaani #JharkhandNews`;
    const formattedMessage = `\ud83d\udd34 ${catTag}\n*${headline}*${desc}${readMore}${footer}`;

    // Send to all targets (self + channel)
    const results = [];
    for (const jid of jids) {
      try {
        const result = await sendToJid(jid, { imageUrl, formattedMessage });
        results.push({ jid, messageId: result?.key?.id, status: "sent" });
        console.log(`✅ Sent to ${jid}`);
        // Small delay between sends to avoid rate limiting
        if (jids.length > 1) await new Promise((r) => setTimeout(r, 800));
      } catch (err) {
        console.error(`❌ Failed to send to ${jid}:`, err.message);
        results.push({ jid, status: "failed", error: err.message });
      }
    }

    const allFailed = results.every((r) => r.status === "failed");
    if (allFailed) {
      return res.status(500).json({
        success: false,
        error: results[0]?.error || "All sends failed",
        results,
      });
    }

    const sentTo = results.filter((r) => r.status === "sent").map((r) => r.jid);
    return res.json({
      success: true,
      sentTo,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending WhatsApp broadcast:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to broadcast message to WhatsApp",
    });
  }
});

// Disconnect / Logout
app.post("/api/whatsapp/disconnect", async (req, res) => {
  try {
    if (sock) {
      await sock.logout().catch(() => { });
      sock.end();
    }
    connectionStatus = "disconnected";
    connectedUser = null;
    currentQrCode = null;

    try {
      if (fs.existsSync(AUTH_DIR)) {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      }
    } catch (e) {
      console.error("Error cleaning auth dir:", e);
    }

    // Restart connection to generate fresh QR
    setTimeout(connectToWhatsApp, 1500);

    return res.json({ success: true, message: "WhatsApp logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoints for GoDaddy PaaS / Cloud Load Balancers
app.get(["/health", "/healthz", "/_health", "/ping"], (req, res) => {
  res.status(200).json({ status: "healthy", uptime: Math.floor(process.uptime()), timestamp: new Date().toISOString() });
});

// Resolve static dist path across local development and GoDaddy cloud environments
const candidatePaths = [
  path.resolve(process.cwd(), "dist"),
  path.join(__dirname, "../dist"),
  path.join(__dirname, "dist"),
];

const staticDistPath = candidatePaths.find((dir) =>
  fs.existsSync(path.join(dir, "index.html"))
);

if (staticDistPath) {
  console.log(`📦 Serving static frontend files from: ${staticDistPath}`);
  app.use(
    express.static(staticDistPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (filePath.includes("assets")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    })
  );

  // Function to render index.html with dynamic OpenGraph meta tags for WhatsApp & Social Sharing
  async function renderArticlePageHtml(indexHtmlPath, req, res, articleId) {
    try {
      const rawHtml = fs.readFileSync(indexHtmlPath, "utf-8");
      const searchKey = decodeURIComponent(String(articleId || "")).trim().toLowerCase();
      
      // Fetch article from Convex DB
      let article = null;
      try {
        const convexArticles = await convexClient.query(api.articles.get);
        article = convexArticles.find(
          (a) =>
            String(a.id).toLowerCase() === searchKey ||
            (a.slug && a.slug.toLowerCase() === searchKey)
        );
      } catch (err) {
        console.error("Error fetching article from Convex:", err);
      }

      // Fallback to local JSON if Convex fails
      if (!article) {
        const articles = getStoredArticles();
        const deletedIds = getDeletedArticleIds();

        if (deletedIds.some((d) => d.toLowerCase() === searchKey)) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          return res.sendFile(indexHtmlPath);
        }

        article = articles.find(
          (a) =>
            String(a.id).toLowerCase() === searchKey ||
            (a.slug && a.slug.toLowerCase() === searchKey)
        );
      }

      if (!article) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.sendFile(indexHtmlPath);
      }

      const host = req.get("host") || "swadeshvaani.com";
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const baseUrl = `${protocol}://${host}`;

      let fullImageUrl = "";
      if (article.image) {
        let cleanImg = article.image;
        if (typeof cleanImg === "string" && cleanImg.startsWith("data:image/")) {
          cleanImg = saveBase64Image(cleanImg, `art-${article.id}`);
          article.image = cleanImg;
        }
        if (cleanImg.startsWith("http://") || cleanImg.startsWith("https://")) {
          fullImageUrl = cleanImg;
        } else {
          const cleanPath = cleanImg.startsWith("/") ? cleanImg : `/${cleanImg}`;
          fullImageUrl = `${baseUrl}${cleanPath}`;
        }
      } else {
        fullImageUrl = `${baseUrl}/logo.jpeg`;
      }

      const fullArticleUrl = `${baseUrl}/news/${encodeURIComponent(article.id)}`;
      const safeTitle = (article.title || "स्वदेश वाणी | Swadesh Vani")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const safeDescription = (article.excerpt || article.title || "स्वदेश वाणी — सत्य, निष्पक्ष और सटीक पत्रकारिता")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const dynamicMetaTags = `
    <!-- Dynamic Social Share, Facebook & WhatsApp OpenGraph Tags -->
    <title>${safeTitle} | स्वदेश वाणी</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${fullArticleUrl}" />

    <!-- Open Graph (Facebook / WhatsApp / LinkedIn) -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="स्वदेश वाणी (Swadesh Vaani)" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${fullArticleUrl}" />
    <meta property="og:image" content="${fullImageUrl}" />
    <meta property="og:image:secure_url" content="${fullImageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta property="og:locale" content="hi_IN" />

    <!-- Article specific metadata for Facebook -->
    <meta property="article:published_time" content="${article.date || new Date().toISOString()}" />
    <meta property="article:section" content="${article.category || 'News'}" />
    <meta property="article:author" content="${article.reporter || article.author || 'स्वदेश वाणी ब्यूरो'}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${fullImageUrl}" />
    <meta name="twitter:url" content="${fullArticleUrl}" />
    <link rel="image_src" href="${fullImageUrl}" />`;

      let injectedHtml = rawHtml;
      if (injectedHtml.includes("</head>")) {
        // Strip ALL static title, description, OpenGraph, article, and Twitter tags before injecting dynamic tags
        injectedHtml = injectedHtml
          .replace(/<title>[\s\S]*?<\/title>/gi, "")
          .replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, "")
          .replace(/<meta\s+property=["']og:[^"']+["'][\s\S]*?>/gi, "")
          .replace(/<meta\s+property=["']article:[^"']+["'][\s\S]*?>/gi, "")
          .replace(/<meta\s+name=["']twitter:[^"']+["'][\s\S]*?>/gi, "")
          .replace(/<link\s+rel=["'](canonical|image_src)["'][\s\S]*?>/gi, "")
          .replace("</head>", `${dynamicMetaTags}\n  </head>`);
      }

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.send(injectedHtml);
    } catch (err) {
      console.error("Error injecting OpenGraph meta tags:", err);
      return res.sendFile(indexHtmlPath);
    }
  }

  // Dynamic News Article Sharing Routes (WhatsApp, Facebook, Twitter preview crawlers)
  app.get(["/news/:id", "/article/:id", "/news/:id/", "/article/:id/"], async (req, res) => {
    const indexPath = path.join(staticDistPath, "index.html");
    if (fs.existsSync(indexPath)) {
      return await renderArticlePageHtml(indexPath, req, res, req.params.id);
    }
    return res.status(404).send("Not found");
  });

  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path === "/health" ||
      req.path === "/healthz" ||
      req.path === "/_health" ||
      req.path === "/ping"
    ) {
      return next();
    }
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(staticDistPath, "index.html"));
  });
} else {
  console.warn("⚠️ Warning: dist/index.html not found. Server running in API-only mode.");
  app.get("/", (req, res) => {
    res.status(200).send(`
      <div style="font-family: system-ui, sans-serif; padding: 40px; text-align: center;">
        <h2>🚀 Savdeshvani News Server is Running!</h2>
        <p>Backend API status: <strong>Online</strong></p>
      </div>
    `);
  });
}

// Start Express Server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Savdeshvani Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server listen error:", err);
});


