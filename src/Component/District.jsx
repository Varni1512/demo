import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  MapPin,
  Search,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { getAllArticles, syncArticlesFromServer, JHARKHAND_DISTRICTS_DATA, getSubDistrictsForDistrict, resolveArticleImage, getCategoryFallbackImage, toHindiNumber } from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";

const districts = [
  "सभी जिले",
  "रांची",
  "दुमका",
  "धनबाद",
  "जमशेदपुर",
  "बोकारो",
  "देवघर",
  "गिरिडीह",
  "हजारीबाग",
  "पलामू",
  "गुमला",
  "सिमडेगा",
  "गढ़वा",
  "चतरा",
  "लातेहार",
  "लोहरदगा",
  "खूंटी",
  "रामगढ़",
  "पाकुड़",
  "गोड्डा",
  "साहिबगंज",
  "जामताड़ा",
  "कोडरमा",
  "सरायकेला खरसावां",
  "पश्चिमी सिंहभूम",
  "पूर्वी सिंहभूम",
];

const defaultDistrictNews = [];

const categoryLinks = [
  "सभी खबरें",
  "राजनीति",
  "शिक्षा",
  "स्वास्थ्य",
  "खेल",
  "अपराध",
  "प्रशासन",
  "धर्म",
  "आपदा",
  "दुर्घटना",
];

function NewsMeta({ item }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
        <MapPin size={13} className="text-orange-500" />
        {item.district}
        {item.subDistrict && <span className="text-orange-600">({item.subDistrict})</span>}
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-1">
        <Clock size={13} />
        {item.time}
      </span>
    </div>
  );
}

function FeaturedNewsCard({ item }) {
  const { t } = useLanguage();
  return (
    <Link
      to={item.link}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      {item.image ? (
        <div className="relative h-64 overflow-hidden sm:h-80">
          <img
            src={resolveArticleImage(item.image, item.category, item.id || item.title)}
            alt={item.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
              } else {
                e.currentTarget.parentElement.style.display = "none";
              }
            }}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white shadow">
              <Zap size={12} />
              {t("featuredBadge")}
            </span>

            <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {item.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
            <NewsMeta item={item} />

            <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-7 text-white sm:text-2xl">
              {item.title}
            </h2>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
              {t("readFullStory")}
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              <Zap size={12} />
              {t("featuredBadge")}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {item.category}
            </span>
          </div>
          <NewsMeta item={item} />
          <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-7 text-blue-950 sm:text-2xl group-hover:text-orange-600 transition">
            {item.title}
          </h2>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
            {t("readFullStory")}
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </span>
        </div>
      )}
    </Link>
  );
}

