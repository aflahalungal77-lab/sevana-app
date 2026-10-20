"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Plus, Trash2, Pencil, Save, X, GripVertical, Eye,
  Search, ChevronRight, PhoneCall, CarFront, Wrench, Hospital,
  Ambulance, Shield, Flame, Droplet, Baby, Pill, Stethoscope,
  BusFront, KeyRound, Zap, Paintbrush, HardHat, RefreshCw, Truck, Hammer, House, Flower2, Sprout, Layers
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { hotlineCategories, transportCategories, workerCategories } from "@/lib/data";

type Kind = "hotline" | "transport" | "worker";
type Row = {
  id: string; name: string; phone: string; area: string | null;
  description: string | null; address: string | null; vehicle_type: string | null;
  category_id: string; is_active: boolean; sort_order: number;
};
type Category = { id: string; name: string; slug: string };

const categoryIcons: Record<string, LucideIcon> = {
  hospital: Hospital, ambulance: Ambulance, "police-station": Shield,
  "fire-station": Flame, "blood-banks": Droplet, "child-line": Baby,
  "medical-shop": Pill, "doctors-clinic": Stethoscope, kseb: Zap, cars: CarFront,
  auto: CarFront, "tourist-bus": BusFront, "rent-a-car": KeyRound, "goods-lorry": Truck,
  "plumbing-wiring": Zap, "masonry-work": Layers, carpenter: Hammer, "tiles-marble": Layers,
  painters: Paintbrush, welders: Hammer, "home-workers": House, "garden-services": Flower2,
  "agricultural-works": Sprout, repair: Wrench, construction: HardHat, painting: Paintbrush,
};

