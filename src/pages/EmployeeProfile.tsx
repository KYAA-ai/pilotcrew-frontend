import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeProfile() {
  const navigate = useNavigate();
  useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    roles: "",
    bio: "",
  });

  const isValid =
    form.name.trim() && form.phone.trim() && form.roles.trim();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: submit data
    navigate("/employee/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Complete your profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                type="tel"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roles">Interested Roles (comma separated)</Label>
              <Input
                id="roles"
                name="roles"
                required
                value={form.roles}
                onChange={handleChange}
                placeholder="Frontend Developer, UI Designer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Short Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 shadow-xs focus-visible:ring-[3px]"
              />
            </div>
            <Button type="submit" disabled={!isValid} className="w-full">
              Save & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 