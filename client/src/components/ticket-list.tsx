import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import StatusBadge from "./status-badge";
import { Link } from "react-router";
import { ListTodo, Loader } from "lucide-react";

export type Ticket = {
  _id: string;
  title: string;
  description: string;
  status?: string;
  createdAt?: string;
};

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/ticket`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to fetch tickets");
        }
        const data = await res.json();
        setTickets(data);
      } catch (e) {
        let msg = "Failed to fetch tickets";
        if (e instanceof Error) msg = e.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading)
    return (
      <div className="py-4 w-full">
        <span className="flex gap-2 text-muted-foreground pb-4">
          <Loader className="size-4 animate-spin" />
          <span className="font-medium">Loading Tickets...</span>
        </span>
        <Card className="w-full p-6 flex flex-col gap-4 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </Card>
      </div>
    );
  if (error)
    return <p className="text-red-500 text-xs text-center py-8">{error}</p>;
  if (!tickets.length)
    return (
      <Card className="w-full p-8 my-4 flex flex-col items-center gap-2 text-center">
        <ListTodo className="w-10 h-10 text-muted-foreground mb-2" />
        <span className="text-lg font-semibold">No tickets found</span>
        <span className="text-xs text-muted-foreground">
          You haven&apos;t created any tickets yet.
        </span>
      </Card>
    );

  return (
    <div className="py-4 grid gap-4">
      {tickets.map((ticket) => (
        <Link to={`/ticket/${ticket._id}`} key={ticket._id}>
          <Card className="p-4 group-hover:shadow-lg transition hover:bg-card/70">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              {ticket.status && <StatusBadge status={ticket.status} />}
            </div>
            <p className="text-sm text-muted-foreground max-w-[80%]">
              {ticket.description}
            </p>
            {ticket.createdAt && (
              <span className="block text-xs text-gray-400">
                Created:{" "}
                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
