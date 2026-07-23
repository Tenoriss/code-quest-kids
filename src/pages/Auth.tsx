import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router";
import { Sparkles, Mail, Lock, User, Calendar, MapPin, GraduationCap, Eye, EyeOff, ArrowRight, Code, Smartphone, Star, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Byte } from "@/components/layout/Byte";

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, signUp, login } = useAuth();
  const { resetGame } = useGame();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [byteMood, setByteMood] = useState<"wave" | "happy" | "think">("wave");

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
    setLoading(true);
    setError("");

    // Validation
    if (!form.fullName || !form.nickname || !form.email || !form.password || !form.birthday || !form.grade) {
      setError("Please fill in all required fields!");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

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
      resetGame(); // Fresh dashboard
      setSuccess("Account created! Welcome!");
      setByteMood("happy");
      setTimeout(() => navigate("/dashboard"), 500);
    } else {
      setError(result.error || "Something went wrong!");
      setByteMood("think");
    }
    setLoading(false);
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
                  <Byte mood={byteMood} />
                </div>

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
                    </motion.form>
                  )}
                </AnimatePresence>

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
