import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import TicketList from "../components/ticket-list";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type TicketForm = z.infer<typeof schema>;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<TicketForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: TicketForm) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create ticket");
      }

      setSuccess("Ticket created successfully!");
    } catch (e) {
      let msg = "Failed to create ticket";
      if (e instanceof Error) msg = e.message;
      setError(msg);
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <section className="mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-semibold mb-4">Create Ticket</h1>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}
            {success && <p className="text-green-500 text-xs">{success}</p>}

            <Button type="submit" disabled={loading} className="float-end">
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </form>
        </Form>
      </Card>
      <h2 className="text-4xl font-semibold mt-8">All Tickets</h2>
      <TicketList />
    </section>
  );
}
