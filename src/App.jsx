import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./Component/navbar.jsx";
import Home from "./Component/Home";
import News from "./Component/News.jsx";
import Education from "./Component/Education.jsx";
import Worldnews from "./Component/Worldnews.jsx";
import Technologynews from "./Component/Technologynews.jsx";
import Sportsnews from "./Component/Sportsnews.jsx";
import Signup from "./Component/Signup.jsx";
import Login from "./Component/Login.jsx";
import HistoricJharkhand from "./Component/HistoricJharkhand.jsx";
import Dumka from "./Component/Dumka.jsx";
import Admin from "./Component/Admin.jsx";
import YouTubeVideos from "./Component/YouTubeVideos.jsx";
import Advertisement from "./Component/Sponsors.jsx";
import Footer from "./Component/Footer.jsx";
import About from "./Component/About.jsx";
import TermsConditions from "./Component/TermsConditions.jsx";
import PrivacyPolicy from "./Component/LegalPrivacy.jsx";
import ArticleDetail from "./Component/ArticleDetail.jsx";
import District from "./Component/District.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

function AppLayout() {
  const location = useLocation();

  // Hide public Navbar and Footer on the admin page
  const isAdminPage = location.pathname.toLowerCase() === "/admin";

  // Global content protection: Disable text selection and copying across public pages
  useEffect(() => {
    const isAllowedTarget = (target) => {
      if (!target) return false;
      const tagName = target.tagName ? target.tagName.toLowerCase() : "";
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable
      ) {
        return true;
      }
      if (
        target.closest &&
        (target.closest(".allow-select") || target.closest(".admin-container"))
      ) {
        return true;
      }
      return false;
    };

    const handleSelectStart = (e) => {
      if (!isAdminPage && !isAllowedTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleCopy = (e) => {
      if (!isAdminPage && !isAllowedTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleCut = (e) => {
      if (!isAdminPage && !isAllowedTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e) => {
      if (!isAdminPage && !isAllowedTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      if (isAdminPage || isAllowedTarget(e.target)) return;
      // Block Ctrl+C, Ctrl+X, Ctrl+U (view source), Ctrl+A (select all), Ctrl+S (save page)
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "u", "a", "s"].includes(e.key?.toLowerCase())
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdminPage]);

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/News" element={<News />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<ArticleDetail />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/Education" element={<Education />} />
        <Route path="/education" element={<Education />} />
        <Route path="/Worldnews" element={<Worldnews />} />
        <Route path="/worldnews" element={<Worldnews />} />
        <Route path="/Technologynews" element={<Technologynews />} />
        <Route path="/technologynews" element={<Technologynews />} />
        <Route path="/Sportsnews" element={<Sportsnews />} />
        <Route path="/sportsnews" element={<Sportsnews />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/About" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/t&c" element={<TermsConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/District" element={<District />} />
        <Route path="/district" element={<District />} />
        <Route
          path="/HistoricJharkhand"
          element={<HistoricJharkhand />}
        />
        <Route
          path="/historicjharkhand"
          element={<HistoricJharkhand />}
        />
        <Route path="/Dumka" element={<Dumka />} />
        <Route path="/dumka" element={<Dumka />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/YouTubeVideos"
          element={<YouTubeVideos />}
        />
        <Route
          path="/youtubevideos"
          element={<YouTubeVideos />}
        />
        <Route
          path="/Advertisement"
          element={<Advertisement />}
        />
        <Route
          path="/advertisement"
          element={<Advertisement />}
        />
      </Routes>

      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppLayout />
      </Router>
    </LanguageProvider>
  );
}

export default App;