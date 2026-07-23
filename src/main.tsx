import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
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

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-2xl text-white font-bold">CQ</span>
        </div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

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
                  <Suspense fallback={<RouteLoading />}>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/objectives" element={<Objectives />} />
                      <Route path="/sequence" element={<SequenceLesson />} />
                      <Route path="/sequence-game" element={<SequenceGame />} />
                      <Route path="/algorithm" element={<AlgorithmLesson />} />
                      <Route path="/algorithm-game" element={<AlgorithmGame />} />
                      <Route path="/why-important" element={<WhyImportant />} />
                      <Route path="/daily-life" element={<DailyLife />} />
                      <Route path="/practice" element={<Practice />} />
                      <Route path="/quiz" element={<Quiz />} />
                      <Route path="/certificate" element={<Certificate />} />
                      <Route path="/dashboard" element={<StudentDashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/teacher" element={<TeacherDashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
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
