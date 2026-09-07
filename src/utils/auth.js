/**
 * Authentication utility for Swadesh Vani.
 * Handles unified credential verification, session management, and access guards.
 */

import { convex } from "./convexClient";
import { api } from "../../convex/_generated/api";
import { safeStorage, safeSessionStorage } from "./safeStorage";

const ADMIN_STORAGE_KEY = "savdeshvani_admin_auth";
const USER_STORAGE_KEY = "savdeshvani_user_auth";

// Dynamic admin credentials from environment or fallback
const ENV_ADMIN_EMAIL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_EMAIL) ||
  "swadeshvaaniofficial@gmail.com";

const ENV_ADMIN_PASS =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_PASS) ||
  "uvar xuzq ysen zqif";

// Default admin credentials
const DEFAULT_CREDENTIALS = {
  email: ENV_ADMIN_EMAIL.trim(),
  username: "admin",
  password: ENV_ADMIN_PASS.trim(),
  role: "Chief Editor & Super Admin",
  name: "Swadesh Vani Admin",
};

/**
 * Check if the admin is currently authenticated in the current session.
 * @returns {boolean}
 */
export const isAdminAuthenticated = () => {
  try {
    const session =
      safeSessionStorage.getItem(ADMIN_STORAGE_KEY) ||
      safeStorage.getItem(ADMIN_STORAGE_KEY);
    if (!session) return false;

    const data = JSON.parse(session);
    if (data && data.authenticated && data.token) {
      if (data.expiresAt && Date.now() > data.expiresAt) {
        logoutAdmin();
        return false;
      }
      return true;
    }
  } catch (err) {
    console.error("Auth verification error:", err);
  }
  return false;
};

/**
 * Retrieve current admin user details if logged in.
 * @returns {object|null}
 */
export const getAdminUser = () => {
  try {
    const session =
      safeSessionStorage.getItem(ADMIN_STORAGE_KEY) ||
      safeStorage.getItem(ADMIN_STORAGE_KEY);
    if (session) {
      const data = JSON.parse(session);
      return data.user || null;
    }
  } catch (err) {}
  return null;
};

/**
 * Unified authentication function:
 * Checks if credentials match Admin -> logs in as Admin and returns { role: 'admin' }
 * Otherwise, logs in as standard User/Reader -> returns { role: 'user' }
 */
