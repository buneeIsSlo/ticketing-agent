import { Badge } from "./ui/badge";
import {
  CircleCheckBig,
  HelpCircle,
  CircleDashed,
  CircleDotDashed,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap = {
  todo: (className?: string) => (
    <Badge
      className={`bg-blue-800/40 text-blue-300 border border-blue-300 ${className || ""}`}
    >
      <CircleDashed className="align-middle" size={14} />
      To-Do
    </Badge>
  ),
  in_progress: (className?: string) => (
    <Badge
      className={`bg-yellow-600/40 text-yellow-300 border border-yellow-300 ${className || ""}`}
    >
      <CircleDotDashed className="align-middle" size={14} />
      In Progress
    </Badge>
  ),
  completed: (className?: string) => (
    <Badge
      className={`bg-green-700/70 text-green-300 border border-green-300 ${className || ""}`}
    >
      <CircleCheckBig className="align-middle" size={14} />
      Completed
    </Badge>
  ),
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status?.toLowerCase();
  const Comp = statusMap[key as keyof typeof statusMap];
  if (Comp) return Comp(className);
  return (
    <Badge className={className} variant="outline">
      <HelpCircle className="align-middle" size={14} />
      {status || "Unknown"}
    </Badge>
  );
}
