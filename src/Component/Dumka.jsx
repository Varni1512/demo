import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  History,
  Compass,
  ArrowRight,
  Clock,
  User,
  Bookmark,
  Sparkles,
  Building2,
  Calendar,
  Train,
  CheckCircle2,
  Filter,
} from "lucide-react";
import {
  getAllArticles,
  syncArticlesFromServer,
  toHindiNumber,
  getCategoryFallbackImage,
  resolveArticleImage,
} from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";

// Import Dumka places photos
import malutiTemplesImage from "./photos/Maluti.jpeg";
import basukinathTempleImage from "./photos/basukinath.jpg";
import hijlaMelaImage from "./photos/hijla.jpeg";
import dumkaRailwayImage from "./photos/railwaystation.jpeg";
import dumkaCityHeroImage from "./photos/dumka.jpeg";

const dumkaFamousPlaces = [
  {
    id: "maluti-mandir",
    name: "मलूटी मंदिर (मलूटी टेराकोटा मंदिर)",
    englishName: "Maluti Temples",
    category: "धरोहर एवं वास्तुकला",
    location: "मलूटी ग्राम, शिकारीपाड़ा प्रखंड, दुमका",
    image: malutiTemplesImage,
    description:
      "मलूटी गांव को 'मंदिरों का गांव' कहा जाता है। 17वीं से 19वीं शताब्दी के दौरान ननकर राजवंश द्वारा निर्मित 108 टेराकोटा मंदिरों में से 72 मंदिर आज भी संरक्षित हैं। इन मंदिरों की दीवारों पर रामायण, महाभारत और देवी दुर्गा की पौराणिक गाथाओं को मिट्टी की सुंदर पकी हुई पट्टियों (टेराकोटा) पर अत्यंत बारीकी से उकेरा गया है।",
    highlights: [
      "विश्व प्रसिद्ध टेराकोटा नक्काशी व स्थापत्य कला",
      "मौलिक रूप से 108 मंदिरों का अद्वितीय संकुल",
      "पुरातत्व और ऐतिहासिक शोध का प्रमुख केंद्र",
    ],
    bestTimeToVisit: "अक्टूबर से मार्च (सुबह व शाम की रोशनी में नक्काशी अद्भुत दिखती है)",
  },
  {
    id: "basukinath-mandir",
    name: "बाबा बासुकीनाथ मंदिर",
    englishName: "Basukinath Temple",
    category: "प्रसिद्ध धार्मिक तीर्थस्थल",
    location: "बासुकीनाथ धाम, जरमुंडी प्रखंड, दुमका",
    image: basukinathTempleImage,
    description:
      "बाबा बासुकीनाथ मंदिर भारत के अत्यंत पवित्र शिवधामों में से एक है। मान्यता है कि देवघर स्थित बाबा बैद्यनाथ धाम में जलार्पण के बाद जब तक बासुकीनाथ में पूजा-अर्चना नहीं की जाती, तब तक तीर्थयात्रा पूर्ण नहीं मानी जाती। बासुकीनाथ को 'फौजदारी दरबार' भी कहा जाता है, जहाँ श्रद्धालु अपनी मनोकामनाएं लेकर शीश नवाते हैं।",
    highlights: [
      "द्वादश ज्योतिर्लिंग यात्रा का अनिवार्य धार्मिक पड़ाव",
      "श्रावणी मेले में लाखों कांवरियों का पवित्र समागम",
      "फौजदारी बाबा के रूप में अगाध जनआस्था",
    ],
    bestTimeToVisit: "सावन माह एवं वर्षभर शिवरात्रि व सोमवार को विशेष पूजा",
  },
  {
    id: "hijla-mela",
    name: "ऐतिहासिक हिजला मेला",
    englishName: "Historic Hijla Mela",
    category: "जनजातीय लोक-संस्कृति एवं मेला",
    location: "हिजला गांव, मयूराक्षी नदी तट, दुमका",
    image: hijlaMelaImage,
    description:
      "हिजला मेला संताल परगना की समृद्ध आदिवासी परंपरा, लोककला, हस्तशिल्प और सांस्कृतिक धरोहर का सबसे बड़ा प्रतीक है। 1890 में तत्कालीन अंग्रेज उपायुक्त जॉन आर. कास्टेयर्स द्वारा स्थानीय संताल समुदाय के साथ सीधा संवाद स्थापित करने के उद्देश्य से शुरू हुआ यह मेला आज झारखंड का राज्य स्तरीय ऐतिहासिक सांस्कृतिक महोत्सव बन चुका है।",
    highlights: [
      "मयूराक्षी नदी के मनोरम तट पर भव्य आयोजन",
      "संताली लोकनृत्य, मांदर की थाप और पारम्परिक वाद्ययंत्र",
      "स्थानीय हस्तशिल्प, तीरंदाजी व पारंपरिक व्यंजन",
    ],
    bestTimeToVisit: "प्रतिवर्ष फरवरी माह में वसंत ऋतु के दौरान",
  },
  {
    id: "railway-station",
    name: "दुमका रेलवे स्टेशन",
    englishName: "Dumka Railway Station",
    category: "परिवहन एवं आधुनिक कनेक्टिविटी",
    location: "रसिकापुर, दुमका शहर, दुमका",
    image: dumkaRailwayImage,
    description:
      "दुमका रेलवे स्टेशन झारखंड की उप-राजधानी दुमका और समूचे संताल परगना प्रमंडल का प्रमुख रेल परिवहन केंद्र है। ईस्टर्न रेलवे के आसनसोल मंडल के अंतर्गत आने वाला यह स्टेशन देवघर, भागलपुर, जसीडीह, रांची, हावड़ा और पटना से सीधा संपर्क प्रदान करता है, जिससे क्षेत्र में पर्यटन, व्यापार और आवागमन को नई गति मिली है।",
    highlights: [
      "संताल परगना प्रमंडल का प्रमुख ब्रॉडगेज जंक्शन",
      "बासुकीनाथ और मलूटी जाने वाले पर्यटकों का मुख्य प्रवेश द्वार",
      "आधुनिक यात्री सुविधाएं एवं चौड़े प्लेटफॉर्म",
    ],
    bestTimeToVisit: "वर्षभर 24 घंटे रेल सेवाएं उपलब्ध",
  },
];

