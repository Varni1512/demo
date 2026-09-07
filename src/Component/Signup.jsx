import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Home,
  User,
  Phone,
  X,
} from "lucide-react";
import logo from "./photos/logo.jpeg";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg("कृपया अपना नाम दर्ज करें।");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("कृपया एक मान्य ईमेल आईडी दर्ज करें।");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setErrorMsg("कृपया एक मान्य भारतीय मोबाइल नंबर दर्ज करें (10 अंक)।");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("कृपया नियम और शर्तों से सहमत हों।");
      return;
    }

    setIsLoading(true);

    // Simulate API call / registration
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("आपका खाता सफलतापूर्वक बनाया गया! लॉगिन पेज पर जा रहे हैं...");

      // Redirect to login after success
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand & Home Link */}
      <div className="mb-6 text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-orange-50 border border-orange-200 text-orange-700 hover:text-orange-800 text-xs font-medium backdrop-blur transition mb-4 shadow-sm"
        >
          <Home size={14} className="text-orange-600" />
          <span>मुख्य पृष्ठ पर वापस जाएं (Back to Home)</span>
        </Link>

        <div className="flex justify-center mb-2.5">
          <img
            src={logo}
            alt="Swadesh Vani Logo"
            className="h-14 w-auto object-contain drop-shadow-md rounded-lg p-1 bg-white border border-orange-100"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          स्वदेश वाणी
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
          सत्य, निष्पक्ष और सटीक पत्रकारिता
        </p>
      </div>

      {/* Sign Up Card */}
      <div className="max-w-md w-full relative z-10">
        <div className="rounded-3xl border border-orange-200 bg-white shadow-xl shadow-orange-100/50 backdrop-blur-xl p-7 sm:p-9 text-slate-800">
          <div className="pb-5 mb-5 border-b border-orange-100 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              नया खाता बनाएं (Sign Up)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              समाचार अपडेट और सुविधाओं के लिए रजिस्टर करें
            </p>
          </div>

          {/* Feedback error alert */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 size={18} className="shrink-0 text-green-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                पूरा नाम (Full Name)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={17} />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="आपका नाम"
                  autoComplete="name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                ईमेल आईडी (Email Address)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={17} />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                मोबाइल नंबर (Mobile Number)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={17} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  autoComplete="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={17} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="कम से कम 6 अक्षर"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                पासवर्ड कन्फर्म करें (Confirm Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={17} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="पासवर्ड दोबारा दर्ज करें"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-orange-50 border-orange-200 text-orange-600 focus:ring-0 w-4 h-4 cursor-pointer mt-0.5"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  मैं{" "}
                  <Link to="/terms" className="text-orange-600 hover:text-orange-700 underline">
                    नियम और शर्तों
                  </Link>
                  {" "}और{" "}
                  <Link to="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                    गोपनीयता नीति
                  </Link>
                  {" "}से सहमत हूँ
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>खाता बनाया जा रहा है...</span>
                </>
              ) : (
                <>
                  <span>खाता बनाएं (Create Account)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              पहले से ही खाता है?{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                यहाँ लॉगिन करें
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-5 text-center text-xs text-slate-500">
          Swadesh Vaani &copy; {new Date().getFullYear()} &bull; All Rights Reserved
        </p>
      </div>
    </main>
  );
}