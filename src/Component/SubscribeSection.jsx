import React, { useState } from "react";
import { Mail, Phone, CheckCircle2, AlertCircle, Send, Sparkles } from "lucide-react";
import { saveSubscriber } from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";

export default function SubscribeSection({ variant = "default", className = "" }) {
  const { language, t } = useLanguage();
  const [subMethod, setSubMethod] = useState("phone"); // "phone" | "email"
  const [subPhone, setSubPhone] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            message: language === "hi" ? `🎉 बधाई! आपका मोबाइल नंबर (+91 ${cleanPhone}) सफलतापूर्वक सब्सक्राइब हो गया है। आपको व्हाट्सएप पर ताज़ा खबरें मिलेंगी।` : `🎉 Congratulations! Your mobile (+91 ${cleanPhone}) is subscribed successfully!`,
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
      const res = saveSubscriber({ phone: "", email: cleanEmail });
      setTimeout(() => {
        setIsSubmitting(false);
        if (res.success) {
          setSubStatus({
            type: "success",
            message: language === "hi" ? `🎉 धन्यवाद! ईमेल (${cleanEmail}) पर हमारी दैनिक न्यूज़लेटर सफलतापूर्वक सक्रिय कर दी गई है।` : `🎉 Thank you! Email (${cleanEmail}) subscribed successfully.`,
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

  return (
    <section className={`rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50/70 via-white to-blue-50/50 p-6 sm:p-10 shadow-lg shadow-orange-500/5 ${className}`}>
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">
          <Mail size={13} className="text-orange-600" /> {t("subscribeTitle")}
        </span>

        <h2 className="text-xl sm:text-3xl font-extrabold text-blue-950">
          {t("subscribeHeading")}
        </h2>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
          {t("subscribeDesc")}
        </p>

        {/* Mobile / Email Tab Switcher */}
        <div className="mt-5 flex justify-center">
          <div className="inline-flex rounded-2xl p-1 bg-white border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setSubMethod("phone");
                setSubStatus(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subMethod === "phone"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              <Phone size={13} />
              <span>{t("mobileTab")}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSubMethod("email");
                setSubStatus(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subMethod === "email"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              <Mail size={13} />
              <span>{t("emailTab")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification alert */}
      {subStatus && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl p-3.5 text-xs sm:text-sm transition-all duration-300 max-w-lg mx-auto ${
            subStatus.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {subStatus.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{subStatus.message}</div>
        </div>
      )}

      <form onSubmit={handleSubscribe} className="mt-5 space-y-3.5 max-w-lg mx-auto">
        {subMethod === "phone" ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t("enterMobile")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                value={subPhone}
                onChange={(e) => setSubPhone(e.target.value)}
                placeholder="98765 43210"
                maxLength={10}
                className="w-full rounded-xl border border-slate-300 bg-white pl-16 pr-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 placeholder:font-normal focus:border-orange-500 focus:ring-4 focus:ring-orange-100 shadow-xs"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {t("mobileHint")}
            </span>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t("enterEmail")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={15} />
              </div>
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 placeholder:font-normal focus:border-orange-500 focus:ring-4 focus:ring-orange-100 shadow-xs"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {t("emailHint")}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>{t("subscribing")}</span>
          ) : (
            <>
              <span>
                {subMethod === "phone"
                  ? (language === "hi" ? "व्हाट्सएप अपडेट्स के लिए सब्सक्राइब करें" : "Subscribe for WhatsApp Alerts")
                  : (language === "hi" ? "ईमेल न्यूज़लेटर सब्सक्राइब करें" : "Subscribe Email Newsletter")}
              </span>
              <Send size={14} />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