const dumkaSubDistricts = [
  { hi: "दुमका सदर", en: "Dumka Sadar" },
  { hi: "जरमुंडी (बासुकीनाथ)", en: "Jarmundi" },
  { hi: "शिकारीपाड़ा (मलूटी)", en: "Shikaripara" },
  { hi: "रानीश्वर", en: "Ranishwar" },
  { hi: "जामा", en: "Jama" },
  { hi: "रामगढ़", en: "Ramgarh" },
  { hi: "काठीकुंड", en: "Kathikund" },
  { hi: "गोपीकांदर", en: "Gopikandar" },
  { hi: "मसलिया", en: "Masalia" },
  { hi: "सरैयाहाट", en: "Saraiyahat" },
];

export default function DumkaPage() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  // Fetch articles and sync in real-time with Convex DB
  useEffect(() => {
    const fetchDumkaArticles = () => {
      const all = getAllArticles();
      const dumkaNews = all.filter((a) => {
        const dist = (a.district || "").toLowerCase();
        const title = (a.title || "").toLowerCase();
        const content = (a.content || "").toLowerCase();
        const excerpt = (a.excerpt || "").toLowerCase();
        const subDist = (a.subDistrict || "").toLowerCase();

        return (
          dist === "dumka" ||
          dist.includes("dumka") ||
          dist.includes("दुमका") ||
          title.includes("दुमका") ||
          title.includes("dumka") ||
          title.includes("बासुकीनाथ") ||
          title.includes("मलूटी") ||
          title.includes("हिजला") ||
          title.includes("मसलिया") ||
          title.includes("जामा") ||
          title.includes("जरमुंडी") ||
          title.includes("शिकारीपाड़ा") ||
          content.includes("दुमका") ||
          excerpt.includes("दुमका") ||
          subDist.includes("dumka") ||
          subDist.includes("दुमका")
        );
      });
      setArticles(dumkaNews);
    };

    fetchDumkaArticles();
    syncArticlesFromServer().then(fetchDumkaArticles).catch(() => {});

    // Listen for real-time Convex DB synchronization updates
    window.addEventListener("sv_articles_change", fetchDumkaArticles);
    window.addEventListener("storage", fetchDumkaArticles);

    return () => {
      window.removeEventListener("sv_articles_change", fetchDumkaArticles);
      window.removeEventListener("storage", fetchDumkaArticles);
    };
  }, []);

  // Filter categories
  const categories = [
    { id: "ALL", label: "सभी समाचार" },
    { id: "शिक्षा", label: "शिक्षा" },
    { id: "राजनीति", label: "राजनीति" },
    { id: "अपराध", label: "अपराध" },
    { id: "प्रशासन", label: "प्रशासन" },
    { id: "धर्म", label: "धर्म / बासुकीनाथ" },
    { id: "दुर्घटना", label: "दुर्घटना" },
  ];

  const filteredArticles = articles.filter((art) => {
    if (selectedFilter === "ALL") return true;
    const cat = (art.category || "").toLowerCase();
    const title = (art.title || "").toLowerCase();
    const target = selectedFilter.toLowerCase();
    return cat.includes(target) || title.includes(target);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dumka Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            src={dumkaCityHeroImage}
            alt="Dumka City"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative ambient gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-orange-600/90 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Compass size={14} />
              उप-राजधानी विशेषांक
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-orange-300 rounded-full text-xs font-semibold">
              संताल परगना प्रमंडल मुख्यालय
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            दुमका विशेष <span className="text-orange-500">—</span>{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500 bg-clip-text text-transparent">
              धरोहर, संस्कृति एवं ताज़ा समाचार
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            झारखंड की उप-राजधानी दुमका अपनी समृद्ध जनजातीय संस्कृति, 108 टेराकोटा
            मंदिरों के ऐतिहासिक गांव मलूटी, पवित्र शिवधाम बाबा बासुकीनाथ और
            मयूराक्षी नदी के तट पर लगने वाले विश्वविख्यात हिजला मेले के लिए पूरे
            भारत में प्रसिद्ध है।
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                प्रशासनिक दर्जा
              </p>
              <p className="text-base font-bold text-orange-400 mt-0.5">
                झारखंड की उप-राजधानी
              </p>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                प्रसिद्ध मंदिर
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                बासुकीनाथ व मलूटी
              </p>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                प्रसिद्ध मेला
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                ऐतिहासिक हिजला मेला
              </p>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                लाइव समाचार
              </p>
              <p className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                {toHindiNumber(articles.length)} ताज़ा खबरें
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 1. Four Famous Places of Dumka */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-orange-600 text-xs font-extrabold uppercase tracking-widest">
                <History size={15} />
                धरोहर एवं प्रमुख पर्यटन स्थल
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                दुमका के प्रमुख ऐतिहासिक, धार्मिक एवं दर्शनीय स्थल
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              मलूटी के टेराकोटा मंदिरों से लेकर बासुकीनाथ धाम, हिजला मेला और रेलवे
              स्टेशन तक दुमका की विशिष्ट पहचान।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dumkaFamousPlaces.map((place, index) => (
              <article
                key={place.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={place.image}
                      alt={place.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getCategoryFallbackImage("झारखंड");
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-600/95 backdrop-blur-sm text-white rounded-full text-xs font-bold shadow-md">
                        #{toHindiNumber(index + 1)} {place.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {place.name}
                      </h3>
                      <p className="text-xs text-orange-200 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {place.location}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {place.description}
                    </p>

                    {/* Key Highlights */}
                    <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-100/80 space-y-2">
                      <p className="text-xs font-bold text-orange-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} className="text-orange-600" />
                        प्रमुख विशेषताएं एवं महत्व:
                      </p>
                      <ul className="space-y-1.5">
                        {place.highlights.map((h, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-700 flex items-start gap-2"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-emerald-600 mt-0.5 shrink-0"
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-orange-500" />
                    <strong>यात्रा का समय:</strong> {place.bestTimeToVisit}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 2. Real-Time Dumka Live News Section */}
        <section className="pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-orange-600 text-xs font-extrabold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600" />
                </span>
                लाइव अपडेट्स • रीयल-टाइम सिंक
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                दुमका जिले की ताज़ा खबरें
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedFilter === cat.id
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-orange-300 transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Article Image */}
                    {article.image ? (
                      <Link
                        to={`/news/${article.id}`}
                        className="block relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100"
                      >
                        <img
                          src={resolveArticleImage(article.image, article.category || "दुमका", article.id || article.title)}
                          alt={article.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            if (article.image && article.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                              e.currentTarget.src = `https://swadeshvaani.com${article.image}`;
                            } else {
                              e.currentTarget.parentElement.style.display = "none";
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold text-orange-600 shadow-sm">
                            {article.category || "दुमका"}
                          </span>
                          {article.district && (
                            <span className="px-2 py-0.5 bg-blue-950/80 backdrop-blur-sm rounded-full text-[10px] font-semibold text-white shadow-sm flex items-center gap-1">
                              <MapPin size={9} className="text-orange-400" />
                              {article.district}
                            </span>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="p-5 pb-0 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 bg-orange-100 rounded-full text-[10px] font-bold text-orange-600">
                          {article.category || "दुमका"}
                        </span>
                        {article.district && (
                          <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-semibold text-slate-700 flex items-center gap-1">
                            <MapPin size={9} className="text-orange-400" />
                            {article.district}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-2 leading-snug">
                        <Link to={`/news/${article.id}`}>{article.title}</Link>
                      </h3>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {article.excerpt || article.summary || article.content}
                      </p>
                    </div>
                  </div>

                  {/* Article Meta Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium truncate max-w-[140px]">
                      <User size={12} className="text-orange-500 shrink-0" />
                      {article.reporter || article.author || "दुमका ब्यूरो"}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock size={12} />
                      {article.date || "आज"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <p className="text-sm font-semibold">
                इस श्रेणी में कोई खबर उपलब्ध नहीं है।
              </p>
              <button
                onClick={() => setSelectedFilter("ALL")}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition"
              >
                सभी दुमका समाचार देखें
              </button>
            </div>
          )}
        </section>

        {/* 3. Sub-Districts / Blocks of Dumka Overview */}
        <section className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-extrabold uppercase tracking-widest">
              <Building2 size={15} />
              प्रशासनिक विभाजन
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">
              दुमका जिले के सभी 10 प्रखंड एवं प्रमुख अंचल
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              स्वदेश वाणी दुमका जिले के प्रत्येक प्रखंड, पंचायत और ग्रामीण क्षेत्र से
              सटीक एवं निष्पक्ष पत्रकारिता आप तक पहुँचाने के लिए प्रतिबद्ध है।
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {dumkaSubDistricts.map((sub, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition flex items-center gap-2"
              >
                <div className="h-6 w-6 rounded-full bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-[10px] font-bold text-orange-400">
                  {toHindiNumber(i + 1)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{sub.hi}</p>
                  <p className="text-[10px] text-slate-400">{sub.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
