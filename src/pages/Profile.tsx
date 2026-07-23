import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router";
import { User, Camera, Save, RotateCcw, X, Star, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Byte } from "@/components/layout/Byte";
import { cn } from "@/lib/utils";

const AVATAR_FRAMES = [
  { id: "default", name: "Classic", icon: "⭐", color: "from-blue-400 to-purple-500", locked: false },
  { id: "star", name: "Star", icon: "🌟", color: "from-yellow-400 to-amber-500", locked: false },
  { id: "rocket", name: "Rocket", icon: "🚀", color: "from-red-400 to-orange-500", locked: false },
  { id: "robot", name: "Robot", icon: "🤖", color: "from-cyan-400 to-blue-500", locked: false },
  { id: "coding", name: "Coding", icon: "💻", color: "from-green-400 to-teal-500", locked: true },
  { id: "champion", name: "Champion", icon: "🏆", color: "from-yellow-400 to-orange-500", locked: true },
  { id: "rainbow", name: "Rainbow", icon: "🌈", color: "from-pink-400 to-purple-500", locked: true },
  { id: "space", name: "Space", icon: "🪐", color: "from-indigo-400 to-purple-500", locked: true },
];

const FAVORITE_CHARACTERS = [
  { name: "Byte", emoji: "🤖" },
  { name: "Pikachu", emoji: "⚡" },
  { name: "Mario", emoji: "🍄" },
  { name: "Elsa", emoji: "❄️" },
  { name: "Spider-Man", emoji: "🕷️" },
  { name: "Hello Kitty", emoji: "🎀" },
  { name: "Doraemon", emoji: "🐱" },
  { name: "Sonic", emoji: "🦔" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUserProfile, updateProfile } = useAuth();
  const { state } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: currentUserProfile?.fullName || "",
    nickname: currentUserProfile?.nickname || "",
    birthday: currentUserProfile?.birthday || "",
    grade: currentUserProfile?.grade || "",
    country: currentUserProfile?.country || "",
    favoriteColor: currentUserProfile?.favoriteColor || "#6366f1",
    favoriteCharacter: currentUserProfile?.favoriteCharacter || "Byte",
    bio: currentUserProfile?.bio || "",
  });

  const [avatarUrl, setAvatarUrl] = useState(currentUserProfile?.avatarUrl || "");
  const [avatarFrame, setAvatarFrame] = useState(currentUserProfile?.avatarFrame || "default");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
      updateProfile({ avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarUrl("");
    updateProfile({ avatarUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    updateProfile({
      fullName: form.fullName,
      nickname: form.nickname,
      birthday: form.birthday,
      grade: form.grade,
      country: form.country,
      favoriteColor: form.favoriteColor,
      favoriteCharacter: form.favoriteCharacter,
      bio: form.bio,
      avatarFrame,
    });
    setShowSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    setForm({
      fullName: currentUserProfile?.fullName || "",
      nickname: currentUserProfile?.nickname || "",
      birthday: currentUserProfile?.birthday || "",
      grade: currentUserProfile?.grade || "",
      country: currentUserProfile?.country || "",
      favoriteColor: currentUserProfile?.favoriteColor || "#6366f1",
      favoriteCharacter: currentUserProfile?.favoriteCharacter || "Byte",
      bio: currentUserProfile?.bio || "",
    });
    setAvatarUrl(currentUserProfile?.avatarUrl || "");
    setAvatarFrame(currentUserProfile?.avatarFrame || "default");
  };

  const frameColors: Record<string, string> = {
    default: "ring-blue-400",
    star: "ring-yellow-400",
    rocket: "ring-red-400",
    robot: "ring-cyan-400",
    coding: "ring-green-400",
    champion: "ring-yellow-500",
    rainbow: "ring-pink-400",
    space: "ring-indigo-400",
  };

  const unlockedFrames = AVATAR_FRAMES.filter((f) => !f.locked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/20 to-purple-50/20 dark:from-gray-950 dark:via-pink-950/5 dark:to-purple-950/5">
      <Navbar />
      <Byte mood="wave"  message="Hey there! Let's make your profile awesome!" />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Avatar & Stats */}
            <div className="space-y-6">
              {/* Avatar Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30 text-center"
              >
                <div className="relative inline-block mb-4">
                  {/* Avatar */}
                  <div className={cn(
                    "w-28 h-28 rounded-full overflow-hidden ring-4 transition-all",
                    frameColors[avatarFrame] || "ring-blue-400"
                  )}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-4xl text-white font-bold">
                          {form.nickname?.[0]?.toUpperCase() || form.fullName?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Camera button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  {/* Remove avatar */}
                  {avatarUrl && (
                    <button
                      onClick={removeAvatar}
                      className="absolute top-0 -right-2 w-6 h-6 rounded-full bg-red-400 text-white flex items-center justify-center shadow hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{form.nickname || form.fullName || "Student"}</h2>
                <p className="text-xs text-gray-500">{form.grade ? `Grade ${form.grade}` : "Learner"}</p>

                <div className="flex justify-center gap-3 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-yellow-500">{state.xp}</p>
                    <p className="text-[10px] text-gray-400">XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-500">{state.level}</p>
                    <p className="text-[10px] text-gray-400">Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-400">
                      {state.achievements.length}
                    </p>
                    <p className="text-[10px] text-gray-400">Badges</p>
                  </div>
                </div>
              </motion.div>

              {/* Frames Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" /> Avatar Frames
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_FRAMES.map((frame) => {
                    const isUnlocked = unlockedFrames.includes(frame);
                    const isSelected = avatarFrame === frame.id;
                    return (
                      <button
                        key={frame.id}
                        onClick={() => isUnlocked && setAvatarFrame(frame.id)}
                        disabled={!isUnlocked}
                        className={cn(
                          "p-2 rounded-xl text-center transition-all",
                          isSelected
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md scale-105"
                            : isUnlocked
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <span className="text-xl block">{isUnlocked ? frame.icon : "🔒"}</span>
                        <span className="text-[8px] font-medium block mt-0.5">{frame.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right - Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              {showSaveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm p-3 rounded-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Profile saved successfully!
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">Personal Info</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="rounded-full text-xs"
                  >
                    {isEditing ? <X className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nickname</label>
                    <input
                      value={form.nickname}
                      onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-60 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Birthday + Grade */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Birthday</label>
                      <input
                        type="date"
                        value={form.birthday}
                        onChange={(e) => setForm((f) => ({ ...f, birthday: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-60 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Grade</label>
                      <select
                        value={form.grade}
                        onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-60 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select</option>
                        {Array.from({ length: 8 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1)}>Grade {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Country</label>
                    <input
                      value={form.country}
                      onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Where are you from?"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-60 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Short Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm disabled:opacity-60 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30"
              >
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 mb-4">Preferences</h3>

                {/* Favorite Color */}
                <div className="mb-4">
                  <label className="text-xs text-gray-500 mb-1 block">Favorite Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.favoriteColor}
                      onChange={(e) => setForm((f) => ({ ...f, favoriteColor: e.target.value }))}
                      disabled={!isEditing}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer disabled:opacity-60"
                    />
                    <span className="text-sm text-gray-500">{form.favoriteColor}</span>
                  </div>
                </div>

                {/* Favorite Character */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Favorite Character</label>
                  <div className="grid grid-cols-4 gap-2">
                    {FAVORITE_CHARACTERS.map((char) => (
                      <button
                        key={char.name}
                        onClick={() => isEditing && setForm((f) => ({ ...f, favoriteCharacter: char.name }))}
                        disabled={!isEditing}
                        className={`p-2 rounded-xl text-center transition-all ${
                          form.favoriteCharacter === char.name
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md scale-105"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 opacity-70 hover:opacity-100"
                        } disabled:cursor-not-allowed`}
                      >
                        <span className="text-xl block">{char.emoji}</span>
                        <span className="text-[8px] block mt-0.5">{char.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Button
                    onClick={handleSave}
                    className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white h-12 shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Profile
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="rounded-full h-12"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
