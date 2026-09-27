import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, ArrowRight, MapPin, User, Filter, Search, X } from "lucide-react";
import { getAllArticles, syncArticlesFromServer, JHARKHAND_DISTRICTS, NEWS_CATEGORIES, resolveArticleImage, getCategoryFallbackImage } from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";
import { formatArticleTime } from "../utils/timeAgo";

export default function CategoriesSection() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync initial and URL query params
  useEffect(() => {
    setArticles(getAllArticles());
    syncArticlesFromServer().then((fresh) => {
      if (fresh && fresh.length > 0) setArticles(fresh);
    });

    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    }

    const handleUpdate = () => {
      setArticles(getAllArticles());
    };

    window.addEventListener("sv_articles_change", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sv_articles_change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [searchParams]);

  // Filter articles based on category, district, and search query
  const filteredArticles = articles.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesDistrict =
      selectedDistrict === "ALL" ||
      (item.district && item.district.toLowerCase() === selectedDistrict.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDistrict && matchesSearch;
  });

  // Group filtered articles by category
  const categoriesMap = filteredArticles.reduce((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryNames = Object.keys(categoriesMap);

  // Available unique categories in the dataset + standard system categories
  const allCategories = Array.from(
    new Set([...NEWS_CATEGORIES, ...articles.map((a) => a.category).filter(Boolean)])
  );

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-10">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">
              Categories &amp; Regional Feeds
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950">
              सभी प्रमुख समाचार श्रेणियां व जिले
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              झारखंड के सभी 24 जिलों, देश और दुनिया की ताज़ा एवं निष्पक्ष खबरें
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="खबर या रिपोर्टर खोजें..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter size={14} className="text-orange-500" />
            <span>फ़िल्टर करें (Filters)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                श्रेणी चुनें (Category)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
              >
                <option value="ALL">सभी श्रेणियां (All Categories)</option>
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                जिला चुनें (District)
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
              >
                <option value="ALL">सभी जिले (All Districts)</option>
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(selectedCategory !== "ALL" || selectedDistrict !== "ALL" || searchQuery) && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                कुल परिणाम: <strong>{filteredArticles.length}</strong> खबरें मिलीं
              </span>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedDistrict("ALL");
                  setSearchQuery("");
                }}
                className="text-orange-600 font-semibold hover:underline"
              >
                फ़िल्टर रीसेट करें (Reset)
              </button>
            </div>
          )}
        </div>

        {/* Content sections */}
        {categoryNames.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <p className="text-slate-500 text-base">
              चयनित फ़िल्टर के अनुसार कोई समाचार उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          categoryNames.map((catName) => {
            const catArticles = categoriesMap[catName];
            return (
              <section
                key={catName}
                className="bg-white p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm"
              >
                {/* Category header */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-100">
                  <span className="h-5 sm:h-6 w-1.5 sm:w-2 rounded-full bg-orange-500"></span>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-blue-950">
                    {catName}
                  </h2>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                    {catArticles.length} खबरें
                  </span>
                </div>

                {/* Articles grid - 2 columns on mobile */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-6 md:grid-cols-2">
                  {catArticles.map((article) => (
                    <article
                      key={article.id}
                      className="group flex flex-col justify-between border border-slate-100 p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-md transition duration-300"
                    >
                      <div>
                        {article.image ? (
                          <Link
                            to={`/news/${article.id}`}
                            className="overflow-hidden rounded-lg sm:rounded-xl bg-slate-100 block"
                          >
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
                              className="w-full h-28 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                        ) : null}

                        <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2.5">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
                            <span className="font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-orange-100 text-[9px] sm:text-xs">
                              {article.category}
                            </span>

                            {article.district && (
                              <span className="flex items-center gap-0.5 text-blue-800 bg-blue-50 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-blue-100 font-medium text-[9px] sm:text-xs">
                                <MapPin size={10} className="text-orange-500" />
                                {article.district}
                              </span>
                            )}

                            <span className="text-slate-500 flex items-center gap-1 text-[10px] sm:text-xs">
                              <Clock size={10} className="text-orange-500 shrink-0" />
                              <span className="hidden sm:inline">{article.date ? `${article.date} • ` : ""}</span>
                              <span>{formatArticleTime(article)}</span>
                            </span>
                          </div>

                          <h3 className="text-xs sm:text-lg font-bold leading-snug sm:leading-snug text-blue-950 group-hover:text-orange-600 transition line-clamp-2">
                            <Link to={`/news/${article.id}`}>{article.title}</Link>
                          </h3>

                          {article.excerpt && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="hidden sm:flex items-center gap-1 text-slate-500 truncate max-w-[120px]">
                          <User size={12} className="text-orange-500 shrink-0" />
                          <span className="font-medium truncate">
                            {article.reporter || article.author || t("reporterFallback")}
                          </span>
                        </span>

                        <Link
                          to={`/news/${article.id}`}
                          className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold text-orange-600 hover:text-orange-700 ml-auto sm:ml-0"
                        >
                          <span>{t("readStory")}</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}