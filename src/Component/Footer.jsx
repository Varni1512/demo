import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

import hindilogo from "./photos/logo.jpeg";
import { useLanguage } from "../context/LanguageContext.jsx";

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t("home"), to: "/" },
    { label: t("districtNews"), to: "/district" },
    { label: t("allNews"), to: "/news" },
    { label: t("videos"), to: "/youtubevideos" },
    { label: t("advertisement"), to: "/advertisement" },
    { label: t("aboutUs"), to: "/about" },
  ];

  const newsLinks = [
    { label: t("education"), to: "/education" },
    { label: t("worldNews"), to: "/worldnews" },
    { label: t("technology"), to: "/technologynews" },
    { label: t("sports"), to: "/sportsnews" },
    { label: t("historicJharkhand"), to: "/historicjharkhand" },
    { label: t("dumkaSpecial"), to: "/dumka" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      icon: <FaFacebookF size={16} />,
      href: "https://www.facebook.com/",
    },
    {
      label: "Instagram",
      icon: <FaInstagram size={18} />,
      href: "https://www.instagram.com/",
    },
    {
      label: "YouTube",
      icon: <FaYoutube size={18} />,
      href: "https://www.youtube.com/",
    },
    {
      label: "Twitter",
      icon: <FaTwitter size={17} />,
      href: "https://twitter.com/",
    },
  ];

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-blue-950 text-white">
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src={hindilogo}
                alt="Swadesh Vani logo"
                className="h-24 w-auto object-contain bg-white rounded-xl p-1 shadow-md"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-blue-100">
              {t("footerTagline")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-800 text-blue-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <FooterColumn title={t("quickLinks")} links={quickLinks} />

          {/* News categories */}
          <FooterColumn title={t("categories")} links={newsLinks} />

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              {t("contactUs")}
            </h3>

            <div className="space-y-4 text-sm text-blue-100">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-orange-400"
                />

                <span>
                  {t("footerAddress")}
                </span>
              </div>

              <a
                href="tel:+917979093015"
                className="flex items-center gap-3 transition hover:text-orange-400"
              >
                <Phone size={17} className="text-orange-400" />
                +91 79790 93015
              </a>

              <a
                href="mailto:swadeshvaaniofficial@gmail.com"
                className="flex items-center gap-3 break-all transition hover:text-orange-400"
              >
                <Mail size={17} className="shrink-0 text-orange-400" />
                swadeshvaaniofficial@gmail.com
              </a>
            </div>

            <Link
              to="/advertisement"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {t("advertisement")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-blue-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-center sm:px-8 md:flex-row md:text-left">
          <p className="text-xs text-blue-200">
            © {new Date().getFullYear()} Swadesh Vani (स्वदेश वाणी). {t("copyright")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-blue-200">
            <Link
              to="/privacypolicy"
              className="transition hover:text-orange-400"
            >
              {t("privacyPolicy")}
            </Link>

            <Link
              to="/t&c"
              className="transition hover:text-orange-400"
            >
              {t("termsConditions")}
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 rounded-full border border-blue-800 px-3 py-2 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer"
            >
              <ArrowUp size={14} />
              <span>{t("backToTop")}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="group flex items-center gap-2 text-sm text-blue-100 transition hover:text-orange-400"
            >
              <ArrowRight
                size={14}
                className="text-orange-500 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
              />

              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
