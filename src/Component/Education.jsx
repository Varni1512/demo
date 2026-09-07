import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, User, ArrowRight, GraduationCap } from "lucide-react";
import { getArticlesByCategory, syncArticlesFromServer, resolveArticleImage, getCategoryFallbackImage, toHindiNumber } from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";

export default function EducationPage() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setArticles(getArticlesByCategory("Education"));
    syncArticlesFromServer().then((fresh) => {
      if (Array.isArray(fresh)) setArticles(getArticlesByCategory("Education"));
    });

    const handleUpdate = () => {
      setArticles(getArticlesByCategory("Education"));
    };

    window.addEventListener("sv_articles_change", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sv_articles_change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const featured = articles.slice(0, 2);
  const others = articles.slice(2);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero / Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
                <GraduationCap size={14} /> {t("educationTitle")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                <span className="text-orange-500">{language === "hi" ? "शिक्षा" : "Education"}</span> {language === "hi" ? "समाचार एवं अपडेट्स" : "News & Updates"}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                {t("educationSubtitle")}
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {language === "hi" ? `कुल ${toHindiNumber(articles.length)} शिक्षा समाचार उपलब्ध` : `Total ${articles.length} Education Stories Available`}
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Top Stories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="h-4 w-1.5 bg-orange-500 rounded-full"></span>
          प्रमुख शिक्षा समाचार
        </h2>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((item) => (
              <article
                key={item.id}
                className="group border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {item.image ? (
                    <Link to={`/news/${item.id}`} className="block overflow-hidden relative">
                      <img
                        src={resolveArticleImage(item.image, item.category || "शिक्षा", item.id || item.title)}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                            e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
                          } else {
                            e.currentTarget.parentElement.style.display = "none";
                          }
                        }}
                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-orange-600 shadow-sm">
                          {item.category || "शिक्षा"}
                        </span>
                        {item.district && (
                          <span className="px-2.5 py-1 bg-blue-950/80 backdrop-blur-sm rounded-full text-[11px] font-semibold text-white shadow-sm flex items-center gap-1">
                            <MapPin size={10} className="text-orange-400" />
                            {item.district}
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="px-6 pt-6 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-50 rounded-full text-xs font-bold text-orange-600 border border-orange-100">
                        {item.category || "शिक्षा"}
                      </span>
                      {item.district && (
                        <span className="px-2.5 py-1 bg-blue-50 rounded-full text-[11px] font-semibold text-blue-800 border border-blue-100 flex items-center gap-1">
                          <MapPin size={10} className="text-orange-500" />
                          {item.district}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-2">
                      <Link to={`/news/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {item.excerpt || item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <User size={13} className="text-orange-500" />
                    {item.reporter || item.author || "शिक्षा डेस्क"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {item.date || "आज"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">शिक्षा समाचार लोड हो रहे हैं...</p>
        )}
      </section>

      {/* Grid of More Education News */}
      {others.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="h-4 w-1.5 bg-orange-500 rounded-full"></span>
            अन्य शिक्षा एवं विश्वविद्यालय समाचार
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((item) => (
              <article
                key={item.id}
                className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-orange-200 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  {item.image ? (
                    <Link to={`/news/${item.id}`} className="block overflow-hidden relative">
                      <img
                        src={resolveArticleImage(item.image, item.category || "शिक्षा", item.id || item.title)}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                            e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
                          } else {
                            e.currentTarget.parentElement.style.display = "none";
                          }
                        }}
                        className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-white/95 rounded-full text-[10px] font-bold text-orange-600 shadow-sm">
                          {item.category || "शिक्षा"}
                        </span>
                        {item.district && (
                          <span className="px-2 py-0.5 bg-blue-950/80 rounded-full text-[10px] font-medium text-white shadow-sm">
                            📍 {item.district}
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="p-4 pb-0 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-orange-50 rounded-full text-[10px] font-bold text-orange-600 border border-orange-100">
                        {item.category || "शिक्षा"}
                      </span>
                      {item.district && (
                        <span className="px-2 py-0.5 bg-blue-50 rounded-full text-[10px] font-medium text-blue-800 border border-blue-100">
                          📍 {item.district}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-2">
                      <Link to={`/news/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                      {item.excerpt || item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[120px]">
                    👤 {item.reporter || item.author || t("reporterFallback")}
                  </span>
                  <Link
                    to={`/news/${item.id}`}
                    className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    {t("readStory")} <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}