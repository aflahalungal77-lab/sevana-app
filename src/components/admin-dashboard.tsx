"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PhoneCall, CarFront, Wrench, Droplet, Plus, LogOut, RefreshCw,
  LayoutGrid, ArrowUpRight, ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Counts = { listings: number; donors: number };

const modules = [
  { title: "Hotlines", kind: "hotline", href: "/admin/listings?kind=hotline", Icon: PhoneCall, description: "Hospitals, doctors and emergency contacts", tone: "rose" },
  { title: "Taxi & Transport", kind: "transport", href: "/admin/listings?kind=transport", Icon: CarFront, description: "Cars, autos, buses and rentals", tone: "amber" },
  { title: "Local Workers", kind: "worker", href: "/admin/listings?kind=worker", Icon: Wrench, description: "Plumbing, wiring, repairs and more", tone: "blue" },
  { title: "Blood Donors", kind: "donor", href: "/admin/donors", Icon: Droplet, description: "Manage consenting donor listings", tone: "red" },
];

export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts>({ listings: 0, donors: 0 });
  const [busy, setBusy] = useState(false);

  async function refreshCounts() {
    if (!supabase) return;
    setBusy(true);
    const [l, d] = await Promise.all([
      supabase.from("service_listings").select("id", { count: "exact", head: true }),
      supabase.from("donors").select("id", { count: "exact", head: true }),
    ]);
    setCounts({ listings: l.count || 0, donors: d.count || 0 });
    setBusy(false);
  }

  useEffect(() => { void refreshCounts(); }, []);

  async function logout() {
    await supabase?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="page admin-page premium-admin">
      <header className="admin-topbar">
        <Link href="/" className="admin-brand" aria-label="Back to Sevana">
          <span className="admin-brand-mark"><ShieldCheck size={22} /></span>
          <span><strong>sevana<span>.</span></strong><small>ADMIN WORKSPACE</small></span>
        </Link>
        <button className="icon-button" onClick={logout} aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
      </header>

      <section className="admin-hero">
        <div className="admin-hero-orb"><LayoutGrid size={28} /></div>
        <p className="eyebrow">CONTROL CENTRE</p>
        <h1>Good to see you.</h1>
        <p>Manage your community services from one place.</p>
        <div className="admin-user-pill"><span className="admin-online-dot" />{email}</div>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-icon green"><LayoutGrid size={18} /></span>
          <span className="admin-stat-label">Service listings</span>
          <strong>{counts.listings}</strong>
          <small>Across all categories</small>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon red"><Droplet size={18} /></span>
          <span className="admin-stat-label">Blood donors</span>
          <strong>{counts.donors}</strong>
          <small>Directory entries</small>
        </article>
      </section>

      <div className="admin-section-title">
        <div><p className="eyebrow">MANAGE YOUR DIRECTORY</p><h2>Services & categories</h2></div>
        <button className="admin-refresh" onClick={refreshCounts} disabled={busy} aria-label="Refresh dashboard"><RefreshCw size={17} className={busy ? "spin" : ""} /></button>
      </div>

      <section className="admin-module-grid">
        {modules.map(({ title, href, Icon, description, tone }) => (
          <Link key={title} href={href} className={`admin-module-card tone-${tone}`}>
            <span className="admin-module-icon"><Icon size={22} /></span>
            <span className="admin-module-copy"><strong>{title}</strong><small>{description}</small></span>
            <span className="admin-module-arrow"><ArrowUpRight size={18} /></span>
          </Link>
        ))}
      </section>

      <div className="admin-footnote"><ShieldCheck size={16} /><span>Changes are managed securely through your Supabase admin account.</span></div>
    </div>
  );
}
