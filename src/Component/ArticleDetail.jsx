import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  Bookmark,
  Check,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Home,
} from "lucide-react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaCopy,
} from "react-icons/fa";
import { getArticleById, getAllArticles, syncArticlesFromServer, resolveArticleImage, getCategoryFallbackImage } from "../data/newsData";
import { convex } from "../utils/convexClient";
import { api } from "../../convex/_generated/api";
import { safeStorage } from "../utils/safeStorage";
import SubscribeSection from "./SubscribeSection";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [article, setArticle] = useState(() => getArticleById(id));
  const [loading, setLoading] = useState(!article);

  // Sync and fetch article
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }

    const localFound = getArticleById(id);
    if (localFound) {
      setArticle(localFound);
      setLoading(false);
    } else {
      setLoading(true);

      // 1. Direct Convex Real-Time DB Query for Incognito / Cold Hits
      // Wrapping with Promise.race to avoid hanging if Convex WebSocket fails on iOS Safari
      Promise.race([
        convex.query(api.articles.getById, { id: String(id) }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
      ])
        .then((convexArt) => {
          if (convexArt) {
            setArticle(convexArt);
            setLoading(false);

            try {
              const saved = JSON.parse(safeStorage.getItem("savdeshvani_articles_store") || "[]");
              if (!saved.some((a) => String(a.id) === String(convexArt.id))) {
                safeStorage.setItem("savdeshvani_articles_store", JSON.stringify([convexArt, ...saved]));
                window.dispatchEvent(new Event("sv_articles_change"));
              }
            } catch {}
            return;
          }
          // Fallback to syncArticlesFromServer
          syncArticlesFromServer().then(() => {
            const found = getArticleById(id);
            setArticle(found);
            setLoading(false);
          });
        })
        .catch(() => {
          syncArticlesFromServer()
            .then(() => {
              const found = getArticleById(id);
              setArticle(found);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        });
    }

    const handleUpdate = () => {
      const found = getArticleById(id);
      if (found) setArticle(found);
    };

    window.addEventListener("sv_articles_change", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sv_articles_change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [id]);

  // Dynamic OpenGraph / Social Meta Tags for Client Navigation
  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | स्वदेश वाणी`;

    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const origin = typeof window !== "undefined" ? window.location.origin : "https://swadeshvaani.com";
    const fullImageUrl = article.image
      ? (article.image.startsWith("http") ? article.image : `${origin}${article.image.startsWith("/") ? "" : "/"}${article.image}`)
      : `${origin}/src/Component/photos/logo.jpeg`;
    const fullUrl = `${origin}/news/${article.id}`;

    setMetaTag("property", "og:title", article.title);
    setMetaTag("property", "og:description", article.excerpt || article.title);
    setMetaTag("property", "og:image", fullImageUrl);
    setMetaTag("property", "og:image:secure_url", fullImageUrl);
    setMetaTag("property", "og:url", fullUrl);
    setMetaTag("property", "og:type", "article");
    setMetaTag("name", "twitter:title", article.title);
    setMetaTag("name", "twitter:description", article.excerpt || article.title);
    setMetaTag("name", "twitter:image", fullImageUrl);
    setMetaTag("name", "description", article.excerpt || article.title);
  }, [article]);

  // Related articles (excluding current one)
  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => String(a.id) !== String(article?.id) && a.category === article?.category)
    .concat(allArticles.filter((a) => String(a.id) !== String(article?.id) && a.category !== article?.category))
    .slice(0, 4);

  // Dynamic permanent URL for both local dev and production deployed domains
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = article?.id ? `${origin}/news/${article.id}` : (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWa = () => {
    const headline = article?.title || "ताज़ा समाचार | स्वदेश वाणी";
    const excerpt = article?.excerpt ? `\n\n${article.excerpt}` : "";
    const text = `${shareUrl}\n\n📰 *${headline}*${excerpt}\n\n━━━━━━━━━━━━━━━\n🌐 *स्वदेश वाणी* (Swadesh Vaani)\n#SwadeshVaani #JharkhandNews`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareFb = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(article?.title || "")}`;
    window.open(fbUrl, "fbShare", "width=640,height=580,menubar=no,toolbar=no");
  };

  const handleShareLi = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(liUrl, "liShare", "width=640,height=600,menubar=no,toolbar=no");
  };

  const handleShareTw = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔴 ${article?.title}`)}&url=${encodeURIComponent(shareUrl)}&hashtags=SwadeshVaani,JharkhandNews`;
    window.open(twUrl, "twShare", "width=600,height=500,menubar=no,toolbar=no");
  };

  // Loading spinner while syncing from server
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">खबर लोड हो रही है...</p>
        </div>
      </div>
    );
  }

  // 404 / Article Not Found View
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-orange-50/30 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-orange-100 shadow-xl">
          <div className="h-20 w-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle className="h-10 w-10" />
          </div>

          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full uppercase tracking-wider mb-3">
            404 • Article Not Found
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-3">
            खबर उपलब्ध नहीं है
          </h2>

          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            आप जिस खबर को ढूंढ रहे हैं, वह या तो हटा दी गई है या उसका लिंक बदल गया है।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" /> वापस जाएं
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition"
            >
              <Home className="h-4 w-4" /> मुख्य पृष्ठ पर जाएं
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-orange-600 flex items-center gap-1">
            <Home className="h-3.5 w-3.5" /> होम
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
          <Link to="/News" className="hover:text-orange-600">
            {article.category || "समाचार"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
            {/* Category & District Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-orange-700 tracking-wide">
                  {article.category || "ताज़ा खबर"}
                </span>

                {article.district && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800 border border-blue-100">
                    <span className="text-orange-500">📍</span>
                    <span>जिला: {article.district}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {article.readTime || "3 मिनट"}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-extrabold text-blue-950 leading-tight mb-5 tracking-tight">
              {article.title}
            </h1>

            {/* Author / Reporter & Date Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-y border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sm overflow-hidden">
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-bold text-blue-950 text-sm">
                    {article.reporter || article.author || "स्वदेश वाणी ब्यूरो"}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {article.district ? `जिला संवाददाता • ${article.district}` : "वेरिफाइड जर्नलिस्ट • स्वदेश वाणी"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium text-slate-500">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span>{article.date || "आज"}</span>
              </div>
            </div>

            {/* Social Share Floating Bar (Top) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-orange-50/80 via-white to-blue-50/80 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Share2 className="h-4 w-4 text-orange-500" /> इस खबर को शेयर करें:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {/* WhatsApp */}
                <button
                  onClick={handleShareWa}
                  title="Share on WhatsApp"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 text-white font-bold text-xs shadow-sm hover:bg-green-700 active:scale-95 transition"
                >
                  <FaWhatsapp className="text-sm" /> WhatsApp
                </button>

                {/* Facebook */}
                <button
                  onClick={handleShareFb}
                  title="Share on Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95 transition text-xs"
                >
                  <FaFacebookF />
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleShareLi}
                  title="Share on LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0077b5] text-white shadow-sm hover:bg-[#005582] active:scale-95 transition text-xs"
                >
                  <FaLinkedinIn />
                </button>

                {/* Twitter / X */}
                <button
                  onClick={handleShareTw}
                  title="Share on X (Twitter)"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm hover:bg-black active:scale-95 transition text-xs"
                >
                  <FaTwitter />
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  title="Copy Article Link"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <FaCopy className="text-xs" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Featured Image - Only render when the article has an image */}
            {article.image ? (
              <div className="mb-8 overflow-hidden rounded-2xl border border-slate-100 shadow-md">
                <img
                  src={resolveArticleImage(article.image, article.category, article.id || article.title)}
                  alt={article.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (article.image && article.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                      e.currentTarget.src = `https://swadeshvaani.com${article.image}`;
                    } else {
                      e.currentTarget.parentElement.style.display = "none";
                    }
                  }}
                  className="w-full max-h-[480px] object-cover hover:scale-105 transition duration-500"
                />
                <div className="p-2.5 bg-slate-50 text-[11px] text-slate-400 text-center italic border-t border-slate-100">
                  फोटो: {article.title} (स्वदेश वाणी)
                </div>
              </div>
            ) : null}

            {/* Short Excerpt Box */}
            {article.excerpt && (
              <div className="p-5 mb-8 rounded-2xl bg-orange-500/5 border-l-4 border-orange-500 text-slate-800 text-base font-semibold leading-relaxed">
                {article.excerpt}
              </div>
            )}

            {/* Full Body Content */}
            <div
              className="article-content prose prose-lg max-w-none text-slate-800 leading-8 text-[17px] font-normal space-y-5"
              dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt}</p>` }}
            />

            {/* Subscribe Box Below Each Individual Article */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <SubscribeSection className="shadow-none border-orange-200/80 bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-blue-50/30" />
            </div>

            {/* End of Story Signature */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>📰 स्वदेश वाणी न्यूज़ नेटवर्क — सत्य, निष्पक्ष और सटीक पत्रकारिता।</p>
              <button
                onClick={() => {
                  try {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } catch (e) {
                    window.scrollTo(0, 0);
                  }
                }}
                className="text-orange-600 font-bold hover:underline"
              >
                ↑ ऊपर जाएं (Top)
              </button>
            </div>
          </article>

          {/* Sidebar / Related Stories */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Breaking News Card */}
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
                <TrendingUp className="h-4 w-4" /> ट्रेंडिंग न्यूज़
              </div>
              <h4 className="text-xl font-bold mb-2">
                स्वदेश वाणी लाइव अपडेट्स
              </h4>
              <p className="text-xs text-blue-200 mb-5 leading-relaxed">
                झारखंड और देश-दुनिया की हर खबर से जुड़े रहने के लिए हमारे व्हाट्सएप चैनल से जुड़ें।
              </p>

              <button
                onClick={handleShareWa}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-bold text-xs shadow-lg shadow-green-500/30 hover:bg-green-600 transition"
              >
                <FaWhatsapp className="text-base" /> WhatsApp पर शेयर करें
              </button>
            </div>

            {/* Related Articles List */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h4 className="text-base font-bold text-blue-950 mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>संबंधित खबरें (Related)</span>
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              </h4>

              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/news/${rel.id}`}
                    className="group flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    {rel.image && (
                      <img
                        src={resolveArticleImage(rel.image, rel.category, rel.id || rel.title)}
                        alt={rel.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (rel.image && rel.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                            e.currentTarget.src = `https://swadeshvaani.com${rel.image}`;
                          } else {
                            e.currentTarget.style.display = "none";
                          }
                        }}
                        className="h-16 w-20 rounded-xl object-cover flex-shrink-0 group-hover:opacity-90 transition"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                        {rel.category}
                      </span>
                      <h5 className="text-xs font-bold text-blue-950 group-hover:text-orange-600 transition line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {rel.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
