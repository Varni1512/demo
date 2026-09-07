import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Home,
  UserCheck,
  ShieldCheck,
  KeyRound,
  X,
  User,
  Phone,
} from "lucide-react";
import { authenticateAccount, isAdminAuthenticated, isUserAuthenticated } from "../utils/auth";
import logo from "./photos/logo.jpeg";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect");

  // Tab state: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState("login");

  // ===== LOGIN STATE =====
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState(null); // { type: 'success'|'error', message }
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotStatus(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail.trim())) {
      setForgotStatus({ type: "error", message: "कृपया एक मान्य ईमेल आईडी दर्ज करें।" });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStatus({ type: "success", message: data.message || "ईमेल भेज दिया गया है!" });
        setForgotEmail("");
      } else {
        setForgotStatus({ type: "error", message: data.error || "कुछ त्रुटि हुई।" });
      }
    } catch {
      setForgotStatus({ type: "error", message: "सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।" });
    } finally {
      setForgotLoading(false);
    }
  };

  // Popup Modal State on Login Success
  const [loginModal, setLoginModal] = useState(null); // { role: 'admin' | 'user', title: '', message: '', target: '' }

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/Admin", { replace: true });
    } else if (isUserAuthenticated() && redirectPath && redirectPath !== "/Admin") {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!identifier.trim()) {
      setErrorMsg("कृपया अपना ईमेल या यूज़रनेम दर्ज करें।");
      return;
    }
    if (!password) {
      setErrorMsg("कृपया अपना पासवर्ड दर्ज करें।");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateAccount(identifier, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        if (result.role === "admin") {
          // Authorized admin -> redirect directly to Admin Panel/Dashboard
          navigate("/Admin", { replace: true });
          return;
        }

        // Regular user flow
        const target = redirectPath && redirectPath !== "/Admin" ? redirectPath : "/";

        // Trigger Success Popup for standard user
        setLoginModal({
          role: result.role,
          name: result.user?.name || "User",
          message: result.message,
          target,
        });

        setTimeout(() => {
          navigate(target, { replace: true });
        }, 1000);
      } else {
        setErrorMsg(result.message);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg("लॉगिन में त्रुटि आई। कृपया पुनः प्रयास करें।");
    }
  };

  // ===== SIGNUP STATE =====
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupErrorMsg, setSignupErrorMsg] = useState("");
  const [signupSuccessMsg, setSignupSuccessMsg] = useState("");
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupErrorMsg("");
    setSignupSuccessMsg("");

    if (!signupForm.name.trim()) {
      setSignupErrorMsg("कृपया अपना नाम दर्ज करें।");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email.trim())) {
      setSignupErrorMsg("कृपया एक मान्य ईमेल आईडी दर्ज करें।");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(signupForm.phone.trim())) {
      setSignupErrorMsg("कृपया एक मान्य भारतीय मोबाइल नंबर दर्ज करें (10 अंक)।");
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupErrorMsg("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupErrorMsg("पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।");
      return;
    }

    if (!agreeTerms) {
      setSignupErrorMsg("कृपया नियम और शर्तों से सहमत हों।");
      return;
    }

    setIsSignupLoading(true);

    // Simulate API call / registration
    setTimeout(() => {
      setIsSignupLoading(false);
      setSignupSuccessMsg("आपका खाता सफलतापूर्वक बनाया गया! लॉगिन पेज पर जा रहे हैं...");

      setTimeout(() => {
        setActiveTab("login");
        setSignupForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setSignupSuccessMsg("");
      }, 1500);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* ── Forgot Password Modal ── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-orange-200 text-slate-800 rounded-3xl max-w-sm w-full p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">पासवर्ड भूल गए?</h3>
                  <p className="text-[11px] text-slate-500">Forgot Password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowForgotModal(false); setForgotStatus(null); setForgotEmail(""); }}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              अपना ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट की जानकारी भेजेंगे।
            </p>

            {/* Status feedback */}
            {forgotStatus && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                forgotStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {forgotStatus.type === "success"
                  ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />
                  : <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
                <span>{forgotStatus.message}</span>
              </div>
            )}

            {forgotStatus?.type !== "success" && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {forgotLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>रीसेट ईमेल भेजें</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Login Success Popup Modal */}
      {loginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-orange-200 text-slate-800 rounded-3xl max-w-sm w-full p-7 shadow-2xl text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center border border-green-200">
              {loginModal.role === "admin" ? (
                <ShieldCheck size={32} />
              ) : (
                <UserCheck size={32} />
              )}
            </div>

            <span
              className={`inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
                loginModal.role === "admin"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {loginModal.role === "admin"
                ? "Admin Privileges Granted"
                : "Reader / User Login"}
            </span>

            <h3 className="text-xl font-bold text-slate-900">
              {loginModal.role === "admin"
                ? "एडमिन लॉगिन सफल!"
                : `स्वागत है, ${loginModal.name}!`}
            </h3>

            <p className="text-xs text-slate-600">
              {loginModal.message}
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span>रीडायरेक्ट किया जा रहा है...</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Brand & Home Link */}
      <div className="mb-6 text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-orange-600 hover:text-white border border-orange-200 text-orange-700 text-xs font-bold backdrop-blur transition-all duration-200 mb-4 shadow-sm group cursor-pointer"
        >
          <Home size={14} className="text-orange-600 group-hover:text-white" />
          <span>← मुख्य पृष्ठ पर वापस जाएं (Back to Home)</span>
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

      {/* Auth Card */}
      <div className="max-w-md w-full relative z-10">
        <div className="rounded-3xl border border-orange-200 bg-white shadow-xl shadow-orange-100/50 backdrop-blur-xl p-7 sm:p-9 text-slate-800">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-orange-50 border border-orange-200 p-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition ${
                activeTab === "login"
                  ? "bg-orange-600 text-white shadow"
                  : "text-slate-600 hover:bg-orange-100"
              }`}
            >
              लॉगिन (Log In)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition ${
                activeTab === "signup"
                  ? "bg-orange-600 text-white shadow"
                  : "text-slate-600 hover:bg-orange-100"
              }`}
            >
              साइन अप (Sign Up)
            </button>
          </div>

          {/* ==================== LOGIN FORM ==================== */}
          {activeTab === "login" && (
            <>
              <div className="pb-5 mb-5 border-b border-orange-100 text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  लॉगिन करें (Log In)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  अपने खाते में प्रवेश करने के लिए विवरण दर्ज करें
                </p>
              </div>

              {/* Feedback error alert */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    ईमेल या यूज़रनेम (Email or Username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={17} />
                    </div>
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="you@example.com या यूज़रनेम"
                      autoComplete="username"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                    >
                      पासवर्ड (Password)
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={17} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
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

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-orange-50 border-orange-200 text-orange-600 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(true); setForgotStatus(null); }}
                    className="text-xs text-orange-600 hover:text-orange-700 transition cursor-pointer font-semibold"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>सत्यापित हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>लॉगिन करें (Log In)</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Switch to signup */}
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-600">
                  नया खाता बनाना है?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-orange-600 hover:text-orange-700 font-semibold underline bg-transparent"
                  >
                    यहाँ साइन अप करें
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ==================== SIGNUP FORM ==================== */}
          {activeTab === "signup" && (
            <>
              <div className="pb-5 mb-5 border-b border-orange-100 text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  नया खाता बनाएं (Sign Up)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  समाचार अपडेट और सुविधाओं के लिए रजिस्टर करें
                </p>
              </div>

              {/* Feedback error alert */}
              {signupErrorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                  <span>{signupErrorMsg}</span>
                </div>
              )}

              {/* Success message */}
              {signupSuccessMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={18} className="shrink-0 text-green-600 mt-0.5" />
                  <span>{signupSuccessMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignupSubmit} className="space-y-4">
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
                      value={signupForm.name}
                      onChange={handleSignupChange}
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
                      value={signupForm.email}
                      onChange={handleSignupChange}
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
                      value={signupForm.phone}
                      onChange={handleSignupChange}
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
                    htmlFor="signup-password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    पासवर्ड (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={17} />
                    </div>
                    <input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      placeholder="कम से कम 6 अक्षर"
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 pr-11 py-3 bg-orange-50/40 border border-orange-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
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
                  disabled={isSignupLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSignupLoading ? (
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
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-orange-600 hover:text-orange-700 font-semibold underline bg-transparent"
                  >
                    यहाँ लॉगिन करें
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Bottom Back to Home Link */}
        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 hover:text-orange-600 border border-orange-200 text-xs font-bold shadow-sm transition"
          >
            <ArrowLeft size={14} className="text-orange-500" />
            <span>← मुख्य पृष्ठ पर वापस जाएं (Back to Homepage)</span>
          </Link>
        </div>

        {/* Footer info */}
        <p className="mt-4 text-center text-xs text-slate-500">
          Swadesh Vaani &copy; {new Date().getFullYear()} &bull; All Rights Reserved
        </p>
      </div>
    </main>
  );
}