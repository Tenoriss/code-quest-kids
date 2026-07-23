import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router";
import { Sparkles, Mail, Lock, User, Calendar, MapPin, GraduationCap, Eye, EyeOff, ArrowRight, Code, Smartphone, Star, Rocket, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Byte } from "@/components/layout/Byte";

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, signUp, login, teacherLogin } = useAuth();
  const { resetGame } = useGame();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [byteMood, setByteMood] = useState<"wave" | "happy" | "think">("wave");
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    grade: "",
    country: "",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.fullName || !form.nickname || !form.email || !form.password || !form.birthday || !form.grade) {
      setError("Please fill in all required fields!");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    // Generate a mock verification code and show verification step
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setVerificationStep(true);
    setByteMood("think");
  };

  const handleVerifyOtp = () => {
    const enteredCode = otp.join("");
    if (enteredCode !== generatedOtp) {
      setError("Incorrect verification code! Please try again.");
      return;
    }

    setLoading(true);
    setError("");
    const result = signUp({
      fullName: form.fullName,
      nickname: form.nickname,
      email: form.email,
      password: form.password,
      birthday: form.birthday,
      grade: form.grade,
      country: form.country,
      avatarUrl: "",
      favoriteColor: "#6366f1",
      favoriteCharacter: "Byte",
      bio: "",
      avatarFrame: "default",
    });

    if (result.success) {
      resetGame();
      setSuccess("Email verified! Account created! 🎉");
      setByteMood("happy");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setError(result.error || "Something went wrong!");
      setByteMood("think");
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only single digit
    if (value && !/^\d$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleTeacherLogin = () => {
    setTeacherLoading(true);
    setError("");
    const result = teacherLogin();
    if (result.success) {
      setSuccess("Welcome, Teacher! 👩‍🏫");
      setByteMood("happy");
      setTimeout(() => navigate("/teacher"), 500);
    } else {
      setError(result.error || "Something went wrong!");
    }
    setTeacherLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password!");
      setLoading(false);
      return;
    }

    const result = login(form.email, form.password);
    if (result.success) {
      setSuccess("Welcome back!");
      setByteMood("happy");
      setTimeout(() => navigate("/dashboard"), 500);
    } else {
      setError(result.error || "Login failed!");
      setByteMood("think");
    }
    setLoading(false);
  };

  const floatingIcons = [
    { Icon: Code, x: "5%", y: "20%", delay: 0, size: 20 },
    { Icon: Star, x: "90%", y: "15%", delay: 0.5, size: 16 },
    { Icon: Rocket, x: "10%", y: "80%", delay: 1, size: 22 },
    { Icon: Smartphone, x: "85%", y: "70%", delay: 0.8, size: 18 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-purple-950/10 overflow-hidden relative">
      {/* Floating decorations */}
      {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20 dark:opacity-10 pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          <Icon size={size} className="text-blue-500" />
        </motion.div>
      ))}

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
              >
                CQ
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Code Quest Kids</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Byte + Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex flex-col items-center justify-center space-y-6"
            >
              <Byte
                mood={byteMood}
                noVoice
              />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Join the Adventure!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Create your account and start learning about sequences and algorithms through fun games!
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-4 mt-4">
                {[
                  { icon: "🎮", text: "Interactive Games" },
                  { icon: "🏆", text: "Earn XP & Achievements" },
                  { icon: "🤖", text: "Learn with Byte the Robot" },
                  { icon: "📚", text: "Fun Lessons & Quizzes" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/30">
                {/* Tabs */}
                <div className="flex mb-6 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
                  <button
                    onClick={() => { setMode("signup"); setError(""); setByteMood("wave"); }}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      mode === "signup"
                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => { setMode("login"); setError(""); setByteMood("wave"); }}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      mode === "login"
                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Login
                  </button>
                </div>

                {/* Byte greeting for mobile */}
                <div className="lg:hidden mb-4">
                  <Byte mood={byteMood} noVoice />
                </div>

                {verificationStep ? (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                      Verify Your Email
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We sent a verification code to <strong className="text-gray-700 dark:text-gray-200">{form.email}</strong>
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      />
                    ))}
                  </div>

                  {/* Demo OTP hint */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-xs text-gray-400">
                      📧 Demo mode — Your code is: <span className="font-mono font-bold text-green-600 dark:text-green-400">{generatedOtp}</span>
                    </p>
                  </motion.div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-center">
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => { setVerificationStep(false); setOtp(["", "", "", "", "", ""]); setError(""); }}
                      variant="outline"
                      className="flex-1 rounded-full h-12 text-sm"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.join("").length !== 6}
                      className={`flex-1 rounded-full h-12 text-sm ${
                        otp.join("").length === 6
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Verify & Create Account
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
              <AnimatePresence mode="wait">
                  {mode === "signup" ? (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      {/* Full Name */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Nickname */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Nickname *</label>
                        <div className="relative">
                          <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                            placeholder="What should we call you?"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password (min 6 chars)"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Confirm Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Row: Birthday + Grade */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Birthday *</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              name="birthday"
                              type="date"
                              value={form.birthday}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Grade *</label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                              name="grade"
                              value={form.grade}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                            >
                              <option value="">Select grade</option>
                              <option value="1">Grade 1</option>
                              <option value="2">Grade 2</option>
                              <option value="3">Grade 3</option>
                              <option value="4">Grade 4</option>
                              <option value="5">Grade 5</option>
                              <option value="6">Grade 6</option>
                              <option value="7">Grade 7</option>
                              <option value="8">Grade 8</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Country (Optional) */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Country (Optional)</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="Where are you from?"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                          {error}
                        </motion.p>
                      )}
                      {success && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                          {success}
                        </motion.p>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-12 shadow-lg text-sm"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Creating Account...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Create Account
                          </span>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl mb-2"
                        >
                          👋
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Welcome Back!</h3>
                        <p className="text-xs text-gray-500">Sign in to continue your adventure</p>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                          {error}
                        </motion.p>
                      )}
                      {success && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                          {success}
                        </motion.p>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-12 shadow-lg text-sm"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Signing In...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Sign In
                          </span>
                        )}
                      </Button>

                      {/* Teacher Demo Login */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white dark:bg-gray-800 px-3 text-gray-400">
                            {mode === "login" ? "or" : "or"}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={handleTeacherLogin}
                        disabled={teacherLoading}
                        variant="outline"
                        className="w-full rounded-full border-2 border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 h-12 text-sm"
                      >
                        {teacherLoading ? (
                          <span className="flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
                            Loading...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            👩‍🏫 Teacher Demo Login
                          </span>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              )}

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-xs text-gray-400">
                    {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      {mode === "signup" ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