function NewsListItem({ item }) {
  return (
    <Link
      to={item.link}
      className="group flex gap-4 border-b border-slate-100 py-5 first:pt-0 last:border-0 last:pb-0"
    >
      {item.image ? (
        <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-40">
          <img
            src={resolveArticleImage(item.image, item.category, item.id || item.title)}
            alt={item.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
              } else {
                e.currentTarget.parentElement.style.display = "none";
              }
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="min-w-0">
        <span className="text-xs font-semibold text-orange-600">
          {item.category}
        </span>

        <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-6 text-slate-900 transition group-hover:text-orange-600 sm:text-base">
          {item.title}
        </h3>

        <div className="mt-2">
          <NewsMeta item={item} />
        </div>
      </div>
    </Link>
  );
}

function SmallNewsItem({ item, index }) {
  return (
    <Link
      to={item.link}
      className="group flex gap-3 border-b border-slate-100 py-4 last:border-0"
    >
      <span className="text-2xl font-bold leading-none text-orange-200">
        {toHindiNumber(String(index + 1).padStart(2, "0"))}
      </span>

      <div>
        <span className="text-xs font-semibold text-orange-600">
          {item.category}
        </span>

        <h3 className="mt-1 line-clamp-3 text-sm font-semibold leading-6 text-slate-800 transition group-hover:text-orange-600">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

export default function DistrictNews() {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState("सभी जिले");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("सभी प्रखण्ड");
  const [selectedCategory, setSelectedCategory] = useState("सभी खबरें");
  const [search, setSearch] = useState("");
  const [articlesList, setArticlesList] = useState(() => getAllArticles());

  useEffect(() => {
    setArticlesList(getAllArticles());
    syncArticlesFromServer().then((fresh) => {
      if (Array.isArray(fresh)) setArticlesList(getAllArticles());
    });

    const handleUpdate = () => {
      setArticlesList(getAllArticles());
    };

    window.addEventListener("sv_articles_change", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sv_articles_change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const districtNews = useMemo(() => {
    const dynamicItems = articlesList.map((a, idx) => ({
      id: a.id,
      title: a.title,
      category: a.category || "झारखंड",
      district: a.district || "रांची",
      subDistrict: a.subDistrict || "",
      location: a.district || "झारखंड",
      time: a.date || "आज",
      image: a.image || "",
      link: `/news/${a.id}`,
      featured: idx === 0 || a.featured,
    }));
    return dynamicItems.length > 0 ? dynamicItems : defaultDistrictNews;
  }, [articlesList]);

  // Current subdistricts for the chosen district
  const availableSubDistricts = useMemo(() => {
    if (selectedDistrict === "सभी जिले" || selectedDistrict === "All Districts") return [];
    return getSubDistrictsForDistrict(selectedDistrict);
  }, [selectedDistrict]);

  const filteredNews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return districtNews.filter((item) => {
      const districtMatch =
        selectedDistrict === "सभी जिले" ||
        selectedDistrict === "All Districts" ||
        item.district === selectedDistrict ||
        (selectedDistrict === "रांची" && (item.district === "Ranchi" || item.district === "रांची")) ||
        (selectedDistrict === "दुमका" && (item.district === "Dumka" || item.district === "दुमका")) ||
        (selectedDistrict === "धनबाद" && (item.district === "Dhanbad" || item.district === "धनबाद")) ||
        (selectedDistrict === "बोकारो" && (item.district === "Bokaro" || item.district === "बोकारो")) ||
        (selectedDistrict === "देवघर" && (item.district === "Deoghar" || item.district === "देवघर")) ||
        (selectedDistrict === "गिरिडीह" && (item.district === "Giridih" || item.district === "गिरिडीह")) ||
        (selectedDistrict === "हजारीबाग" && (item.district === "Hazaribagh" || item.district === "हजारीबाग")) ||
        (selectedDistrict === "पलामू" && (item.district === "Palamu" || item.district === "पलामू")) ||
        (selectedDistrict === "गढ़वा" && (item.district === "Garhwa" || item.district === "गढ़वा")) ||
        (selectedDistrict === "चतरा" && (item.district === "Chatra" || item.district === "चतरा")) ||
        (selectedDistrict === "लातेहार" && (item.district === "Latehar" || item.district === "लातेहार")) ||
        (selectedDistrict === "गुमला" && (item.district === "Gumla" || item.district === "गुमला")) ||
        (selectedDistrict === "सिमडेगा" && (item.district === "Simdega" || item.district === "सिमडेगा")) ||
        (selectedDistrict === "लोहरदगा" && (item.district === "Lohardaga" || item.district === "लोहरदगा")) ||
        (selectedDistrict === "खूंटी" && (item.district === "Khunti" || item.district === "खूंटी")) ||
        (selectedDistrict === "रामगढ़" && (item.district === "Ramgarh" || item.district === "रामगढ़")) ||
        (selectedDistrict === "पाकुड़" && (item.district === "Pakur" || item.district === "पाकुड़")) ||
        (selectedDistrict === "गोड्डा" && (item.district === "Godda" || item.district === "गोड्डा")) ||
        (selectedDistrict === "साहिबगंज" && (item.district === "Sahibganj" || item.district === "साहिबगंज")) ||
        (selectedDistrict === "जामताड़ा" && (item.district === "Jamtara" || item.district === "जामताड़ा")) ||
        (selectedDistrict === "कोडरमा" && (item.district === "Koderma" || item.district === "कोडरमा")) ||
        (selectedDistrict === "सरायकेला खरसावां" && item.district && (item.district.includes("Seraikela") || item.district.includes("सरायकेला"))) ||
        (selectedDistrict === "पश्चिमी सिंहभूम" && item.district && (item.district.includes("West Singhbhum") || item.district.includes("पश्चिमी सिंहभूम"))) ||
        (selectedDistrict === "पूर्वी सिंहभूम" && item.district && (item.district.includes("East Singhbhum") || item.district.includes("पूर्वी सिंहभूम") || item.district.includes("जमशेदपुर")));

      const subDistrictMatch =
        selectedSubDistrict === "सभी प्रखण्ड" ||
        selectedSubDistrict === "All Blocks" ||
        !item.subDistrict ||
        item.subDistrict === selectedSubDistrict ||
        (item.title && item.title.includes(selectedSubDistrict));

      const categoryMatch =
        selectedCategory === "सभी खबरें" ||
        selectedCategory === "All Categories" ||
        selectedCategory === "ALL" ||
        item.category === selectedCategory ||
        (selectedCategory === "राजनीति" && (item.category === "Politics" || item.category === "राजनीति")) ||
        (selectedCategory === "शिक्षा" && (item.category === "Education" || item.category === "शिक्षा")) ||
        (selectedCategory === "स्वास्थ्य" && (item.category === "Health" || item.category === "स्वास्थ्य" || item.category === "Health & Wellness")) ||
        (selectedCategory === "खेल" && (item.category === "Sports" || item.category === "खेल")) ||
        (selectedCategory === "अपराध" && (item.category === "Crime" || item.category === "अपराध" || item.category === "Crime & Law")) ||
        (selectedCategory === "प्रशासन" && (item.category === "Administration" || item.category === "प्रशासन")) ||
        (selectedCategory === "धर्म" && (item.category === "Religion" || item.category === "धर्म" || item.category === "धार्मिक")) ||
        (selectedCategory === "आपदा" && (item.category === "Disaster" || item.category === "आपदा" || item.category === "आपदा प्रबंधन")) ||
        (selectedCategory === "दुर्घटना" && (item.category === "Accident" || item.category === "दुर्घटना" || item.category === "हादसा"));

      const searchMatch =
        normalizedSearch === "" ||
        (item.title && item.title.toLowerCase().includes(normalizedSearch)) ||
        (item.district && item.district.toLowerCase().includes(normalizedSearch)) ||
        (item.subDistrict && item.subDistrict.toLowerCase().includes(normalizedSearch)) ||
        (item.category && item.category.toLowerCase().includes(normalizedSearch));

      return districtMatch && subDistrictMatch && categoryMatch && searchMatch;
    });
  }, [districtNews, selectedDistrict, selectedSubDistrict, selectedCategory, search]);

  const featuredNews = filteredNews.filter((item) => item.featured);
  const latestNews = filteredNews.filter((item) => !item.featured);
  const trendingNews = districtNews.slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Page header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                {language === "hi" ? "झारखंड जिला कवरेज" : "Jharkhand Local Coverage"}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-5xl">
                {t("districtTitle")}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {t("districtSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
              <Zap size={17} />
              {language === "hi" ? "ताजा जिला अपडेट" : "Latest District Updates"}
            </div>
          </div>
        </div>
      </section>

      {/* District selector */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 space-y-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-blue-950">
              <MapPin size={18} className="text-orange-500" />
              {t("selectDistrict")}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {districts.map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => {
                    setSelectedDistrict(district);
                    setSelectedSubDistrict(language === "hi" ? "सभी प्रखण्ड" : "All Blocks");
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
                    selectedDistrict === district
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-district / Block Filter Strip if district has subdistricts */}
          {availableSubDistricts.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2.5 animate-fadeIn">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                प्रखण्ड / उप-जिला चुनें:
              </span>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedSubDistrict("सभी प्रखण्ड")}
                  className={`whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedSubDistrict === "सभी प्रखण्ड"
                      ? "bg-blue-950 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  सभी प्रखण्ड
                </button>

                {availableSubDistricts.map((sub) => {
                  const label = sub.hi;
                  const isSelected = selectedSubDistrict === sub.hi || selectedSubDistrict === sub.en;
                  return (
                    <button
                      key={sub.en}
                      type="button"
                      onClick={() => setSelectedSubDistrict(sub.hi)}
                      className={`whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? "bg-orange-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search and categories */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="जिले या खबर के नाम से खोजें..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-orange-50 hover:text-orange-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categoryLinks.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main news layout */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* Main column */}
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                  {selectedDistrict}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-blue-950 sm:text-3xl">
                  जिले की प्रमुख खबरें
                </h2>
              </div>

              <span className="text-sm text-slate-500">
                {filteredNews.length} खबरें
              </span>
            </div>

            {filteredNews.length > 0 ? (
              <>
                {featuredNews.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {featuredNews.map((item) => (
                      <FeaturedNewsCard key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {latestNews.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                          Latest updates
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-blue-950">
                          ताजा जिला खबरें
                        </h2>
                      </div>

                      <Clock size={20} className="text-orange-500" />
                    </div>

                    {latestNews.map((item) => (
                      <NewsListItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-6 py-16 text-center">
                <Search className="mx-auto text-orange-400" size={30} />

                <h2 className="mt-4 text-xl font-bold text-blue-950">
                  कोई खबर नहीं मिली
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  कृपया किसी दूसरे जिले या श्रेणी का चयन करें।
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict("सभी जिले");
                    setSelectedCategory("सभी खबरें");
                    setSearch("");
                  }}
                  className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  सभी खबरें देखें
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                    Trending
                  </p>

                  <h2 className="text-xl font-bold text-blue-950">
                    सबसे ज्यादा पढ़ी गई
                  </h2>
                </div>
              </div>

              {trendingNews.map((item, index) => (
                <SmallNewsItem key={item.id} item={item} index={index} />
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl bg-blue-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                District coverage
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                अपने जिले की खबर सबसे पहले पढ़ें
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                अपने क्षेत्र की खबर, समस्या और स्थानीय अपडेट हम तक भेजें।
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                खबर भेजें
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}