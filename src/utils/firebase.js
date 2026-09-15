/**
 * Firebase Firestore & Authentication Configuration for Swadesh Vaani
 * Replaces Convex data storage with Firebase Firestore.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Read Firebase configuration dynamically (supports GoDaddy server-injected window.__ENV__ and local import.meta.env)
const getEnv = (key) => {
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }
  return import.meta.env[key] || "";
};

export const getFirebaseConfig = () => ({
  apiKey: getEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID"),
});

/**
 * Checks whether valid Firebase credentials are provided
 */
export const isFirebaseConfigured = () => {
  const cfg = getFirebaseConfig();
  return Boolean(
    cfg.apiKey &&
    cfg.projectId &&
    !cfg.apiKey.includes("your_") &&
    !cfg.projectId.includes("your_")
  );
};

// Initialize Firebase App safely (singleton)
let app = null;
let db = null;
let auth = null;

export const ensureFirebase = async () => {
  if (db) return db;
  // If not configured yet, fetch dynamically from server /api/config
  if (!isFirebaseConfigured() && typeof window !== "undefined") {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        window.__ENV__ = { ...(window.__ENV__ || {}), ...data };
      }
    } catch (e) {
      // Offline fallback
    }
  }

  if (isFirebaseConfigured() && !db) {
    try {
      const cfg = getFirebaseConfig();
      app = getApps().length > 0 ? getApp() : initializeApp(cfg);
      db = getFirestore(app);
      auth = getAuth(app);
    } catch (e) {
      console.warn("[Firebase] Initialization warning:", e.message);
    }
  }
  return db;
};

// Initial sync attempt
try {
  if (isFirebaseConfigured()) {
    const cfg = getFirebaseConfig();
    app = getApps().length > 0 ? getApp() : initializeApp(cfg);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (e) {
  console.warn("[Firebase] Initial setup notice:", e.message);
}

export { app, db, auth };

// ==========================================
// 1. ARTICLES (Firestore Collection: "articles")
// ==========================================

export const getArticlesFromFirestore = async () => {
  await ensureFirebase();
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const q = query(collection(db, "articles"));
    const snapshot = await getDocs(q);
    const articles = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      articles.push({
        id: docSnap.id,
        ...data,
      });
    });
    // Sort newest first
    articles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return articles;
  } catch (err) {
    console.warn("[Firestore] Error fetching articles:", err.message);
    return null;
  }
};