export const authenticateAccount = async (identifier, password, rememberMe = false) => {
  if (!identifier || !password) {
    return {
      success: false,
      message: "कृपया ईमेल/यूज़रनेम और पासवर्ड दोनों दर्ज करें।",
    };
  }

  const cleanId = String(identifier).trim().toLowerCase();
  const cleanPass = String(password).trim();
  const cleanPassNoSpaces = cleanPass.replace(/\s+/g, "");

  // 1. Try Convex database authentication
  try {
    const convexRes = await convex.mutation(api.adminAuth.login, {
      username: cleanId,
      password: cleanPass,
    });
    if (convexRes && convexRes.success) {
      const adminSession = {
        authenticated: true,
        token: convexRes.user?.token || `sv-admin-${Date.now()}`,
        loginTime: new Date().toISOString(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        user: {
          email: DEFAULT_CREDENTIALS.email,
          username: convexRes.user?.username || cleanId,
          name: DEFAULT_CREDENTIALS.name,
          role: convexRes.user?.role || "admin",
        },
      };

      const payload = JSON.stringify(adminSession);
      safeSessionStorage.setItem(ADMIN_STORAGE_KEY, payload);
      if (rememberMe) {
        safeStorage.setItem(ADMIN_STORAGE_KEY, payload);
      } else {
        safeStorage.removeItem(ADMIN_STORAGE_KEY);
      }

      window.dispatchEvent(new Event("sv_auth_change"));

      return {
        success: true,
        role: "admin",
        redirectTo: "/Admin",
        message: "एडमिन विशेषाधिकार प्राप्त हुए! एडमिन डैशबोर्ड पर भेजा जा रहा है...",
        user: adminSession.user,
      };
    }
  } catch (convexErr) {
    // Fallback to Express backend or local auth
  }

  // 2. Try Express server-side verification if available
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: cleanId, password: cleanPass }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        if (data.role === "admin") {
          const adminSession = {
            authenticated: true,
            token: `sv-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            loginTime: new Date().toISOString(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
            user: {
              email: data.user?.email || DEFAULT_CREDENTIALS.email,
              username: "admin",
              name: data.user?.name || DEFAULT_CREDENTIALS.name,
              role: "admin",
            },
          };

          const payload = JSON.stringify(adminSession);
          safeSessionStorage.setItem(ADMIN_STORAGE_KEY, payload);
          if (rememberMe) {
            safeStorage.setItem(ADMIN_STORAGE_KEY, payload);
          } else {
            safeStorage.removeItem(ADMIN_STORAGE_KEY);
          }

          window.dispatchEvent(new Event("sv_auth_change"));

          return {
            success: true,
            role: "admin",
            redirectTo: "/Admin",
            message: "एडमिन विशेषाधिकार प्राप्त हुए! एडमिन डैशबोर्ड पर भेजा जा रहा है...",
            user: adminSession.user,
          };
        } else {
          const userSession = {
            authenticated: true,
            token: `sv-user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            loginTime: new Date().toISOString(),
            user: data.user,
          };
          const userPayload = JSON.stringify(userSession);
          safeSessionStorage.setItem(USER_STORAGE_KEY, userPayload);
          if (rememberMe) safeStorage.setItem(USER_STORAGE_KEY, userPayload);

          window.dispatchEvent(new Event("sv_auth_change"));
          return {
            success: true,
            role: "user",
            redirectTo: "/",
            message: `स्वागत है ${userSession.user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं।`,
            user: userSession.user,
          };
        }
      }
    }
  } catch (err) {
    // Server offline or static fallback
  }

  // 2. Client-side Environment & Credentials Match
  const validAdminIds = [
    DEFAULT_CREDENTIALS.email.toLowerCase(),
    ENV_ADMIN_EMAIL.toLowerCase(),
    "admin",
    "swadeshvaani",
    "swadeshvani",
    "swadeshvaaniofficial",
    "swadeshvaaniofficial@gmail.com",
  ];

  const validAdminPasswords = [
    DEFAULT_CREDENTIALS.password,
    DEFAULT_CREDENTIALS.password.replace(/\s+/g, ""),
    ENV_ADMIN_PASS,
    ENV_ADMIN_PASS.replace(/\s+/g, ""),
    "Swadesh@vani10",
    "uvar xuzq ysen zqif",
    "uvarxuzqysenzqif",
  ];

  const isAdminMatch =
    validAdminIds.includes(cleanId) &&
    (validAdminPasswords.includes(cleanPass) || validAdminPasswords.includes(cleanPassNoSpaces));

  if (isAdminMatch) {
    const adminSession = {
      authenticated: true,
      token: `sv-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      user: {
        email: DEFAULT_CREDENTIALS.email,
        username: DEFAULT_CREDENTIALS.username,
        name: DEFAULT_CREDENTIALS.name,
        role: "admin",
      },
    };

    const payload = JSON.stringify(adminSession);
    safeSessionStorage.setItem(ADMIN_STORAGE_KEY, payload);
    if (rememberMe) {
      safeStorage.setItem(ADMIN_STORAGE_KEY, payload);
    } else {
      safeStorage.removeItem(ADMIN_STORAGE_KEY);
    }

    window.dispatchEvent(new Event("sv_auth_change"));

    return {
      success: true,
      role: "admin",
      redirectTo: "/Admin",
      message: "एडमिन विशेषाधिकार प्राप्त हुए! एडमिन डैशबोर्ड पर भेजा जा रहा है...",
      user: adminSession.user,
    };
  }

  // Regular user reader authentication (accepts password length >= 4)
  if (cleanPass.length < 4) {
    return {
      success: false,
      message: "अमान्य क्रेडेंशियल्स या पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।",
    };
  }

  const displayName = cleanId.includes("@") ? cleanId.split("@")[0] : cleanId;
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const userEmail = cleanId.includes("@") ? cleanId : `${cleanId}@reader.swadeshvaani.in`;

  // 1. Try Convex users table authentication / registration
  try {
    const userRes = await convex.mutation(api.users.login, {
      emailOrPhone: cleanId,
      password: cleanPass,
    });

    if (userRes && userRes.success) {
      const userSession = {
        authenticated: true,
        token: userRes.token || `sv-user-${Date.now()}`,
        loginTime: new Date().toISOString(),
        user: userRes.user,
      };
      const userPayload = JSON.stringify(userSession);
      safeSessionStorage.setItem(USER_STORAGE_KEY, userPayload);
      if (rememberMe) safeStorage.setItem(USER_STORAGE_KEY, userPayload);
      window.dispatchEvent(new Event("sv_auth_change"));
      return {
        success: true,
        role: "user",
        redirectTo: "/",
        message: userRes.message,
        user: userRes.user,
      };
    } else if (userRes && !userRes.success && userRes.message && userRes.message.includes("उपयोगकर्ता नहीं मिला")) {
      // Auto-register new reader in Convex users table
      const regRes = await convex.mutation(api.users.register, {
        name: formattedName,
        email: userEmail,
        password: cleanPass,
        phone: !cleanId.includes("@") && /^\d+$/.test(cleanId) ? cleanId : undefined,
      });

      if (regRes && regRes.success) {
        const userSession = {
          authenticated: true,
          token: regRes.token || `sv-user-${Date.now()}`,
          loginTime: new Date().toISOString(),
          user: regRes.user,
        };
        const userPayload = JSON.stringify(userSession);
        safeSessionStorage.setItem(USER_STORAGE_KEY, userPayload);
        if (rememberMe) safeStorage.setItem(USER_STORAGE_KEY, userPayload);
        window.dispatchEvent(new Event("sv_auth_change"));
        return {
          success: true,
          role: "user",
          redirectTo: "/",
          message: regRes.message,
          user: regRes.user,
        };
      }
    }
  } catch (err) {
    // Convex offline or local fallback
  }

  // 2. Client-side fallback session
  const userSession = {
    authenticated: true,
    token: `sv-user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    loginTime: new Date().toISOString(),
    user: {
      email: userEmail,
      username: cleanId,
      name: formattedName,
      role: "user",
    },
  };

  const userPayload = JSON.stringify(userSession);
  safeSessionStorage.setItem(USER_STORAGE_KEY, userPayload);
  if (rememberMe) {
    safeStorage.setItem(USER_STORAGE_KEY, userPayload);
  }

  window.dispatchEvent(new Event("sv_auth_change"));

  return {
    success: true,
    role: "user",
    redirectTo: "/",
    message: `स्वागत है ${userSession.user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं।`,
    user: userSession.user,
  };
};

