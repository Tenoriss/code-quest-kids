import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Route is student-only — teachers will be redirected to /teacher */
  studentOnly?: boolean;
  /** Route is teacher-only — students will be redirected to /dashboard */
  teacherOnly?: boolean;
}

/**
 * Route guard that enforces role-based access.
 * - `studentOnly`: Teachers are redirected to `/teacher`.
 * - `teacherOnly`: Non-teachers are redirected to `/dashboard`.
 */
export function ProtectedRoute({ children, studentOnly, teacherOnly }: ProtectedRouteProps) {
  const { isAuthenticated, currentUserProfile } = useAuth();

  // Not authenticated? Let the route render anyway (auth pages handle this)
  if (!isAuthenticated || !currentUserProfile) {
    return <>{children}</>;
  }

  const isTeacher = currentUserProfile.role === "teacher";

  // Student-only page + teacher user → redirect to /teacher
  if (studentOnly && isTeacher) {
    return <Navigate to="/teacher" replace />;
  }

  // Teacher-only page + non-teacher → redirect to /dashboard
  if (teacherOnly && !isTeacher) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
