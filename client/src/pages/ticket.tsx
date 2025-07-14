import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import StatusBadge from "@/components/status-badge";

interface Ticket {
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/ticket/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setTicket(data.ticket || data);
      } catch (e) {
        let msg = "Failed to fetch Ticket details";
        if (e instanceof Error) msg = e.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ticket) return <div>No ticket found.</div>;

  return (
    <section className="mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-4xl font-semibold mb-4">Ticket Details</h2>
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="user-query">
            <AccordionItem value="user-query">
              <AccordionTrigger className="cursor-pointer text-xl font-semibold">
                User query
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{ticket.description}</p>
              </AccordionContent>
            </AccordionItem>
            <span className="w-full border-b-[1px] border-primary"></span>
          </Accordion>
          <div className="mt-4 space-y-4">
            <p className="text-gray-400">
              <b>Created:</b>{" "}
              {new Date(ticket.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <p>
              <b>Status:</b> <StatusBadge status={ticket.status} />
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
