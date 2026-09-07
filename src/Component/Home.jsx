import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  getAllArticles,
  syncArticlesFromServer,
  getAdvertisements,
  recordAdClick,
  toHindiNumber,
  resolveArticleImage,
  getCategoryFallbackImage,
} from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";
import SubscribeSection from "./SubscribeSection";

// Reusable Single Ad Banner Component
function AdBanner({ ad, position = "top_banner", className = "" }) {
  if (!ad || ad.status !== "Active") {
    return null;
  }

  const handleClick = () => {
    recordAdClick(ad.id);
  };

  const isExternal =
    ad.link &&
    (ad.link.startsWith("http") ||
      ad.link.startsWith("tel:") ||
      ad.link.startsWith("mailto:"));

  if (position === "sidebar") {
    return (
      <div className={`mt-6 rounded-2xl border border-orange-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition ${className}`}>
        <div className="relative h-44 bg-slate-900 group overflow-hidden">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-between text-white">
            <span className="self-start text-[10px] font-bold px-2 py-0.5 bg-orange-600 text-white rounded-md uppercase tracking-wider">
              Sponsored / विज्ञापन
            </span>
            <div>
              <p className="text-[11px] text-orange-300 font-bold">{ad.sponsor || "प्रायोजक"}</p>
              <h4 className="text-sm font-bold line-clamp-2 leading-snug drop-shadow">{ad.title}</h4>
            </div>
          </div>
        </div>
        <div className="p-3.5 flex items-center justify-between bg-orange-50/50">
          <span className="text-xs text-slate-600 font-medium truncate max-w-[160px]">
            {ad.tagline || "विशेष प्रायोजित संदेश"}
          </span>
          {isExternal ? (
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
            >
              <span>देखें</span> &rarr;
            </a>
          ) : (
            <Link
              to={ad.link || "/advertisement"}
              onClick={handleClick}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
            >
              <span>देखें</span> &rarr;
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-orange-200 overflow-hidden shadow-md group relative ${className}`}>
      <div className="relative h-36 sm:h-44 bg-slate-900 overflow-hidden">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent p-5 sm:p-7 flex flex-col justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Sponsored / प्रायोजित विज्ञापन
            </span>
            <span className="text-xs text-orange-200 font-bold">
              {ad.sponsor || "प्रायोजक"}
            </span>
          </div>

          <div className="max-w-2xl">
            <h3 className="text-lg sm:text-2xl font-extrabold leading-tight drop-shadow">
              {ad.title}
            </h3>
            {ad.tagline && (
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1">
                {ad.tagline}
              </p>
            )}
          </div>

          <div>
            {isExternal ? (
              <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                <span>विस्तार से जानें (Learn More)</span>
                <ArrowRight size={13} />
              </a>
            ) : (
              <Link
                to={ad.link || "/advertisement"}
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                <span>विस्तार से जानें (Learn More)</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Auto-rotating Single Advertisement Banner (Only ONE ad displayed at a time, changes every 2 seconds)
function AutoRotatingAdBanner({ ads = [], intervalMs = 2000, className = "" }) {
  const activeAds = Array.isArray(ads) ? ads.filter((a) => a && a.status === "Active") : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (activeAds.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeAds.length, intervalMs, isHovered]);

  if (activeAds.length === 0) return null;

  const safeIndex = currentIndex % activeAds.length;
  const ad = activeAds[safeIndex];
  if (!ad) return null;

  const handleClick = () => {
    recordAdClick(ad.id);
  };

  const isExternal =
    ad.link &&
    (ad.link.startsWith("http") ||
      ad.link.startsWith("tel:") ||
      ad.link.startsWith("mailto:"));

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl border border-orange-200 overflow-hidden shadow-md group ${className}`}
    >
      <div className="relative h-36 sm:h-44 bg-slate-900 overflow-hidden">
        <img
          key={ad.id}
          src={ad.image}
          alt={ad.title}
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-all duration-700 animate-fadeIn"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent p-5 sm:p-7 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Sponsored / प्रायोजित विज्ञापन
              </span>
              <span className="text-xs text-orange-200 font-bold truncate max-w-[200px] sm:max-w-none">
                {ad.sponsor || "प्रायोजक"}
              </span>
            </div>

            {/* Slide indicators if multiple ads */}
            {activeAds.length > 1 && (
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                {activeAds.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === safeIndex
                        ? "w-5 bg-orange-500"
                        : "w-1.5 bg-white/50 hover:bg-white"
                    }`}
                    title={`Ad ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="max-w-2xl">
            <h3 className="text-lg sm:text-2xl font-extrabold leading-tight drop-shadow line-clamp-1 sm:line-clamp-2">
              {ad.title}
            </h3>
            {ad.tagline && (
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1">
                {ad.tagline}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {isExternal ? (
              <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
              >
                <span>विस्तार से जानें (Learn More)</span>
                <ArrowRight size={13} />
              </a>
            ) : (
              <Link
                to={ad.link || "/advertisement"}
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
              >
                <span>विस्तार से जानें (Learn More)</span>
                <ArrowRight size={13} />
              </Link>
            )}

            {activeAds.length > 1 && (
              <span className="text-[10px] text-slate-300 font-mono hidden sm:inline-block">
                {safeIndex + 1}/{activeAds.length} • स्वतः परिवर्तन (2s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Home = () => {
  const { language, t } = useLanguage();
  const [newsData, setNewsData] = useState(() => getAllArticles());
  const [ads, setAds] = useState(() => getAdvertisements());

  // Subscribe form state
  const [subMethod, setSubMethod] = useState("phone"); // "phone" | "email"
  const [subPhone, setSubPhone] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initial load from local cache
    setNewsData(getAllArticles());
    setAds(getAdvertisements());

    // Fetch latest articles from server
    syncArticlesFromServer().then((fresh) => {
      if (Array.isArray(fresh)) {
        setNewsData(fresh);
      }
    });

    const handleArticlesChange = () => {
      setNewsData(getAllArticles());
    };

    const handleAdsChange = () => {
      setAds(getAdvertisements());
    };

    window.addEventListener("sv_articles_change", handleArticlesChange);
    window.addEventListener("sv_ads_change", handleAdsChange);
    window.addEventListener("storage", handleArticlesChange);

    return () => {
      window.removeEventListener("sv_articles_change", handleArticlesChange);
      window.removeEventListener("sv_ads_change", handleAdsChange);
      window.removeEventListener("storage", handleArticlesChange);
    };
  }, []);

  const getAdByPosition = (position) => {
    return ads.find((a) => a.position === position && a.status === "Active") || null;
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubStatus(null);

    if (subMethod === "phone") {
      const cleanPhone = subPhone.trim().replace(/\D/g, "");
      if (!cleanPhone) {
        setSubStatus({
          type: "error",
          message: language === "hi" ? "कृपया सदस्यता लेने के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें।" : "Please enter your 10-digit mobile number.",
        });
        return;
      }
      if (cleanPhone.length < 10) {
        setSubStatus({
          type: "error",
          message: language === "hi" ? "कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.",
        });
        return;
      }

      setIsSubmitting(true);
      const res = saveSubscriber({ phone: cleanPhone, email: "" });
      setTimeout(() => {
        setIsSubmitting(false);
        if (res.success) {
          setSubStatus({
            type: "success",
            message: language === "hi" ? `🎉 बधाई! आपका मोबाइल नंबर (+91 ${cleanPhone}) सफलतापूर्वक सब्सक्राइब हो गया है।` : `🎉 Congratulations! Your mobile (+91 ${cleanPhone}) is subscribed successfully!`,
          });
          setSubPhone("");
        } else {
          setSubStatus({
            type: "error",
            message: res.error || (language === "hi" ? "सदस्यता लेने में समस्या आई।" : "Subscription failed. Please try again."),
          });
        }
      }, 400);
    } else {
      const cleanEmail = subEmail.trim();
      if (!cleanEmail) {
        setSubStatus({
          type: "error",
          message: language === "hi" ? "कृपया सदस्यता लेने के लिए अपना ईमेल पता दर्ज करें।" : "Please enter your email address.",
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setSubStatus({
          type: "error",
          message: language === "hi" ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.",
        });
        return;
      }

      setIsSubmitting(true);
      const res = saveSubscriber({ email: cleanEmail, phone: "" });
      setTimeout(() => {
        setIsSubmitting(false);
        if (res.success) {
          setSubStatus({
            type: "success",
            message: language === "hi" ? `🎉 बधाई! आपकी ईमेल (${cleanEmail}) सफलतापूर्वक सब्सक्राइब हो गई है।` : `🎉 Congratulations! Your email (${cleanEmail}) is subscribed successfully!`,
          });
          setSubEmail("");
        } else {
          setSubStatus({
            type: "error",
            message: res.error || (language === "hi" ? "सदस्यता लेने में समस्या आई।" : "Subscription failed. Please try again."),
          });
        }
      }, 400);
    }
  };

  const mainNews = newsData[0] || null;
  const latestNews = newsData.slice(1, 6);
  const topHeadlines = newsData.slice(6, 12);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {mainNews ? (
          <div className="grid gap-6 lg:grid-cols-3">
          {/* Main news */}
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            {mainNews.image ? (
              <Link to={`/news/${mainNews.id}`} className="block group overflow-hidden">
                <img
                  src={resolveArticleImage(mainNews.image, mainNews.category, mainNews.id || mainNews.title)}
                  alt={mainNews.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (mainNews.image && mainNews.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                      e.currentTarget.src = `https://swadeshvaani.com${mainNews.image}`;
                    } else {
                      e.currentTarget.parentElement.style.display = "none";
                    }
                  }}
                  className="h-[300px] w-full object-cover sm:h-[420px] group-hover:scale-105 transition duration-500"
                />
              </Link>
            ) : null}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  {mainNews.category || "झारखंड"}
                </span>

                {mainNews.district && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                    <MapPin size={12} className="text-blue-500" />
                    {mainNews.district}
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-2xl font-bold leading-tight text-blue-950 sm:text-4xl">
                <Link
                  to={`/news/${mainNews.id}`}
                  className="hover:text-orange-600 transition"
                >
                  {mainNews.title}
                </Link>
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {mainNews.excerpt}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin size={15} className="text-orange-500" />
                  {mainNews.district || mainNews.category || "झारखंड"}
                </span>

                <span className="flex items-center gap-1.5">
                  <User size={15} className="text-orange-500" />
                  {mainNews.reporter || mainNews.author || (language === "hi" ? "स्वदेश वाणी संवाददाता" : "Swadesh Vani Bureau")}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-orange-500" />
                  {mainNews.date}
                </span>
              </div>

              <Link
                to={`/news/${mainNews.id}`}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-600 transition hover:text-orange-700"
              >
                {t("readMore")}
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>

          {/* Latest updates */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-950">
                    {t("latestNews")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === "hi" ? "ताज़ा ब्रेकिंग अपडेट्स" : "Latest Breaking Updates"}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {latestNews.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="group block border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-orange-600">
                        {item.category}
                      </span>
                      {item.district && (
                        <span className="text-[11px] text-slate-400">
                          • 📍 {item.district}
                        </span>
                      )}
                    </div>

                    <h3 className="line-clamp-3 text-sm font-semibold leading-6 text-slate-800 transition group-hover:text-orange-600">
                      {item.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <User size={12} className="text-slate-400" />
                        {item.reporter || item.author || (language === "hi" ? "ब्यूरो" : "Bureau")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.date || (language === "hi" ? "आज" : "Today")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Ad Placement */}
            <AdBanner
              ad={getAdByPosition("sidebar")}
              position="sidebar"
            />
          </aside>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 p-8 sm:p-14 text-center my-6 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-4">
            <TrendingUp size={32} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">
            स्वदेश वाणी डिजिटल मीडिया
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
            स्वदेश वाणी न्यूज़ पोर्टल पर आपका स्वागत है
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            वर्तमान में कोई समाचार उपलब्ध नहीं है। नए समाचार जल्द ही प्रकाशित किए जाएंगे।
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/district"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition shadow-sm"
            >
              जिलेवार खबरें देखें
            </Link>
          </div>
        </div>
      )}
      </section>

      {/* All news counter - shown only if newsData exists */}
      {newsData.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-5 sm:px-8">
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-blue-950">
                {t("todayTopStories")}
              </p>
              <p className="mt-1 text-xs text-blue-700">
                {t("todayTopStoriesSubtitle")}
              </p>
            </div>

            <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-bold text-white">
              {language === "hi" ? `कुल ${toHindiNumber(newsData.length)} खबरें` : `Total ${newsData.length} Stories`}
            </span>
          </div>
        </section>
      )}

      {/* Top headlines */}
      {topHeadlines.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-600">
                {t("featuredBadge")}
              </p>

              <h2 className="text-2xl font-bold text-blue-950 sm:text-3xl">
                {t("featuredStories")}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topHeadlines.map((item, idx) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {item.image ? (
                    <Link to={`/news/${item.id}`} className="block relative overflow-hidden">
                      <img
                        src={resolveArticleImage(item.image, item.category, item.id || item.title)}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                            e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
                          } else {
                            e.currentTarget.parentElement.style.display = "none";
                          }
                        }}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
                          {item.category}
                        </span>
                        {item.district && (
                          <span className="rounded-full bg-blue-950/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white shadow-sm flex items-center gap-1">
                            <MapPin size={10} className="text-orange-400" />
                            {item.district}
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="p-5 pb-0 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                        {item.category}
                      </span>
                      {item.district && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 flex items-center gap-1">
                          <MapPin size={10} className="text-orange-500" />
                          {item.district}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="line-clamp-3 text-lg font-bold leading-7 text-blue-950">
                      <Link
                        to={`/news/${item.id}`}
                        className="hover:text-orange-600 transition"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <User size={13} className="text-orange-500 flex-shrink-0" />
                    <span className="truncate">{item.reporter || item.author || t("reporterFallback")}</span>
                  </span>

                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 transition hover:text-orange-700"
                  >
                    {t("readStory")}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Complete news list */}
      {newsData.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
          <div className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-600">
              {language === "hi" ? "ताज़ा अपडेट्स" : "LATEST STORIES"}
            </p>

            <h2 className="text-2xl font-bold text-blue-950 sm:text-3xl">
              {t("allNews")}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {newsData.map((item, index) => (
              <article
                key={item.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm"
              >
                {item.image ? (
                  <Link to={`/news/${item.id}`} className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:block group">
                    <img
                      src={resolveArticleImage(item.image, item.category, item.id || item.title || index)}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                          e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
                        } else {
                          e.currentTarget.parentElement.style.display = "none";
                        }
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                ) : null}

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-orange-600">
                        #{toHindiNumber(index + 1)}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {item.category}
                      </span>

                      {item.district && (
                        <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium">
                          📍 {item.district}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 line-clamp-2 font-bold leading-6 text-blue-950">
                      <Link to={`/news/${item.id}`} className="hover:text-orange-600 transition">
                        {item.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-slate-400" />
                      {item.reporter || item.author || t("reporterFallback")}
                    </span>

                    <Link
                      to={`/news/${item.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700"
                    >
                      {t("readStory")}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Auto-Rotating Single Advertisement Banner right after 'सभी समाचार' (Changes every 2 seconds) */}
      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <AutoRotatingAdBanner ads={ads} intervalMs={2000} />
      </section>

      {/* Newsletter & WhatsApp Subscription Form */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SubscribeSection />
        </div>
      </section>
    </div>
  );
};

export default Home;