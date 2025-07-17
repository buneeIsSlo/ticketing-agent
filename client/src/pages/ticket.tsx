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
import { useTicketPolling } from "@/hooks/useTicketPolling";
import ReactMarkdown from "react-markdown";

export default function TicketDetails() {
  const { id } = useParams();
  const { ticket, loading, error, role } = useTicketPolling(id);

  if (loading) return <div>Loading...</div>;
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
            {role !== "user" && (
              <>
                <p>
                  <b>Priority:</b>{" "}
                  {ticket.priority ?? (
                    <span className="italic text-muted-foreground">
                      Analyzing…
                    </span>
                  )}
                </p>
                <p>
                  <b>Related skills:</b>{" "}
                  {ticket.relatedSkills && ticket.relatedSkills.length ? (
                    ticket.relatedSkills.join(", ")
                  ) : (
                    <span className="italic text-muted-foreground">
                      Analyzing…
                    </span>
                  )}
                </p>
                <p>
                  <b>Helpful notes:</b>{" "}
                  {ticket.notes ? (
                    <ReactMarkdown>{ticket.notes}</ReactMarkdown>
                  ) : (
                    <span className="italic text-muted-foreground">
                      Analyzing…
                    </span>
                  )}
                </p>
                <p>
                  <b>Assigned to:</b>{" "}
                  {ticket.assignedTo?.email ?? (
                    <span className="italic text-muted-foreground">
                      Assigning…
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {error && (
        <div className="mt-4 text-destructive font-semibold text-center">
          {error}
        </div>
      )}
    </section>
  );
}