/**
 * Check if regular user is logged in
 */
export const isUserAuthenticated = () => {
  try {
    const session =
      safeSessionStorage.getItem(USER_STORAGE_KEY) ||
      safeStorage.getItem(USER_STORAGE_KEY);
    if (!session) return false;
    const data = JSON.parse(session);
    return !!(data && data.authenticated);
  } catch (e) {
    return false;
  }
};

/**
 * Get current session user (admin or reader)
 */
export const getCurrentAccount = () => {
  if (isAdminAuthenticated()) {
    return { ...getAdminUser(), role: "admin" };
  }
  try {
    const session =
      safeSessionStorage.getItem(USER_STORAGE_KEY) ||
      safeStorage.getItem(USER_STORAGE_KEY);
    if (session) {
      const data = JSON.parse(session);
      return data.user || null;
    }
  } catch (e) {}
  return null;
};

/**
 * Logout the admin user
 */
export const logoutAdmin = () => {
  safeSessionStorage.removeItem(ADMIN_STORAGE_KEY);
  safeStorage.removeItem(ADMIN_STORAGE_KEY);
  window.dispatchEvent(new Event("sv_auth_change"));
};

/**
 * Logout any session (Admin or User)
 */
export const logoutAll = () => {
  logoutAdmin();
  safeSessionStorage.removeItem(USER_STORAGE_KEY);
  safeStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event("sv_auth_change"));
};