export const getArticleByIdFromFirestore = async (idOrSlug) => {
  if (!isFirebaseConfigured() || !db || !idOrSlug) return null;
  try {
    const cleanId = String(idOrSlug).trim();
    // 1. Direct doc lookup by ID
    const docRef = doc(db, "articles", cleanId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    // 2. Query by slug or customId
    const qSlug = query(
      collection(db, "articles"),
      where("slug", "==", cleanId),
      limit(1)
    );
    const slugSnap = await getDocs(qSlug);
    if (!slugSnap.empty) {
      const d = slugSnap.docs[0];
      return { id: d.id, ...d.data() };
    }

    const qCustom = query(
      collection(db, "articles"),
      where("customId", "==", cleanId),
      limit(1)
    );
    const customSnap = await getDocs(qCustom);
    if (!customSnap.empty) {
      const d = customSnap.docs[0];
      return { id: d.id, ...d.data() };
    }
  } catch (err) {
    console.warn("[Firestore] Error fetching article by ID:", err.message);
  }
  return null;
};

export const saveArticleToFirestore = async (article) => {
  if (!isFirebaseConfigured() || !db || !article) return false;
  try {
    const docId = String(article.id || article.customId || `art-${Date.now()}`);
    const docRef = doc(db, "articles", docId);

    const payload = {
      customId: docId,
      title: article.title || "",
      slug: article.slug || "",
      category: article.category || "झारखंड",
      district: article.district || "Ranchi",
      subDistrict: article.subDistrict || "",
      reporter: article.reporter || article.author || "स्वदेश वाणी ब्यूरो",
      author: article.author || article.reporter || "स्वदेश वाणी ब्यूरो",
      excerpt: article.excerpt || "",
      content: article.content || "",
      image: article.image || "",
      date: article.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      readTime: article.readTime || "2 min",
      status: article.status || "Published",
      updatedAt: new Date().toISOString(),
      createdAt: article.createdAt || article._creationTime || Date.now(),
    };

    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.error("[Firestore] Error saving article:", err);
    return false;
  }
};

export const deleteArticleFromFirestore = async (id) => {
  if (!isFirebaseConfigured() || !db || !id) return false;
  try {
    const cleanId = String(id).trim();
    await deleteDoc(doc(db, "articles", cleanId));
    return true;
  } catch (err) {
    console.error("[Firestore] Error deleting article:", err);
    return false;
  }
};

export const subscribeArticlesFromFirestore = (callback) => {
  if (!isFirebaseConfigured() || !db) return () => {};
  try {
    const q = query(collection(db, "articles"));
    return onSnapshot(
      q,
      (snapshot) => {
        const articles = [];
        snapshot.forEach((docSnap) => {
          articles.push({ id: docSnap.id, ...docSnap.data() });
        });
        articles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callback(articles);
      },
      (err) => {
        console.warn("[Firestore] Articles subscription warning:", err.message);
      }
    );
  } catch (err) {
    console.warn("[Firestore] subscribeArticles error:", err);
    return () => {};
  }
};

// ==========================================
// 2. ADVERTISEMENTS (Firestore Collection: "advertisements")
// ==========================================

export const getAdvertisementsFromFirestore = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const snapshot = await getDocs(collection(db, "advertisements"));
    const ads = [];
    snapshot.forEach((docSnap) => {
      ads.push({ id: docSnap.id, ...docSnap.data() });
    });
    return ads;
  } catch (err) {
    console.warn("[Firestore] Error fetching advertisements:", err.message);
    return null;
  }
};

export const saveAdvertisementToFirestore = async (ad) => {
  if (!isFirebaseConfigured() || !db || !ad) return false;
  try {
    const docId = String(ad.id || `ad-${Date.now()}`);
    const docRef = doc(db, "advertisements", docId);
    const payload = {
      title: ad.title || "",
      client: ad.client || "",
      phone: ad.phone || "",
      link: ad.link || "",
      image: ad.image || "",
      position: ad.position || "sidebar",
      targetDistrict: ad.targetDistrict || "all",
      targetCategory: ad.targetCategory || "all",
      status: ad.status || "active",
      startDate: ad.startDate || new Date().toISOString().split("T")[0],
      endDate: ad.endDate || "",
      clicks: ad.clicks || 0,
      impressions: ad.impressions || 0,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.error("[Firestore] Error saving ad:", err);
    return false;
  }
};

export const deleteAdvertisementFromFirestore = async (id) => {
  if (!isFirebaseConfigured() || !db || !id) return false;
  try {
    await deleteDoc(doc(db, "advertisements", String(id)));
    return true;
  } catch (err) {
    console.error("[Firestore] Error deleting ad:", err);
    return false;
  }
};

export const toggleAdStatusInFirestore = async (id) => {
  if (!isFirebaseConfigured() || !db || !id) return false;
  try {
    const docRef = doc(db, "advertisements", String(id));
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const curr = snap.data().status;
      const nextStatus = curr === "active" ? "paused" : "active";
      await updateDoc(docRef, { status: nextStatus, updatedAt: new Date().toISOString() });
      return true;
    }
  } catch (err) {
    console.error("[Firestore] Error toggling ad status:", err);
  }
  return false;
};

export const recordAdClickInFirestore = async (id) => {
  if (!isFirebaseConfigured() || !db || !id) return false;
  try {
    const docRef = doc(db, "advertisements", String(id));
    await updateDoc(docRef, { clicks: increment(1) });
    return true;
  } catch (err) {
    return false;
  }
};

