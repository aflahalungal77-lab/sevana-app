"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { supabase, supabaseConfigured } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseConfigured || !supabase) {
      setMessage("Supabase is not configured yet. Copy .env.example to .env.local and add your project keys.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage("Login failed. Check your email and password, or ask the project owner to configure your account.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return <form className="form-card" onSubmit={submit}>
    <div className="field"><label className="field-label" htmlFor="email">Email address</label><input id="email" className="field-control" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com"/></div>
    <div className="field"><label className="field-label" htmlFor="password">Password</label><input id="password" className="field-control" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"/></div>
    <button className="button button-primary button-full" type="submit" disabled={busy}><LogIn size={18}/>{busy ? "Signing in..." : "Sign in"}</button>
    {message && <p className="status-message" role="status">{message}</p>}
  </form>;
}
