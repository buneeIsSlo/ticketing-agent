import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Skeleton } from "./ui/skeleton";

interface ProtectedProps {
  children: ReactNode;
  protectedRoute: string;
}

export default function Protected({
  children,
  protectedRoute,
}: ProtectedProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (protectedRoute) {
      if (!token || !user) {
        navigate("/login");
        return;
      }
    } else {
      if (token && user) {
        navigate("/");
        return;
      }
    }
    setLoading(false);
  }, [navigate, protectedRoute]);

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
