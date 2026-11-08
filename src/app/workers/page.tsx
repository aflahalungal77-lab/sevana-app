"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench, ChevronRight, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Parent = { id: string; name: string; slug: string; icon_path: string };
type Child = { id: string; name: string; slug: string; icon_path: string | null; parent_group_id: string | null };

function normalizeIconPath(path: string | null | undefined, fallback = "/emojis/others.png") {
  if (!path?.trim()) return fallback;
  const value = path.trim();
  if (/^(https?:\/\/|data:)/i.test(value)) return value;
  const clean = value.replace(/^public\//, "").replace(/^\/+/, "");
  return "/" + clean;
}

function getWorkerIconPath(slug: string, name: string, iconPath: string | null) {
  const key = (slug + " " + name).toLowerCase().replace(/[_-]+/g, " ");
  if (key.includes("laterite") || key.includes("stone quarry")) return "/emojis/stone.png";
  if (key.includes("plaster")) return "/emojis/masonry-work.png";
  return normalizeIconPath(iconPath || ("/emojis/" + slug + ".png"));
}

export default function WorkersPage() {
  const [groups, setGroups] = useState<Parent[]>([]);
  const [categories, setCategories] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const [p, c] = await Promise.all([
        supabase.from("worker_category_groups").select("id,name,slug,icon_path").order("sort_order").order("name"),
        supabase.from("service_categories").select("id,name,slug,icon_path,parent_group_id").eq("kind", "worker").order("sort_order").order("name"),
      ]);
      if (active) {
        setGroups((p.data || []) as Parent[]);
        setCategories((c.data || []) as Child[]);
        setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  return (
    <main className="page workers-page">
      <header className="back-header">
        <Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link>
        <div><h1>Local Workers</h1><p>Find skilled help around you</p></div>
      </header>
      <div className="intro-panel">
        <div className="intro-icon"><Wrench size={22}/></div>
        <div><h2>What do you need help with?</h2><p>Select a service to view worker contacts.</p></div>
      </div>
      {loading ? <div className="admin-loading"><span className="admin-loading-spinner"/>Loading categories…</div> : groups.length ? (
        <div className="worker-category-groups">
          {groups.map(group => {
            const items = categories.filter(category => category.parent_group_id === group.id);
            return (
              <section className="worker-parent-card" key={group.id}>
                <div className="worker-parent-heading">
                  <span className="worker-parent-icon"><img src={normalizeIconPath(group.icon_path)} alt="" width={32} height={32} className="worker-emoji" loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/emojis/others.png"; }}/></span>
                  <div className="worker-parent-copy"><h2>{group.name}</h2><p>Local services and skilled professionals</p><small>{items.length} service categories</small></div>
                </div>
                <div className="worker-child-grid">
                  {items.map(category => {
                    const isLoading = loadingSlug === category.slug;
                    return (
                      <Link key={category.id} href={"/workers/" + category.slug} onClick={()=>setLoadingSlug(category.slug)} aria-busy={isLoading} className={"worker-child-card " + (isLoading ? "category-row-loading" : "")}>
                        <span className={"category-icon icon-" + category.slug}><img src={getWorkerIconPath(category.slug, category.name, category.icon_path)} alt="" width={36} height={36} className="worker-emoji" loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/emojis/others.png"; }}/></span>
                        <span className="worker-child-text"><strong>{category.name}</strong><small>View available workers</small></span>
                        {isLoading ? <LoaderCircle size={20} className="hotline-loading-spinner" aria-label="Loading"/> : <ChevronRight size={18} className="row-chevron"/>}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : <div className="empty-state"><h2>No worker categories available</h2><p>Categories added by the admin will appear here.</p></div>}
    </main>
  );
}
