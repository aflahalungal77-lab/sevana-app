"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Plus, Pencil, Trash2, Eye, EyeOff, CheckCircle2, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Status = "draft" | "published" | "filled";
type Vacancy = {
  id: string; title: string; company_name: string; description: string;
  job_type: string; location: string; contact_phone: string | null;
  status: Status; created_at: string;
};
type FormState = {
  title: string; company_name: string; location: string;
  job_type: string; description: string; contact_phone: string;
};
const emptyForm: FormState = {
  title: "", company_name: "", location: "", job_type: "Full-time",
  description: "", contact_phone: "",
};

export function AdminVacancyManager() {
  const [items, setItems] = useState<Vacancy[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!supabase) { setError("Supabase is not configured."); setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await supabase.from("vacancies")
      .select("id,title,company_name,description,job_type,location,contact_phone,status,created_at")
      .order("created_at", { ascending: false });
    if (queryError) setError(queryError.message);
    else { setItems((data || []) as Vacancy[]); setError(""); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  function change<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function resetForm() {
    setEditingId(null); setForm(emptyForm); setError(""); setMessage("");
  }
  function startEdit(item: Vacancy) {
    setEditingId(item.id);
    setForm({
      title: item.title, company_name: item.company_name, location: item.location,
      job_type: item.job_type, description: item.description,
      contact_phone: item.contact_phone || "",
    });
    setMessage(""); setError("");
    document.getElementById("vacancy-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || saving) return;
    setSaving(true); setError(""); setMessage("");
    const payload = {
      title: form.title.trim(), company_name: form.company_name.trim(),
      location: form.location.trim(), job_type: form.job_type,
      description: form.description.trim(), contact_phone: form.contact_phone.trim() || null,
    };
    const result = editingId
      ? await supabase.from("vacancies").update(payload).eq("id", editingId)
      : await (async () => {
          const { data: { user } } = await supabase!.auth.getUser();
          return supabase!.from("vacancies").insert({ ...payload, created_by: user?.id ?? null, status: "draft" });
        })();
    if (result.error) setError(result.error.message);
    else {
      setMessage(editingId ? "Vacancy updated." : "Vacancy saved as draft. Review it before publishing.");
      resetForm(); await load();
    }
    setSaving(false);
  }

  async function setStatus(item: Vacancy, status: Status) {
    if (!supabase) return;
    setError(""); setMessage("");
    const { error: updateError } = await supabase.from("vacancies").update({ status }).eq("id", item.id);
    if (updateError) setError(updateError.message);
    else { setMessage(status === "filled" ? "Marked as filled." : status === "published" ? "Vacancy published." : "Moved to draft."); await load(); }
  }
  async function remove(item: Vacancy) {
    if (!supabase || !window.confirm("Delete this vacancy permanently?")) return;
    const { error: deleteError } = await supabase.from("vacancies").delete().eq("id", item.id);
    if (deleteError) setError(deleteError.message);
    else { setMessage("Vacancy deleted."); await load(); }
  }

  const published = items.filter((item) => item.status === "published").length;
  const drafts = items.filter((item) => item.status === "draft").length;
  const filled = items.filter((item) => item.status === "filled").length;

  return (
    <main className="page admin-page vacancy-admin-page">
      <header className="back-header">
        <Link href="/admin" className="back-button" aria-label="Back to admin"><ArrowLeft size={20} /></Link>
        <div><h1>Vacancies</h1><p>Simple local job listings</p></div>
      </header>

      <section className="vacancy-admin-stats">
        <article><strong>{items.length}</strong><span>Total</span></article>
        <article><strong>{published}</strong><span>Published</span></article>
        <article><strong>{drafts}</strong><span>Drafts</span></article>
        <article><strong>{filled}</strong><span>Filled</span></article>
      </section>

      <section className="vacancy-editor-section" id="vacancy-editor">
        <div className="admin-section-title">
          <div><p className="eyebrow">ADMIN ONLY</p><h2>{editingId ? "Edit vacancy" : "Add a vacancy"}</h2></div>
          {editingId && <button type="button" className="button button-ghost" onClick={resetForm}>Cancel</button>}
        </div>
        <form className="form-card" onSubmit={save}>
          <div className="form-grid">
            <label className="field"><span className="field-label">Job title *</span><input className="field-control" required maxLength={120} value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="e.g. Sales Assistant" /></label>
            <label className="field"><span className="field-label">Company / employer *</span><input className="field-control" required maxLength={120} value={form.company_name} onChange={(e) => change("company_name", e.target.value)} placeholder="Employer name" /></label>
            <label className="field"><span className="field-label">Location *</span><input className="field-control" required maxLength={160} value={form.location} onChange={(e) => change("location", e.target.value)} placeholder="e.g. Koottilangadi" /></label>
            <label className="field"><span className="field-label">Job type</span><select className="field-control" value={form.job_type} onChange={(e) => change("job_type", e.target.value)}>{["Full-time", "Part-time", "Temporary", "Internship", "Contract"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field full"><span className="field-label">Short description *</span><textarea className="field-control" required minLength={10} maxLength={3000} value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="What is the work? Add the important details…" /></label>
            <label className="field full"><span className="field-label">Contact number (optional)</span><input className="field-control" type="tel" maxLength={20} value={form.contact_phone} onChange={(e) => change("contact_phone", e.target.value)} placeholder="Employer contact number" /></label>
          </div>
          <p className="privacy-note">New listings are saved as drafts. Verify the employer and job details before publishing. Never publish jobs that ask applicants for advance fees.</p>
          {error && <p className="status-message" role="alert">{error}</p>}
          {message && <p className="status-message" role="status">{message}</p>}
          <button className="button button-primary button-full" type="submit" disabled={saving}>{saving ? <LoaderCircle size={17} className="hotline-loading-spinner" /> : <Plus size={17} />}{saving ? "Saving…" : editingId ? "Save changes" : "Add vacancy"}</button>
        </form>
      </section>

      <section className="vacancy-admin-list-section">
        <div className="admin-section-title"><div><p className="eyebrow">MANAGE</p><h2>All vacancies</h2></div><button className="button button-ghost" type="button" onClick={() => { void load(); }}>Refresh</button></div>
        {loading ? <div className="empty-inline"><LoaderCircle size={24} className="hotline-loading-spinner" /><span>Loading vacancies…</span></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={25} /></div><h2>No vacancies yet</h2><p>Add your first local job listing above.</p></div>
          : <div className="vacancy-admin-list">{items.map((item) => (
            <article className="vacancy-admin-card" key={item.id}>
              <div className="vacancy-admin-card-main">
                <div className="vacancy-admin-card-heading"><h3>{item.title}</h3><span className={"vacancy-admin-status " + (item.status === "published" ? "is-published" : item.status === "filled" ? "is-closed" : "")}>{item.status}</span></div>
                <p>{item.company_name} · {item.location}</p><small>{item.job_type} · {new Date(item.created_at).toLocaleDateString("en-IN")}</small>
              </div>
              <div className="vacancy-admin-actions">
                <button type="button" className="icon-button" title="Edit" aria-label="Edit vacancy" onClick={() => startEdit(item)}><Pencil size={17} /></button>
                {item.status === "published" ? <button type="button" className="icon-button" title="Unpublish" aria-label="Unpublish" onClick={() => void setStatus(item, "draft")}><EyeOff size={17} /></button> : item.status !== "filled" && <button type="button" className="icon-button" title="Publish" aria-label="Publish" onClick={() => void setStatus(item, "published")}><Eye size={17} /></button>}
                {item.status !== "filled" && <button type="button" className="icon-button" title="Mark filled" aria-label="Mark as filled" onClick={() => void setStatus(item, "filled")}><CheckCircle2 size={17} /></button>}
                <button type="button" className="icon-button danger" title="Delete" aria-label="Delete vacancy" onClick={() => void remove(item)}><Trash2 size={17} /></button>
              </div>
            </article>
          ))}</div>}
      </section>
    </main>
  );
}
