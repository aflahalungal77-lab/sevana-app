import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const client = await createSupabaseServerClient();
  if (!client) return <div className="page"><h1>Admin setup required</h1><p className="muted">Configure Supabase environment variables first.</p><Link href="/admin/login" className="button button-secondary">Back to login</Link></div>;
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return <div className="page"><h1>Access restricted</h1><p className="muted">Your account is signed in, but it does not have the admin role. Ask the project owner to grant access.</p><Link href="/admin/login" className="button button-secondary">Back</Link></div>;
  return <AdminDashboard email={user.email || "Admin"} />;
}
