import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router";
import "./index.css";

// Providers
import { GameProvider } from "@/contexts/GameContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SoundProvider } from "@/contexts/SoundContext";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Objectives = lazy(() => import("./pages/Objectives.tsx"));
const SequenceLesson = lazy(() => import("./pages/SequenceLesson.tsx"));
const SequenceGame = lazy(() => import("./pages/SequenceGame.tsx"));
const AlgorithmLesson = lazy(() => import("./pages/AlgorithmLesson.tsx"));
const AlgorithmGame = lazy(() => import("./pages/AlgorithmGame.tsx"));
const WhyImportant = lazy(() => import("./pages/WhyImportant.tsx"));
const DailyLife = lazy(() => import("./pages/DailyLife.tsx"));
const Practice = lazy(() => import("./pages/Practice.tsx"));
const Quiz = lazy(() => import("./pages/Quiz.tsx"));
const Certificate = lazy(() => import("./pages/Certificate.tsx"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard.tsx"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));

// Fun page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Auth route guard
import { useAuth } from "@/contexts/AuthContext";
function ProtectedRoute({ children, studentOnly }: { children: React.ReactNode; studentOnly?: boolean }) {
  const { isAuthenticated, currentUserProfile } = useAuth();
  if (!isAuthenticated || !currentUserProfile) return <>{children}</>;
  if (studentOnly && currentUserProfile.role === "teacher") return <Navigate to="/teacher" replace />;
  return <>{children}</>;
}

// Fun animated loading screen with Byte robot
import LoadingScreen from "@/components/layout/LoadingScreen";

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

/**
 * Wraps routes with AnimatePresence keyed by location so exit animations fire.
 * (AnimatePresence needs a changing key on its direct child to detect leaves.)
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
        <Route path="/objectives" element={<ProtectedRoute studentOnly><PageTransition><Objectives /></PageTransition></ProtectedRoute>} />
        <Route path="/sequence" element={<ProtectedRoute studentOnly><PageTransition><SequenceLesson /></PageTransition></ProtectedRoute>} />
        <Route path="/sequence-game" element={<ProtectedRoute studentOnly><PageTransition><SequenceGame /></PageTransition></ProtectedRoute>} />
        <Route path="/algorithm" element={<ProtectedRoute studentOnly><PageTransition><AlgorithmLesson /></PageTransition></ProtectedRoute>} />
        <Route path="/algorithm-game" element={<ProtectedRoute studentOnly><PageTransition><AlgorithmGame /></PageTransition></ProtectedRoute>} />
        <Route path="/why-important" element={<ProtectedRoute studentOnly><PageTransition><WhyImportant /></PageTransition></ProtectedRoute>} />
        <Route path="/daily-life" element={<ProtectedRoute studentOnly><PageTransition><DailyLife /></PageTransition></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute studentOnly><PageTransition><Practice /></PageTransition></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute studentOnly><PageTransition><Quiz /></PageTransition></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute studentOnly><PageTransition><Certificate /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute studentOnly><PageTransition><StudentDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute studentOnly><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/teacher" element={<PageTransition><TeacherDashboard /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <SoundProvider>
              <GameProvider>
                <BrowserRouter>
                  <RouteSyncer />
                  <Suspense fallback={<LoadingScreen />}>
                    <AnimatedRoutes />
                  </Suspense>
                </BrowserRouter>
                <Toaster />
              </GameProvider>
            </SoundProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
