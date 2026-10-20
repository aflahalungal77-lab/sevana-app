import { AdminLoginForm } from "@/components/admin-login-form";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return <div className="page admin-page">
    <header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>Admin login</h1><p>Secure service management</p></div></header>
    <div className="admin-login-intro"><div className="admin-shield"><ShieldCheck size={28}/></div><h2>Welcome back</h2><p>Sign in with an authorised Supabase account to manage listings.</p></div>
    <AdminLoginForm />
  </div>;
}
