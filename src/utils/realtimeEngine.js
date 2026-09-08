/**
 * Real-time Synchronization Engine for Swadesh Vaani News Platform
 * 
 * Features:
 * 1. Server-Sent Events (SSE) live push connection (/api/realtime/stream) for instant multi-device sync
 * 2. Cross-Window / Incognito BroadcastChannel for zero-latency local tab communication
 * 3. Mobile Lifecycle & Sleep/Wake Detection (visibilitychange, focus, online events)
 * 4. Resilient background polling heartbeat (6s) ensuring 100% synchronization on all networks & devices
 */

import {
  syncArticlesFromServer,
  syncAdvertisementsFromServer,
  syncSubscribersFromServer,
  syncNotificationsFromServer,
} from "../data/newsData";
import { convex } from "./convexClient";
import { api } from "../../convex/_generated/api";

let isInitialized = false;
let eventSource = null;
let reconnectTimer = null;
let heartbeatInterval = null;
let broadcastChannel = null;
let reconnectAttempts = 0;

const handleRealtimePayload = (payload) => {
  if (!payload || !payload.type) return;

  switch (payload.type) {
    case "articles_update":
      syncArticlesFromServer();
      window.dispatchEvent(new Event("sv_articles_change"));
      break;
    case "ads_update":
      syncAdvertisementsFromServer();
      window.dispatchEvent(new Event("sv_ads_change"));
      break;
    case "subscribers_update":
      syncSubscribersFromServer();
      window.dispatchEvent(new Event("sv_subscribers_change"));
      break;
    case "notifications_update":
      syncNotificationsFromServer();
      window.dispatchEvent(new Event("sv_notifications_change"));
      break;
    case "whatsapp_update":
      window.dispatchEvent(new CustomEvent("sv_whatsapp_change", { detail: payload.data }));
      break;
    default:
      break;
  }
};

export const broadcastLocalEvent = (type, data = {}) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, data, timestamp: Date.now() });
    } catch (e) {}
  }
};

import { safeStorage } from "./safeStorage";

export const initRealtimeEngine = () => {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;

  // 1. Initialize Convex Real-Time WebSocket live subscriptions
  try {
    if (typeof convex.onUpdate === "function") {
      convex.onUpdate(api.articles.get, {}, (freshArticles) => {
        if (Array.isArray(freshArticles)) {
          safeStorage.setItem("savdeshvani_articles_store", JSON.stringify(freshArticles));
          window.dispatchEvent(new Event("sv_articles_change"));
        }
      });

      convex.onUpdate(api.advertisements.get, {}, (freshAds) => {
        if (Array.isArray(freshAds)) {
          safeStorage.setItem("savdeshvani_advertisements", JSON.stringify(freshAds));
          window.dispatchEvent(new Event("sv_ads_change"));
        }
      });

      convex.onUpdate(api.subscribers.get, {}, (freshSubs) => {
        if (Array.isArray(freshSubs)) {
          safeStorage.setItem("savdeshvani_subscribers", JSON.stringify(freshSubs));
          window.dispatchEvent(new Event("sv_subscribers_change"));
        }
      });

      convex.onUpdate(api.notifications.get, {}, (freshNotifs) => {
        if (Array.isArray(freshNotifs)) {
          safeStorage.setItem("savdeshvani_notifications", JSON.stringify(freshNotifs));
          window.dispatchEvent(new Event("sv_notifications_change"));
        }
      });
    }
  } catch (err) {
    console.warn("Convex live query fallback:", err);
  }

  // 2. Initialize BroadcastChannel for cross-tab / incognito instant communication
  if ("BroadcastChannel" in window) {
    try {
      broadcastChannel = new BroadcastChannel("sv_realtime_channel");
      broadcastChannel.onmessage = (event) => {
        if (event && event.data) {
          handleRealtimePayload(event.data);
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment");
    }
  }

  // 3. Initial full synchronization
  performFullSync();

  // 4. Connect to SSE Stream
  connectSSE();

  // 4. Cross-tab storage synchronizer (standard tabs)
  window.addEventListener("storage", (e) => {
    if (!e.key) return;

    if (e.key === "savdeshvani_articles_store" || e.key === "sv_deleted_article_ids") {
      window.dispatchEvent(new Event("sv_articles_change"));
    } else if (e.key === "savdeshvani_advertisements" || e.key === "savdeshvani_deleted_ad_ids") {
      window.dispatchEvent(new Event("sv_ads_change"));
    } else if (e.key === "savdeshvani_subscribers") {
      window.dispatchEvent(new Event("sv_subscribers_change"));
    } else if (e.key === "savdeshvani_notifications") {
      window.dispatchEvent(new Event("sv_notifications_change"));
    }
  });

  // 5. Mobile lifecycle & screen unlock / tab switch synchronizer
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        performFullSync();
        if (!eventSource) {
          connectSSE();
        }
      }
    });
  }

  window.addEventListener("online", () => {
    reconnectAttempts = 0;
    performFullSync();
    connectSSE();
  });

  window.addEventListener("focus", () => {
    performFullSync();
  });

  // 6. Resilient 6-second background heartbeat sync for mobile networks and firewalls
  heartbeatInterval = setInterval(() => {
    performFullSync();
  }, 6000);
};

export const performFullSync = () => {
  syncArticlesFromServer().catch(() => {});
  syncAdvertisementsFromServer().catch(() => {});
  syncSubscribersFromServer().catch(() => {});
  syncNotificationsFromServer().catch(() => {});
};

const connectSSE = () => {
  if (typeof window === "undefined" || !window.EventSource) return;

  try {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    eventSource = new EventSource("/api/realtime/stream");

    eventSource.onopen = () => {
      reconnectAttempts = 0;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        handleRealtimePayload(payload);
      } catch (err) {
        // Silently ignore non-JSON stream ping packets
      }
    };

    eventSource.onerror = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      
      // Calculate exponential backoff (between 3s and 30s)
      reconnectAttempts = Math.min(reconnectAttempts + 1, 6);
      const delay = Math.min(3000 * Math.pow(1.5, reconnectAttempts), 30000);

      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          connectSSE();
        }, delay);
      }
    };
  } catch (err) {
    // Suppress unhandled exceptions
  }
};