export function AdminListingManager({
  kind,
  selectedCategory,
}: {
  kind: Kind;
  selectedCategory?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const title = kind === "hotline" ? "Hotlines" : kind === "transport" ? "Taxi & Transport" : "Local Workers";
  const staticCategories = kind === "hotline" ? hotlineCategories : kind === "transport" ? transportCategories : workerCategories;
  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const filteredRows = useMemo(() => rows.filter((r) => {
    const matchesSearch = `${r.name} ${r.phone} ${r.area || ""}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (!selectedCategory || categories.find((c) => c.id === r.category_id)?.slug === selectedCategory);
  }), [rows, search, selectedCategory, categories]);

  async function load() {
    if (!supabase) {
      setLoading(false);
      setMessage("Supabase is not configured. Add the environment variables before managing records.");
      return;
    }
    setLoading(true);
    const { data: cats, error: categoryError } = await supabase
      .from("service_categories").select("id,name,slug").eq("kind", kind).order("name");
    if (categoryError) setMessage("Could not load categories. Check the database and admin permissions.");
    const catsList = (cats || []) as Category[];
    setCategories(catsList);

    const { data, error } = await supabase
      .from("service_listings")
      .select("id,name,phone,area,description,address,vehicle_type,category_id,is_active,sort_order,service_categories!inner(kind)")
      .eq("service_categories.kind", kind)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message.includes("sort_order")
        ? "Run supabase/migrations/20261012_listing_order.sql in Supabase SQL Editor, then reload."
        : "Could not load records. Check database schema and admin permissions.");
      setRows([]);
    } else {
      setRows(((data || []) as unknown as Row[]).map((r, i) => ({ ...r, sort_order: r.sort_order ?? i })));
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, [kind]);

  function startNew() {
    const categoryId = activeCategory?.id || categories[0]?.id || "";
    setEditing({
      id: "", name: "", phone: "", area: "", description: "", address: "",
      vehicle_type: "", category_id: categoryId, is_active: true,
      sort_order: rows.length,
    });
    setMessage("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !editing) return;
    if (!editing.category_id) { setMessage("Please choose a category first."); return; }
    const payload = {
      name: editing.name.trim(), phone: editing.phone.trim(),
      area: editing.area?.trim() || null,
      description: editing.description?.trim() || null,
      address: editing.address?.trim() || null,
      vehicle_type: editing.vehicle_type?.trim() || null,
      category_id: editing.category_id, is_active: editing.is_active,
      sort_order: editing.sort_order ?? rows.length,
    };
    const result = editing.id
      ? await supabase.from("service_listings").update(payload).eq("id", editing.id)
      : await supabase.from("service_listings").insert(payload);
    if (result.error) { setMessage(`Could not save: ${result.error.message}`); return; }
    setEditing(null);
    setMessage("Listing saved successfully.");
    await load();
  }

  async function remove(id: string) {
    if (!supabase || !window.confirm("Delete this listing? This cannot be undone.")) return;
    const { error } = await supabase.from("service_listings").delete().eq("id", id);
    if (error) setMessage("Could not delete this listing. Check admin permissions.");
    else { setMessage("Listing deleted."); await load(); }
  }

  async function reorder(targetId: string) {
    const client = supabase;
    if (!draggedId || draggedId === targetId || !client) return;
    const list = [...filteredRows];
    const from = list.findIndex((r) => r.id === draggedId);
    const to = list.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    const normalized = list.map((r, i) => ({ ...r, sort_order: i + 1 }));
    const otherRows = rows.filter((r) => !normalized.some((n) => n.id === r.id));
    setRows([...otherRows, ...normalized].sort((a, b) => {
      if (a.category_id !== b.category_id) return a.category_id.localeCompare(b.category_id);
      return a.sort_order - b.sort_order;
    }));
    setDraggedId(null);
    setSavingOrder(true);
    setMessage("");
    const results = await Promise.all(normalized.map((r) =>
      client.from("service_listings").update({ sort_order: r.sort_order }).eq("id", r.id)
    ));
    if (results.some((r) => r.error)) {
      setMessage("Could not save the new order. Run the listing-order SQL migration and try again.");
      await load();
    } else {
      setMessage("Display order saved. The public listing will use this order too.");
    }
    setSavingOrder(false);
  }

  const CategoryIcon = activeCategory ? categoryIcons[activeCategory.slug] || PhoneCall : PhoneCall;

  return (
    <div className="page admin-page premium-admin premium-listing-manager">
      <header className="admin-subpage-header">
        <Link href="/admin" className="admin-back-link" aria-label="Back to dashboard"><ArrowLeft size={19} /></Link>
        <div><p className="eyebrow">DIRECTORY MANAGEMENT</p><h1>{activeCategory?.name || title}</h1><p>{activeCategory ? "Manage and reorder this category" : "Choose a category to manage its listings"}</p></div>
        {selectedCategory && <button className="admin-add-button" onClick={startNew}><Plus size={17} /><span>Add</span></button>}
      </header>

      {!selectedCategory ? (
        <>
          <div className="admin-category-intro"><span className="admin-category-intro-icon">{kind === "hotline" ? <PhoneCall size={23}/> : kind === "transport" ? <CarFront size={23}/> : <Wrench size={23}/>}</span><div><h2>{title}</h2><p>Select a category to add, view, edit or reorder its records.</p></div></div>
          <div className="admin-category-grid">
            {staticCategories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || PhoneCall;
              const category = categories.find((c) => c.slug === cat.slug);
              const count = category ? rows.filter((r) => r.category_id === category.id).length : 0;
              return (
                <Link key={cat.slug} href={`/admin/listings?kind=${kind}&category=${cat.slug}`} className="admin-category-card">
                  <span className={`admin-category-icon icon-${cat.slug}`}><Icon size={22}/></span>
                  <span className="admin-category-card-copy"><strong>{cat.name}</strong><small>{count} {count === 1 ? "listing" : "listings"}</small></span>
                  <ChevronRight size={18} className="admin-category-chevron"/>
                </Link>
              );
            })}
          </div>
          <p className="admin-tip"><GripVertical size={16}/> Open a category to manage its records and change their display order.</p>
        </>
      ) : (
        <>
          <div className="admin-category-toolbar">
            <Link href={`/admin/listings?kind=${kind}`} className="admin-back-category"><ArrowLeft size={15}/> All categories</Link>
            <div className="admin-category-toolbar-actions">
              <span className="admin-record-count"><Eye size={15}/>{filteredRows.length} records</span>
              <button className="admin-refresh" onClick={load} disabled={loading} aria-label="Refresh records"><RefreshCw size={16}/></button>
            </div>
          </div>

          <div className="admin-category-summary">
            <span className="admin-category-icon"><CategoryIcon size={22}/></span>
            <div><strong>{activeCategory?.name || selectedCategory}</strong><small>Changes here also update the public Sevana listing.</small></div>
          </div>

          <label className="admin-search"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${activeCategory?.name || "listings"}...`} /><kbd>⌕</kbd></label>

          {editing && (
            <form className="form-card admin-edit-form premium-admin-form" onSubmit={save}>
              <div className="section-heading"><div><p className="eyebrow">{editing.id ? "UPDATE DIRECTORY" : "NEW DIRECTORY ENTRY"}</p><h2>{editing.id ? "Edit listing" : "Add listing"}</h2></div><button type="button" className="icon-button" onClick={() => setEditing(null)} aria-label="Close form"><X size={18}/></button></div>
              <div className="field"><label className="field-label" htmlFor="category">Category</label><select className="field-control" id="category" required value={editing.category_id} onChange={(e) => setEditing({...editing, category_id:e.target.value})}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="field"><label className="field-label" htmlFor="name">Name / business / contact</label><input id="name" className="field-control" required maxLength={120} value={editing.name} onChange={(e) => setEditing({...editing,name:e.target.value})} placeholder="Enter name"/></div>
              <div className="field"><label className="field-label" htmlFor="phone">Phone number</label><input id="phone" className="field-control" type="tel" required maxLength={24} value={editing.phone} onChange={(e) => setEditing({...editing,phone:e.target.value})} placeholder="+91..."/></div>
              {kind === "transport" && <div className="field"><label className="field-label" htmlFor="vehicle">Vehicle type (optional)</label><input id="vehicle" className="field-control" maxLength={80} value={editing.vehicle_type || ""} onChange={(e) => setEditing({...editing,vehicle_type:e.target.value})} placeholder="Sedan, Auto, 20-seater bus"/></div>}
              <div className="field"><label className="field-label" htmlFor="area">Area</label><input id="area" className="field-control" maxLength={120} value={editing.area || ""} onChange={(e) => setEditing({...editing,area:e.target.value})} placeholder="Meenarkuzhi"/></div>
              <div className="field"><label className="field-label" htmlFor="address">Address / landmark</label><input id="address" className="field-control" maxLength={180} value={editing.address || ""} onChange={(e) => setEditing({...editing,address:e.target.value})} placeholder="Optional address"/></div>
              <div className="field"><label className="field-label" htmlFor="description">Description (optional)</label><textarea id="description" className="field-control" rows={2} maxLength={300} value={editing.description || ""} onChange={(e) => setEditing({...editing,description:e.target.value})} placeholder="Short service details"/></div>
              <label className="check-row"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({...editing,is_active:e.target.checked})}/> Visible to users</label>
              <button className="button button-primary button-full" type="submit"><Save size={17}/>Save listing</button>
            </form>
          )}

          {message && <p className="status-message admin-status">{message}</p>}
          {loading ? <div className="admin-loading"><span className="admin-loading-spinner"/>Loading listings…</div> :
            filteredRows.length ? (
              <div className="admin-sort-note"><GripVertical size={16}/><span>Drag records using the handle to change the order shown to users.</span>{savingOrder && <small>Saving…</small>}</div>
            ) : null}

          {!loading && filteredRows.length > 0 && (
            <div className="admin-records premium-admin-records">
              {filteredRows.map((row, index) => {
                const Icon = categoryIcons[activeCategory?.slug || ""] || (kind === "transport" ? CarFront : kind === "worker" ? Wrench : PhoneCall);
                return (
                  <article
                    className={`admin-record premium-admin-record ${draggedId === row.id ? "is-dragging" : ""}`}
                    key={row.id}
                    draggable={!search}
                    onDragStart={(e) => { setDraggedId(row.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", row.id); }}
                    onDragOver={(e) => { if (!search) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } }}
                    onDrop={(e) => { if (!search) { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id) { setDraggedId(id); void reorder(row.id); } } }}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <span className="admin-drag-handle" aria-label={`Position ${index + 1}`} title="Drag to reorder"><GripVertical size={20}/></span>
                    <span className="admin-record-icon"><Icon size={20}/></span>
                    <div className="admin-record-main"><strong>{row.name}</strong><p>{row.phone} · {row.area || "Area not set"}</p><small><span className={row.is_active ? "admin-status-dot active" : "admin-status-dot"} />{row.is_active ? "Visible to users" : "Hidden from users"} · Position {index + 1}</small></div>
                    <div className="record-actions"><button className="icon-button" onClick={() => setEditing(row)} aria-label={`Edit ${row.name}`} title="Edit"><Pencil size={16}/></button><button className="icon-button danger-icon" onClick={() => remove(row.id)} aria-label={`Delete ${row.name}`} title="Delete"><Trash2 size={16}/></button></div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && filteredRows.length === 0 && (
            <div className="empty-state admin-empty"><span className="admin-empty-icon"><Plus size={24}/></span><h2>No listings yet</h2><p>Add the first {activeCategory?.name || "service"} listing to make it available in Sevana.</p><button className="button button-primary" onClick={startNew}><Plus size={17}/>Add listing</button></div>
          )}
        </>
      )}
      {message && !selectedCategory && <p className="status-message admin-status">{message}</p>}
    </div>
  );
}
