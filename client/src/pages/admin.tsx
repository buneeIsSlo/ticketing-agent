import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RoleBadge } from "@/components/role-badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/components/header";

const userSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "user", "moderator"]),
  skills: z.string().min(0),
});

const AdminPage = () => {
  const user = { role: "admin" }; // TEMP: replace with real auth
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user.role !== "admin") {
      window.location.href = "/";
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || data || []);
        setError("");
      } catch {
        setError("Could not load users");
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.skills && u.skills.join(",").toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8 grid gap-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Input
        type="text"
        placeholder="Search users..."
        className="input w-full max-w-md mb-4 border rounded px-3 py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredUsers.map((u) => (
          <Card key={u.email} className="p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <b>Email:</b> {u.email}
              </div>
              <div>
                <b>Role:</b> <RoleBadge role={u.role} />
              </div>
              <div>
                <b>Skills:</b> {u.skills?.join(", ")}
              </div>
            </div>
            <Button onClick={() => handleEdit(u)} size="sm">
              Edit
            </Button>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSuccess={async () => {
                setOpen(false);
                setEditingUser(null);
                try {
                  const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/users`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (!res.ok) throw new Error();
                  const data = await res.json();
                  setUsers(data.users || data || []);
                  setError("");
                } catch {
                  setError("Could not reload users");
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function EditUserForm({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: () => void;
}) {
  const token = localStorage.getItem("token");
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user.email,
      role: user.role,
      skills: user.skills?.join(", "),
    },
  });
  const [error, setError] = useState("");

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: values.email,
            role: values.role,
            skills: values.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }),
        }
      );
      if (!res.ok) throw new Error();
      setError("");
      onSuccess();
    } catch {
      setError("Failed to update user");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">admin</SelectItem>
                    <SelectItem value="user">user</SelectItem>
                    <SelectItem value="moderator">moderator</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills (comma separated)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}

export default AdminPage;
