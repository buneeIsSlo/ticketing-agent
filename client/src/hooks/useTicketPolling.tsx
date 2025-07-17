import { useEffect, useState, useRef } from "react";

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  priority?: string | null;
  relatedSkills?: string[] | null;
  notes?: string | null;
  assignedTo?: { email: string } | null;
}

export function useTicketPolling(id: string | undefined) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 6; // 6 * 2.5s = 15s

  // Always get role from localStorage
  const userStr = localStorage.getItem("user");
  let userRole = "user";
  if (userStr) {
    const user = JSON.parse(userStr);
    userRole = user.role || "user";
  }

  const isComplete = (t: Ticket) =>
    t.priority && t.relatedSkills && t.notes && t.assignedTo;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setTicket(null);
    retryCount.current = 0;

    const fetchTicket = async () => {
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
        setTicket(data.ticket);

        // Only poll if not a regular user and async fields are incomplete
        if (userRole !== "user" && !isComplete(data.ticket)) {
          if (!intervalRef.current) {
            intervalRef.current = setInterval(poll, 2500);
          }
        }
      } catch (e) {
        let msg = "Failed to fetch Ticket details";
        if (e instanceof Error) msg = e.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [id]);

  const poll = async () => {
    if (!id) return;
    retryCount.current += 1;
    if (retryCount.current > MAX_RETRIES) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setError("Ticket analysis is taking too long. Please try again later.");
      return;
    }
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
      if (!res.ok) return;

      const data = await res.json();
      setTicket((prev) => {
        if (!prev) return data.ticket;
        const updated: Ticket = { ...prev };

        // Only update async fields if not a regular user
        if (userRole !== "user") {
          updated.priority = data.ticket.priority;
          updated.relatedSkills = data.ticket.relatedSkills;
          updated.notes = data.ticket.notes;
          updated.assignedTo = data.ticket.assignedTo;
        }

        if (isComplete(updated) && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        return updated;
      });
    } catch {
      // ignore polling errors;
    }
  };

  return { ticket, loading, error, role: userRole };
}
