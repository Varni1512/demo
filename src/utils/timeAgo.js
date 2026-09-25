/**
 * Utility to calculate and format relative time ("time ago" / "before")
 * Supports Hindi and English with full fallback for different date/timestamp formats.
 */

export function parseArticleTimestamp(article) {
  if (!article) return null;

  // 1. Direct createdAt (number, string ISO, or Firestore Timestamp object)
  if (article.createdAt) {
    if (typeof article.createdAt === "number" && article.createdAt > 0) {
      return article.createdAt;
    }
    if (article.createdAt?.seconds) {
      return article.createdAt.seconds * 1000;
    }
    if (typeof article.createdAt?.toDate === "function") {
      return article.createdAt.toDate().getTime();
    }
    const parsed = new Date(article.createdAt).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 2. Direct _creationTime (e.g. Convex timestamp)
  if (article._creationTime) {
    if (typeof article._creationTime === "number" && article._creationTime > 0) {
      return article._creationTime;
    }
    const parsed = new Date(article._creationTime).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 3. ID timestamp if id is generated like "art-1743123456789" or contains 12-14 digits
  if (article.id) {
    const match = String(article.id).match(/(\d{12,14})/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > 1600000000000 && num < 3000000000000) {
        return num;
      }
    }
  }

  // 4. updatedAt
  if (article.updatedAt) {
    if (typeof article.updatedAt === "number" && article.updatedAt > 0) {
      return article.updatedAt;
    }
    if (article.updatedAt?.seconds) {
      return article.updatedAt.seconds * 1000;
    }
    if (typeof article.updatedAt?.toDate === "function") {
      return article.updatedAt.toDate().getTime();
    }
    const parsed = new Date(article.updatedAt).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 5. article.date string (e.g., "26 Sep 2026", "26/09/2026", "2026-09-26")
  if (article.date && typeof article.date === "string") {
    // Standard Date.parse
    let parsed = new Date(article.date).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;

    // Replace Sept -> Sep
    parsed = new Date(article.date.replace(/Sept\b/i, "Sep")).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;

    // DD/MM/YYYY or DD-MM-YYYY format
    const dmy = article.date.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (dmy) {
      const d = parseInt(dmy[1], 10);
      const m = parseInt(dmy[2], 10) - 1;
      const y = parseInt(dmy[3], 10);
      const dt = new Date(y, m, d).getTime();
      if (!isNaN(dt)) return dt;
    }
  }

  return null;
}

export function formatTimeAgo(timestampOrArticle, language = "hi") {
  const isHi = language === "hi";
  let timestamp =
    typeof timestampOrArticle === "number"
      ? timestampOrArticle
      : parseArticleTimestamp(timestampOrArticle);

  if (!timestamp) {
    return isHi ? "हाल ही में" : "Recently";
  }

  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffMin < 1) {
    return isHi ? "1 मिनट पहले" : "1 min before";
  }

  if (diffMin < 60) {
    return isHi
      ? `${diffMin} मिनट पहले`
      : `${diffMin} min${diffMin > 1 ? "s" : ""} before`;
  }

  if (diffHour < 24) {
    if (diffHour === 1) {
      return isHi ? "1 घंटा पहले" : "1 hour before";
    }
    return isHi ? `${diffHour} घंटे पहले` : `${diffHour} hours before`;
  }

  if (diffDay < 30) {
    if (diffDay === 1) {
      return isHi ? "1 दिन पहले" : "1 day before";
    }
    return isHi ? `${diffDay} दिन पहले` : `${diffDay} days before`;
  }

  if (diffMonth < 12) {
    if (diffMonth === 1) {
      return isHi ? "1 महीना पहले" : "1 month before";
    }
    return isHi ? `${diffMonth} महीने पहले` : `${diffMonth} months before`;
  }

  if (diffYear === 1) {
    return isHi ? "1 साल पहले" : "1 year before";
  }

  return isHi ? `${diffYear} साल पहले` : `${diffYear} years before`;
}

export default formatTimeAgo;
