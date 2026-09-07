import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import hindilogo from "./photos/logo.jpeg";
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Home,
  Newspaper,
  GraduationCap,
  Globe,
  Briefcase,
  Trophy,
  Cpu,
  Tv,
  Video,
  User,
  UserCog,
  Megaphone,
  Info,
  History,
  LogOut,
  Check,
  Trash2,
  ExternalLink,
  Volume2,
  Languages,
  Sparkles,
  AlertTriangle,
  Flame,
  MapPin,
  Building2,
} from "lucide-react";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  clearNotifications,
  requestNotificationPermission,
  toHindiNumber,
  getAllArticles,
  resolveArticleImage,
  getCategoryFallbackImage,
} from "../data/newsData";

import { isAdminAuthenticated, logoutAdmin, getAdminUser } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage, setLanguage, t } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [isAdmin, setIsAdmin] = useState(() => isAdminAuthenticated());
  const [adminUser, setAdminUser] = useState(() => getAdminUser());

  // Accordion state for categories dropdown in sidebar (open by default for quick access)
  const [openSections, setOpenSections] = useState({
    categories: true,
  });

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const searchInputRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Sync auth state
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAdminAuthenticated();
      setIsAdmin(auth);
      setAdminUser(getAdminUser());
    };

    window.addEventListener("sv_auth_change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("sv_auth_change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Sync notifications
  useEffect(() => {
    const updateNotifs = () => {
      setNotifications(getNotifications());
    };

    window.addEventListener("sv_notification_received", updateNotifs);
    window.addEventListener("sv_notifications_change", updateNotifs);
    window.addEventListener("storage", updateNotifs);

    return () => {
      window.removeEventListener("sv_notification_received", updateNotifs);
      window.removeEventListener("sv_notifications_change", updateNotifs);
      window.removeEventListener("storage", updateNotifs);
    };
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search autocomplete results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const all = getAllArticles();
    const matches = all
      .filter(
        (a) =>
          (a.title && a.title.toLowerCase().includes(q)) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
          (a.category && a.category.toLowerCase().includes(q)) ||
          (a.district && a.district.toLowerCase().includes(q))
      )
      .slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    setSearchOpen(false);
    setSearchResults([]);
    setSidebarOpen(false);
    navigate(`/News?q=${encodeURIComponent(query)}`);
  };

  const handleSelectSearchResult = (articleId) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSidebarOpen(false);
    navigate(`/news/${articleId}`);
  };

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    setNotifOpen(false);
    if (notif.articleId) {
      navigate(`/news/${notif.articleId}`);
    }
  };

  const handleRequestPermission = async () => {
    await requestNotificationPermission();
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/Login");
  };

  const closeMenus = () => {
    setSidebarOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
  };

  // Nav links with fixed routes
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "District", to: "/District" },
    { label: "Historic Jharkhand", to: "/HistoricJharkhand" },
    { label: "Videos", to: "/YouTubeVideos" },
    { label: "Advertisement", to: "/Advertisement" },
    { label: "About", to: "/About" },
  ];

  const sidebarLinks = [
    {
      id: "mainMenu",
      section: t("mainMenu"),
      items: [
        { icon: <Home size={18} />, title: t("home"), to: "/" },
        { icon: <Newspaper size={18} />, title: t("allNews"), to: "/News" },
        { icon: <MapPin size={18} />, title: t("districtNews"), to: "/District" },
        { icon: <History size={18} />, title: t("historicJharkhand"), to: "/HistoricJharkhand" },
        { icon: <Building2 size={18} />, title: t("dumkaSpecial"), to: "/Dumka" },
      ],
    },
    {
      id: "categories",
      section: t("categories"),
      items: [
        { icon: <GraduationCap size={18} />, title: t("education"), to: "/Education" },
        { icon: <Globe size={18} />, title: t("worldNews"), to: "/Worldnews" },
        { icon: <Cpu size={18} />, title: t("technology"), to: "/Technologynews" },
        { icon: <Trophy size={18} />, title: t("sports"), to: "/Sportsnews" },
        { icon: <Sparkles size={18} />, title: t("religion"), to: "/News?category=धर्म" },
        { icon: <AlertTriangle size={18} />, title: t("disaster"), to: "/News?category=आपदा" },
        { icon: <Flame size={18} />, title: t("accident"), to: "/News?category=दुर्घटना" },
      ],
    },
    {
      id: "jharkhandFeatures",
      section: t("jharkhandFeatures"),
      items: [
        { icon: <History size={18} />, title: t("historicJharkhand"), to: "/HistoricJharkhand" },
        { icon: <Building2 size={18} />, title: t("dumkaSpecial"), to: "/Dumka" },
        { icon: <Video size={18} />, title: t("videos"), to: "/YouTubeVideos" },
        { icon: <Megaphone size={18} />, title: t("advertisement"), to: "/Advertisement" },
        { icon: <Info size={18} />, title: t("aboutUs"), to: "/About" },
      ],
    },
    {
      id: "adminAccount",
      section: t("adminAccount"),
      items: isAdmin
        ? [
            { icon: <UserCog size={18} />, title: t("adminPanel"), to: "/Admin" },
          ]
        : [
            { icon: <User size={18} />, title: t("adminLogin"), to: "/Login" },
          ],
    },
  ];

  return (
    <>
      {/* Tricolor accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Sidebar overlay */}
      <div
        onClick={closeMenus}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
          sidebarOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Sidebar Drawer (Right-aligned) */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <img
              src={hindilogo}
              alt="Swadesh Vani Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <button
            onClick={closeMenus}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Language Switcher Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Languages size={17} className="text-orange-600" />
              <span className="text-xs font-bold text-slate-800">
                {language === "hi" ? "भाषा (Language)" : "Language (भाषा)"}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-orange-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === "hi"
                    ? "bg-orange-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-orange-600"
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  language === "en"
                    ? "bg-orange-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-orange-600"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {sidebarLinks.map((section) => {
            const isCollapsible = section.id === "categories";
            const isOpen = !!openSections[section.id];

            if (isCollapsible) {
              return (
                <div
                  key={section.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  {/* Dropdown Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-left hover:bg-slate-100/80 transition cursor-pointer group select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-orange-600 transition">
                        {section.section}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded-full">
                        {section.items.length}
                      </span>
                    </div>

                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-white border border-slate-200 group-hover:border-orange-300 group-hover:text-orange-600 transition">
                      <ChevronDown
                        size={14}
                        className={`text-slate-500 group-hover:text-orange-600 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Options List */}
                  {isOpen && (
                    <div className="px-2 pb-2.5 pt-1 space-y-1 bg-white border-t border-slate-100 animate-fadeIn">
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.title}
                            to={item.to}
                            onClick={closeMenus}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                              isActive
                                ? "bg-orange-50 text-orange-600 font-bold border border-orange-200/70"
                                : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                            }`}
                          >
                            <span className={`${isActive ? "text-orange-600" : "text-gray-400 group-hover:text-orange-600"} transition`}>
                              {item.icon}
                            </span>
                            <span>{item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal Non-Dropdown Sections (मुख्य मेन्यू, झारखंड विशेष, व्यवस्थापक)
            return (
              <div key={section.id} className="space-y-1">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {section.section}
                </p>
                <div className="space-y-0.5 pt-0.5">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.title}
                        to={item.to}
                        onClick={closeMenus}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                          isActive
                            ? "bg-orange-50 text-orange-600 font-bold border border-orange-200/70"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        <span className={`${isActive ? "text-orange-600" : "text-gray-400 group-hover:text-orange-600"} transition`}>
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Footer info */}
        {isAdmin && (
          <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="text-xs">
                <p className="font-bold text-blue-950">Swadesh Vani Admin</p>
                <p className="text-[10px] text-emerald-600 font-medium">Logged in</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
              title={t("logout")}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Header - FULL WIDTH */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-md w-full shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex h-20 items-center justify-between lg:h-24 gap-3 lg:gap-6">
            {/* Left Side: Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link
                to="/"
                className="flex items-center shrink-0 transition-transform hover:scale-[1.02]"
              >
                <img
                  src={hindilogo}
                  alt="Swadesh Vani Logo"
                  className="h-12 w-auto select-none object-contain sm:h-16 lg:h-20"
                />
              </Link>
            </div>

            {/* Right Desktop Controls */}
            <div className="hidden items-center gap-3 xl:gap-4 lg:flex shrink-0">
              {/* Language Toggle Pill */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50/80 hover:bg-orange-100 text-orange-900 text-xs font-bold transition shadow-2xs cursor-pointer group select-none"
                title={language === "hi" ? "Switch to English" : "हिंदी में बदलें"}
              >
                <Languages size={15} className="text-orange-600 transition-transform duration-300 group-hover:rotate-12" />
                <span className="tracking-wide">{language === "hi" ? "English" : "हिंदी"}</span>
              </button>

              {/* Enhanced Search Input with Live Dropdown */}
              <div className="relative">
                {!searchOpen ? (
                  <button
                    onClick={() => {
                      setSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 50);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-orange-300 hover:text-orange-600"
                    aria-label="Open search"
                  >
                    <Search size={17} />
                  </button>
                ) : (
                  <div className="relative">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-1.5"
                    >
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="समाचार खोजें (Press Enter)..."
                          className="w-56 rounded-full border border-orange-400 bg-white pl-3.5 pr-8 py-2 text-xs text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-orange-100"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="rounded-full bg-orange-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-orange-700 shadow-sm"
                      >
                        खोजें
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                      >
                        <X size={15} />
                      </button>
                    </form>

                    {/* Autocomplete Dropdown Preview */}
                    {searchQuery.trim() && searchResults.length > 0 && (
                      <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 z-50 animate-fadeIn">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                          <span>मिलते-जुलते समाचार</span>
                          <span className="text-orange-600">{toHindiNumber(searchResults.length)}</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectSearchResult(item.id)}
                              className="w-full text-left p-2.5 hover:bg-orange-50 rounded-xl transition flex items-start gap-2.5 group cursor-pointer"
                            >
                              {item.image ? (
                                <img
                                  src={resolveArticleImage(item.image, item.category, item.id || item.title)}
                                  alt=""
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    if (item.image && item.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                                      e.currentTarget.src = `https://swadeshvaani.com${item.image}`;
                                    } else {
                                      e.currentTarget.style.display = "none";
                                    }
                                  }}
                                  className="h-10 w-12 object-cover rounded-lg shrink-0 border border-gray-200"
                                />
                              ) : null}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-800 group-hover:text-orange-600 line-clamp-2 leading-tight">
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-orange-600 font-bold uppercase mt-0.5 inline-block">
                                  {item.category}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full mt-1.5 py-1.5 bg-slate-50 hover:bg-orange-100 text-center text-xs font-bold text-orange-700 rounded-xl transition cursor-pointer"
                        >
                          सभी परिणाम देखें &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notification Bell Dropdown */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    notifOpen
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                  }`}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-extrabold text-white ring-2 ring-white">
                      {unreadNotifsCount > 9 ? "९+" : toHindiNumber(unreadNotifsCount)}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel (Desktop) */}
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-gray-100 z-50 p-4 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Bell size={14} />
                        </div>
                        <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          समाचार सूचनाएं
                        </h4>
                      </div>

                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} />
                          <span>सभी पढ़ी गईं</span>
                        </button>
                      )}
                    </div>

                    {/* Push permission hint */}
                    {"Notification" in window && Notification.permission !== "granted" && (
                      <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between text-xs">
                        <span className="text-orange-950 text-[11px]">
                          ताज़ा खबरों के ब्राउज़र अलर्ट पाएं
                        </span>
                        <button
                          onClick={handleRequestPermission}
                          className="px-2 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-bold hover:bg-orange-700 transition cursor-pointer"
                        >
                          स्वीकार करें
                        </button>
                      </div>
                    )}

                    {/* Notifications List */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 -mx-1 px-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                          कोई नई सूचना नहीं है।
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 rounded-2xl transition flex items-start gap-3 cursor-pointer ${
                              !n.read ? "bg-orange-50/50 hover:bg-orange-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                                !n.read ? "bg-orange-600" : "bg-gray-200"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs leading-snug line-clamp-2 ${
                                  !n.read ? "font-bold text-gray-900" : "font-medium text-gray-600"
                                }`}
                              >
                                {n.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                <span className="text-orange-600 font-semibold">{n.category}</span>
                                <span>&bull;</span>
                                <span>{n.timestamp || n.date}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={clearNotifications}
                          className="text-gray-400 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> सभी हटाएं
                        </button>

                        <Link
                          to="/News"
                          onClick={() => setNotifOpen(false)}
                          className="text-orange-600 font-bold hover:underline"
                        >
                          सभी ताज़ा खबरें &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Login / Admin Action Button */}
              {/* Menu trigger button (Next to notification) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 text-gray-700 hover:text-orange-600 transition cursor-pointer font-bold text-xs shadow-xs"
                aria-label="Open menu"
              >
                <Menu size={18} />
                <span className="hidden text-xs font-bold uppercase tracking-wider xl:block">
                  {t("menu")}
                </span>
              </button>

              <div className="h-4 w-px bg-gray-200" />

              {/* Login / Admin Action Button (In menu's place) */}
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/Admin"
                    className="flex items-center gap-1.5 rounded-full bg-blue-950 px-3.5 py-2 text-white text-xs font-bold shadow-sm hover:bg-blue-900 transition"
                  >
                    <UserCog size={15} className="text-orange-400" />
                    <span>एडमिन पैनल</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="लॉगआउट"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/Login"
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-gray-700 transition hover:border-orange-300 hover:text-orange-600 text-xs font-bold"
                >
                  <User size={15} />
                  <span>लॉगिन</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions Header (Right side: Lang, Search, Bell, Menu, Login) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              {/* Mobile Language Toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-orange-200 bg-orange-50/90 text-orange-900 text-[11px] font-bold transition cursor-pointer select-none"
                title={language === "hi" ? "Switch to English" : "हिंदी में बदलें"}
              >
                <Languages size={13} className="text-orange-600" />
                <span>{language === "hi" ? "EN" : "हिं"}</span>
              </button>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (!searchOpen) {
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  }
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  searchOpen
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600"
                }`}
                aria-label="Search news"
              >
                {searchOpen ? <X size={17} /> : <Search size={17} />}
              </button>

              {/* Mobile Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    notifOpen
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600"
                  }`}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-orange-600 text-[9px] font-bold text-white flex items-center justify-center ring-1 ring-white">
                      {unreadNotifsCount > 9 ? "9+" : unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Mobile Notification Panel */}
                {notifOpen && (
                  <div className="fixed left-3 right-3 top-20 z-50 rounded-3xl bg-white shadow-2xl border border-gray-100 p-4 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Bell size={14} />
                        </div>
                        <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          समाचार सूचनाएं
                        </h4>
                      </div>

                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 -mx-1 px-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-gray-400">
                          कोई नई सूचना नहीं है।
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 rounded-2xl transition flex items-start gap-3 cursor-pointer ${
                              !n.read ? "bg-orange-50/50 hover:bg-orange-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                                !n.read ? "bg-orange-600" : "bg-gray-200"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs leading-snug line-clamp-2 ${
                                  !n.read ? "font-bold text-gray-900" : "font-medium text-gray-600"
                                }`}
                              >
                                {n.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                <span className="text-orange-600 font-semibold">{n.category}</span>
                                <span>&bull;</span>
                                <span>{n.timestamp || n.date}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={clearNotifications}
                        className="text-gray-400 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={12} /> Clear all
                      </button>

                      <Link
                        to="/News"
                        onClick={() => setNotifOpen(false)}
                        className="text-orange-600 font-bold hover:underline"
                      >
                        सभी ताज़ा खबरें &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle (Next to Notification) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 transition cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>

              {/* Mobile Login / User Icon (In Menu's place at the right end) */}
              <Link
                to={isAdmin ? "/Admin" : "/Login"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                aria-label={isAdmin ? "Admin Dashboard" : "Login"}
              >
                {isAdmin ? <UserCog size={17} className="text-orange-600" /> : <User size={17} />}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown (When search is opened) */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-sm lg:hidden animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="समाचार खोजें (Search news)..."
                className="flex-1 rounded-full border border-orange-300 bg-orange-50/30 px-4 py-2 text-xs text-gray-800 outline-none focus:border-orange-500 focus:bg-white"
              />
              <button
                type="submit"
                className="rounded-full bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
              >
                खोजें
              </button>
            </form>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;