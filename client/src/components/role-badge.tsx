import { Badge } from "./ui/badge";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

const roleColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  admin: "destructive",
  user: "outline",
  agent: "secondary",
  support: "secondary",
  moderator: "secondary",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const variant = roleColors[role.toLowerCase()] || "default";

  return (
    <Badge variant={variant} className={className}>
      {role}
    </Badge>
  );
}
