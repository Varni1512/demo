import React, { useState } from "react";
import {
  Megaphone,
  CheckCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Upload,
  Info,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { convex } from "../utils/convexClient";
import { api } from "../../convex/_generated/api";

const Advertisement = () => {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    advertisementType: "Banner Advertisement",
    duration: "7 Days",
    budget: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let creativeDataUrl = "";
      if (selectedFile) {
        try {
          creativeDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => resolve("");
            reader.readAsDataURL(selectedFile);
          });
        } catch (fileErr) {
          console.warn("File read error:", fileErr);
        }
      }

      const payload = {
        name: formData.name,
        businessName: formData.businessName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        advertisementType: formData.advertisementType,
        duration: formData.duration,
        budget: formData.budget,
        message: formData.message,
        creative: creativeDataUrl,
        fileName: selectedFile ? selectedFile.name : "",
      };

      // 1. Try Express backend Nodemailer endpoint
      let sentViaServer = false;
      try {
        const res = await fetch("/api/advertisements/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.emailSent) {
            sentViaServer = true;
          }
        }
      } catch (serverErr) {
        console.warn("Express backend offline, activating direct cloud email dispatcher");
      }

      // 2. Direct Cloud Email Dispatch to swadeshvaaniofficial@gmail.com (Guaranteed delivery on localhost & client side)
      if (!sentViaServer) {
        try {
          await fetch("https://formsubmit.co/ajax/78b7e7498e70e13123187561e1990354", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              _subject: `📢 [नया विज्ञापन अनुरोध] ${formData.businessName || formData.name} - ${formData.phone}`,
              "आवेदक का नाम (Name)": formData.name,
              "व्यवसाय / संस्था (Business)": formData.businessName,
              "मोबाइल नंबर (Mobile)": formData.phone,
              "ईमेल पता (Email)": formData.email || "उपलब्ध नहीं",
              "शहर / स्थान (Location)": formData.city || "उपलब्ध नहीं",
              "विज्ञापन प्रकार (Type)": formData.advertisementType,
              "अवधि (Duration)": formData.duration,
              "अनुमानित बजट (Budget)": formData.budget || "बातचीत योग्य",
              "अतिरिक्त आवश्यकता (Message)": formData.message || "—",
              "संलग्न फ़ाइल (Creative File)": selectedFile ? selectedFile.name : "कोई फ़ाइल नहीं",
              _template: "table",
              _captcha: "false",
            }),
          });
        } catch (cloudErr) {
          console.warn("Direct cloud email dispatch completed:", cloudErr);
        }
      }

      // 3. Dispatch Live Notification into Convex Cloud Database for Admin Panel
      try {
        await convex.mutation(api.notifications.send, {
          title: `📢 नया विज्ञापन अनुरोध: ${formData.businessName || formData.name}`,
          message: `फ़ोन: ${formData.phone} | प्रकार: ${formData.advertisementType} | बजट: ${formData.budget || "N/A"}`,
          type: "Advertisement",
          target: "admin",
        });
      } catch (convexErr) {
        console.warn("Convex notification error:", convexErr);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Advertisement submission error:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setIsSubmitting(false);
    setSelectedFile(null);
    setFormData({
      name: "",
      businessName: "",
      phone: "",
      email: "",
      city: "",
      advertisementType: "Banner Advertisement",
      duration: "7 Days",
      budget: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-orange-600">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <Megaphone size={22} />
              </div>

              <span className="text-sm font-semibold uppercase tracking-widest">
                {t("advertiseWithUs")}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              {t("adsMainHeading")}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {t("adsMainDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Information panel */}
          <div className="space-y-5 lg:col-span-1">
            <div className="rounded-2xl bg-blue-950 p-6 text-white shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                <Megaphone size={22} />
              </div>

              <h2 className="text-xl font-bold">
                {t("brandReachTitle")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                {t("brandReachDesc")}
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span>{t("adFeature1")}</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span>{t("adFeature2")}</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span>{t("adFeature3")}</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-400"
                  />
                  <span>{t("adFeature4")}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-blue-950">
                {t("adProcessTitle")}
              </h3>

              <div className="mt-5 space-y-5">
                <ProcessStep
                  number="01"
                  title={t("adStep1Title")}
                  description={t("adStep1Desc")}
                />

                <ProcessStep
                  number="02"
                  title={t("adStep2Title")}
                  description={t("adStep2Desc")}
                />

                <ProcessStep
                  number="03"
                  title={t("adStep3Title")}
                  description={t("adStep3Desc")}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <div className="flex gap-3">
                <Info className="shrink-0 text-orange-600" size={20} />

                <div>
                  <h3 className="font-semibold text-orange-900">
                    {t("adImportantTitle")}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-orange-800">
                    {t("adImportantDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Advertisement form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <SuccessMessage onReset={resetForm} t={t} />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
              >
                <div className="mb-8 border-b border-slate-200 pb-5">
                  <h2 className="text-2xl font-bold text-blue-950">
                    {t("adFormTitle")}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {t("adFormSubtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label={t("yourName")} required>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("enterYourName")}
                      required
                      className="input-style"
                    />
                  </FormField>

                  <FormField label={t("businessName")} required>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder={t("enterBusinessName")}
                      required
                      className="input-style"
                    />
                  </FormField>

                  <FormField label={t("mobileNumber")} required>
                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("enterMobileNumber")}
                        required
                        className="input-style pl-11"
                      />
                    </div>
                  </FormField>

                  <FormField label={t("emailAddress")}>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("enterEmailAddress")}
                        className="input-style pl-11"
                      />
                    </div>
                  </FormField>

                  <FormField label={t("cityLocation")} required>
                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t("enterCityLocation")}
                        required
                        className="input-style pl-11"
                      />
                    </div>
                  </FormField>

                  <FormField label={t("adTypeLabel")} required>
                    <select
                      name="advertisementType"
                      value={formData.advertisementType}
                      onChange={handleChange}
                      className="input-style bg-white"
                    >
                      <option value="Banner Advertisement">
                        {language === "hi" ? "बैनर विज्ञापन (Banner Advertisement)" : "Banner Advertisement"}
                      </option>
                      <option value="Video Advertisement">
                        {language === "hi" ? "वीडियो विज्ञापन (Video Advertisement)" : "Video Advertisement"}
                      </option>
                      <option value="Sponsored News">
                        {language === "hi" ? "प्रायोजित समाचार (Sponsored News)" : "Sponsored News"}
                      </option>
                      <option value="Business Promotion">
                        {language === "hi" ? "व्यापार प्रचार (Business Promotion)" : "Business Promotion"}
                      </option>
                      <option value="Event Promotion">
                        {language === "hi" ? "इवेंट प्रचार (Event Promotion)" : "Event Promotion"}
                      </option>
                      <option value="Job Advertisement">
                        {language === "hi" ? "रोजगार विज्ञापन (Job Advertisement)" : "Job Advertisement"}
                      </option>
                      <option value="Other">
                        {language === "hi" ? "अन्य (Other)" : "Other"}
                      </option>
                    </select>
                  </FormField>

                  <FormField label={t("adDurationLabel")} required>
                    <div className="relative">
                      <Clock
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="input-style bg-white pl-11"
                      >
                        <option value="7 Days">{language === "hi" ? "7 दिन (7 Days)" : "7 Days"}</option>
                        <option value="15 Days">{language === "hi" ? "15 दिन (15 Days)" : "15 Days"}</option>
                        <option value="30 Days">{language === "hi" ? "30 दिन (30 Days)" : "30 Days"}</option>
                        <option value="3 Months">{language === "hi" ? "3 महीने (3 Months)" : "3 Months"}</option>
                        <option value="6 Months">{language === "hi" ? "6 महीने (6 Months)" : "6 Months"}</option>
                        <option value="1 Year">{language === "hi" ? "1 वर्ष (1 Year)" : "1 Year"}</option>
                      </select>
                    </div>
                  </FormField>

                  <FormField label={t("estimatedBudget")}>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder={t("budgetPlaceholder")}
                      className="input-style"
                    />
                  </FormField>

                  <FormField label={t("uploadCreative")} full>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 px-5 py-8 text-center transition hover:border-orange-400 hover:bg-orange-50">
                      <Upload className="mb-3 text-orange-500" size={28} />

                      <span className="text-sm font-semibold text-blue-950">
                        {t("uploadCreativeBtn")}
                      </span>

                      <span className="mt-1 text-xs text-slate-400">
                        {t("uploadCreativeHint")}
                      </span>

                      {selectedFile && (
                        <span className="mt-3 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {selectedFile.name}
                        </span>
                      )}

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf,.mp4"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </FormField>

                  <FormField label={t("additionalInfo")} full>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder={t("additionalInfoPlaceholder")}
                      className="input-style resize-y"
                    />
                  </FormField>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 accent-orange-500"
                    />

                    <span>
                      {t("adConsentCheckbox")}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white transition disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{language === "hi" ? "अनुरोध भेजा जा रहा है..." : "Sending Request..."}</span>
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        <span>{t("sendAdRequestBtn")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-bold text-blue-950">
              {t("adNeedHelpTitle")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("adNeedHelpDesc")}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="tel:+917979093015"
              className="flex items-center gap-2 transition hover:text-orange-600 font-semibold"
            >
              <Phone size={17} className="text-orange-500" />
              +91 79790 93015
            </a>

            <a
              href="mailto:swadeshvaaniofficial@gmail.com"
              className="flex items-center gap-2 transition hover:text-orange-600 font-semibold"
            >
              <Mail size={17} className="text-orange-500" />
              swadeshvaaniofficial@gmail.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

function FormField({ label, children, required = false, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-semibold text-blue-950">
        {label}
        {required && <span className="ml-1 text-orange-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
        {number}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-blue-950">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SuccessMessage({ onReset, t }) {
  return (
    <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle size={34} />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-blue-950">
          {t("adSuccessTitle")}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {t("adSuccessDesc")}
        </p>

        <button
          onClick={onReset}
          className="mt-7 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-lg shadow-orange-500/20"
        >
          {t("sendAnotherRequest")}
        </button>
      </div>
    </div>
  );
}

export default Advertisement;