export const subscribeAdvertisementsFromFirestore = (callback) => {
  if (!isFirebaseConfigured() || !db) return () => {};
  try {
    return onSnapshot(
      collection(db, "advertisements"),
      (snapshot) => {
        const ads = [];
        snapshot.forEach((docSnap) => {
          ads.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(ads);
      },
      (err) => {
        console.warn("[Firestore] Advertisements subscription warning:", err.message);
      }
    );
  } catch (err) {
    return () => {};
  }
};

// ==========================================
// 3. NOTIFICATIONS (Firestore Collection: "notifications")
// ==========================================

export const getNotificationsFromFirestore = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const snapshot = await getDocs(collection(db, "notifications"));
    const notifs = [];
    snapshot.forEach((docSnap) => {
      notifs.push({ id: docSnap.id, ...docSnap.data() });
    });
    notifs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return notifs;
  } catch (err) {
    console.warn("[Firestore] Error fetching notifications:", err.message);
    return null;
  }
};

export const saveNotificationToFirestore = async (notif) => {
  if (!isFirebaseConfigured() || !db || !notif) return false;
  try {
    const docId = String(notif.id || `notif-${Date.now()}`);
    const docRef = doc(db, "notifications", docId);
    const payload = {
      title: notif.title || "",
      message: notif.message || notif.excerpt || "",
      url: notif.url || notif.link || "",
      read: notif.read || false,
      timestamp: notif.timestamp || Date.now(),
      date: notif.date || new Date().toLocaleString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.error("[Firestore] Error saving notification:", err);
    return false;
  }
};

export const markNotificationReadInFirestore = async (id) => {
  if (!isFirebaseConfigured() || !db || !id) return false;
  try {
    const docRef = doc(db, "notifications", String(id));
    await updateDoc(docRef, { read: true });
    return true;
  } catch (err) {
    return false;
  }
};

export const subscribeNotificationsFromFirestore = (callback) => {
  if (!isFirebaseConfigured() || !db) return () => {};
  try {
    return onSnapshot(
      collection(db, "notifications"),
      (snapshot) => {
        const notifs = [];
        snapshot.forEach((docSnap) => {
          notifs.push({ id: docSnap.id, ...docSnap.data() });
        });
        notifs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        callback(notifs);
      },
      (err) => {
        console.warn("[Firestore] Notifications subscription warning:", err.message);
      }
    );
  } catch (err) {
    return () => {};
  }
};

// ==========================================
// 4. SUBSCRIBERS (Firestore Collection: "subscribers")
// ==========================================

export const getSubscribersFromFirestore = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const snapshot = await getDocs(collection(db, "subscribers"));
    const subs = [];
    snapshot.forEach((docSnap) => {
      subs.push({ id: docSnap.id, ...docSnap.data() });
    });
    return subs;
  } catch (err) {
    console.warn("[Firestore] Error fetching subscribers:", err.message);
    return null;
  }
};

export const saveSubscriberToFirestore = async (sub) => {
  if (!isFirebaseConfigured() || !db || !sub) return false;
  try {
    const cleanPhone = String(sub.phone || sub.phoneNumber || "").replace(/\D/g, "");
    const docId = cleanPhone || String(sub.id || `sub-${Date.now()}`);
    const docRef = doc(db, "subscribers", docId);
    const payload = {
      phone: cleanPhone || sub.phone,
      name: sub.name || "Reader",
      district: sub.district || "All",
      active: sub.active !== false,
      subscribedAt: sub.subscribedAt || new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.error("[Firestore] Error saving subscriber:", err);
    return false;
  }
};

export const deleteSubscriberFromFirestore = async (idOrPhone) => {
  if (!isFirebaseConfigured() || !db || !idOrPhone) return false;
  try {
    const cleanId = String(idOrPhone).replace(/\D/g, "") || String(idOrPhone);
    await deleteDoc(doc(db, "subscribers", cleanId));
    return true;
  } catch (err) {
    console.error("[Firestore] Error deleting subscriber:", err);
    return false;
  }
};

export const subscribeSubscribersFromFirestore = (callback) => {
  if (!isFirebaseConfigured() || !db) return () => {};
  try {
    return onSnapshot(
      collection(db, "subscribers"),
      (snapshot) => {
        const subs = [];
        snapshot.forEach((docSnap) => {
          subs.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(subs);
      },
      (err) => {
        console.warn("[Firestore] Subscribers subscription warning:", err.message);
      }
    );
  } catch (err) {
    return () => {};
  }
};

// ==========================================
// 5. USERS / ADMIN USERS (Firestore Collection: "users")
// ==========================================

export const getUsersFromFirestore = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = [];
    snapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });
    return users;
  } catch (err) {
    console.warn("[Firestore] Error fetching users:", err.message);
    return null;
  }
};

