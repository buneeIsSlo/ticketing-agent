import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Skeleton } from "./ui/skeleton";
import type { User } from "./header";

interface ProtectedProps {
  children: ReactNode;
  protectedRoute: string;
  requiredRole?: string;
}

export default function Protected({
  children,
  protectedRoute,
  requiredRole,
}: ProtectedProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user: User | undefined = undefined;
    try {
      user = userStr ? JSON.parse(userStr) : undefined;
    } catch {
      /* ignore */
    }

    if (protectedRoute) {
      if (!token || !user) {
        navigate("/login");
        return;
      }
      if (requiredRole && user?.role !== requiredRole) {
        navigate("/");
        return;
      }
    } else {
      if (token && user) {
        navigate("/");
        return;
      }
    }
    setLoading(false);
  }, [navigate, protectedRoute, requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
