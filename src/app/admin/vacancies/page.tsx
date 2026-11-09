import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminVacancyManager } from "@/components/admin-vacancy-manager";

export default async function AdminVacanciesPage() {
  const client = await createSupabaseServerClient();
  if (!client) return <div className="page"><h1>Admin setup required</h1><p className="muted">Configure Supabase environment variables first.</p><Link href="/admin/login" className="button button-secondary">Back to login</Link></div>;
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return <div className="page"><h1>Access restricted</h1><p className="muted">Your account does not have admin access.</p><Link href="/admin/login" className="button button-secondary">Back</Link></div>;
  return <AdminVacancyManager />;
}