export const saveUserToFirestore = async (user) => {
  if (!isFirebaseConfigured() || !db || !user) return false;
  try {
    const docId = String(user.id || user.email || user.phone || `user-${Date.now()}`);
    const docRef = doc(db, "users", docId);
    await setDoc(docRef, { ...user, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.error("[Firestore] Error saving user:", err);
    return false;
  }
};

export const deleteUserFromFirestore = async (id) => {
  if (!isFirebaseConfigured() || !db || !id) return false;
  try {
    await deleteDoc(doc(db, "users", String(id)));
    return true;
  } catch (err) {
    console.error("[Firestore] Error deleting user:", err);
    return false;
  }
};

export const subscribeUsersFromFirestore = (callback) => {
  if (!isFirebaseConfigured() || !db) return () => {};
  try {
    return onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const users = [];
        snapshot.forEach((docSnap) => {
          users.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(users);
      },
      (err) => {
        console.warn("[Firestore] Users subscription warning:", err.message);
      }
    );
  } catch (err) {
    return () => {};
  }
};

export const loginAdminFromFirestore = async (username, password) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Query adminUsers collection in Firestore
    const q = query(
      collection(db, "adminUsers"),
      where("username", "==", cleanUser),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const adminData = snap.docs[0].data();
      if (adminData.password === cleanPass) {
        return {
          success: true,
          user: {
            username: adminData.username,
            name: adminData.name || "Swadesh Vani Admin",
            role: adminData.role || "admin",
            token: `sv-admin-${Date.now()}`,
          },
        };
      }
    }
  } catch (err) {
    console.warn("[Firestore] Admin login check error:", err.message);
  }
  return null;
};

export const loginUserFromFirestore = async (emailOrPhone, password) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const cleanId = String(emailOrPhone).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const q = query(
      collection(db, "users"),
      where("email", "==", cleanId),
      limit(1)
    );
    let snap = await getDocs(q);
    if (snap.empty) {
      const qPhone = query(
        collection(db, "users"),
        where("phone", "==", cleanId),
        limit(1)
      );
      snap = await getDocs(qPhone);
    }

    if (!snap.empty) {
      const userData = snap.docs[0].data();
      if (userData.password === cleanPass) {
        return {
          success: true,
          user: {
            id: snap.docs[0].id,
            name: userData.name || cleanId,
            email: userData.email,
            phone: userData.phone,
            role: "user",
          },
          token: `sv-user-${Date.now()}`,
          message: `स्वागत है ${userData.name || cleanId}! आप सफलतापूर्वक लॉगिन हो गए हैं।`,
        };
      } else {
        return { success: false, message: "गलत पासवर्ड। कृपया पुनः प्रयास करें।" };
      }
    }
    return { success: false, message: "उपयोगकर्ता नहीं मिला। कृपया पहले पंजीकरण करें।" };
  } catch (err) {
    console.warn("[Firestore] User login check error:", err.message);
    return null;
  }
};

export const registerUserInFirestore = async (userData) => {
  if (!isFirebaseConfigured() || !db || !userData) return null;
  try {
    const cleanEmail = (userData.email || "").trim().toLowerCase();
    const docId = cleanEmail || String(userData.phone || `usr-${Date.now()}`);
    const docRef = doc(db, "users", docId);

    const payload = {
      name: userData.name || "Reader",
      email: cleanEmail,
      phone: userData.phone || "",
      password: userData.password,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });
    return {
      success: true,
      user: { id: docId, ...payload },
      token: `sv-user-${Date.now()}`,
      message: `पंजीकरण सफल! स्वागत है ${payload.name}।`,
    };
  } catch (err) {
    console.error("[Firestore] Error registering user:", err);
    return null;
  }
};
