"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Plus, Pencil, Trash2, Eye, EyeOff, CheckCircle2, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Status = "draft" | "published" | "filled";
type Vacancy = {
  id: string; title: string; company_name: string; description: string; category: string;
  job_type: string; location: string; salary_min: number | null; salary_max: number | null;
  requirements: string | null; experience_required: string | null; contact_phone: string | null;
  contact_whatsapp: string | null; application_url: string | null; status: Status;
  expires_at: string | null; created_at: string;
};

type FormState = {
  title: string; company_name: string; description: string; category: string; job_type: string;
  location: string; salary_min: string; salary_max: string; requirements: string;
  experience_required: string; contact_phone: string; contact_whatsapp: string;
  application_url: string; expires_at: string; status: Status;
};

const emptyForm: FormState = {
  title: "", company_name: "", description: "", category: "Other", job_type: "Full-time",
  location: "", salary_min: "", salary_max: "", requirements: "", experience_required: "",
  contact_phone: "", contact_whatsapp: "", application_url: "", expires_at: "", status: "draft",
};

const categories = ["Other", "Retail & Sales", "Office & Administration", "Education", "Healthcare", "Hospitality", "Driving", "Skilled Work", "Technology", "Construction"];

function toLocalDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function AdminVacancyManager() {
  const router = useRouter();
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
    const { data, error: queryError } = await supabase.from("vacancies").select("*").order("created_at", { ascending: false });
    if (queryError) setError(queryError.message);
    else { setItems((data || []) as Vacancy[]); setError(""); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  function change<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: Vacancy) {
    setEditingId(item.id);
    setForm({
      title: item.title, company_name: item.company_name, description: item.description,
      category: item.category || "Other", job_type: item.job_type, location: item.location,
      salary_min: item.salary_min == null ? "" : String(item.salary_min),
      salary_max: item.salary_max == null ? "" : String(item.salary_max),
      requirements: item.requirements || "", experience_required: item.experience_required || "",
      contact_phone: item.contact_phone || "", contact_whatsapp: item.contact_whatsapp || "",
      application_url: item.application_url || "", expires_at: toLocalDate(item.expires_at), status: item.status,
    });
    setMessage("");
    setError("");
    document.getElementById("vacancy-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || saving) return;
    setSaving(true); setError(""); setMessage("");
    const min = form.salary_min.trim() ? Number(form.salary_min) : null;
    const max = form.salary_max.trim() ? Number(form.salary_max) : null;
    if ((min !== null && (!Number.isFinite(min) || min < 0)) || (max !== null && (!Number.isFinite(max) || max < 0))) {
      setError("Enter a valid non-negative salary amount."); setSaving(false); return;
    }
    if (min !== null && max !== null && max < min) {
      setError("Maximum salary must be greater than or equal to minimum salary."); setSaving(false); return;
    }
    if (form.application_url && !/^https?:\/\//i.test(form.application_url)) {
      setError("Application URL must start with https:// or http://."); setSaving(false); return;
    }
    const payload = {
      title: form.title.trim(), company_name: form.company_name.trim(), description: form.description.trim(),
      category: form.category, job_type: form.job_type, location: form.location.trim(),
      salary_min: min, salary_max: max, requirements: form.requirements.trim() || null,
      experience_required: form.experience_required.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
      contact_whatsapp: form.contact_whatsapp.trim() || null,
      application_url: form.application_url.trim() || null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      status: form.status,
    };
    const result = editingId
      ? await supabase.from("vacancies").update(payload).eq("id", editingId)
      : await (async () => {
          const { data: { user } } = await supabase!.auth.getUser();
          return supabase!.from("vacancies").insert({ ...payload, created_by: user?.id ?? null });
        })();
    if (result.error) setError(result.error.message);
    else { setMessage(editingId ? "Vacancy updated." : "Vacancy created."); resetForm(); await load(); }
    setSaving(false);
  }

  async function setStatus(item: Vacancy, status: Status) {
    if (!supabase) return;
    setError(""); setMessage("");
    const { error: updateError } = await supabase.from("vacancies").update({ status }).eq("id", item.id);
    if (updateError) setError(updateError.message);
    else { setMessage(status === "filled" ? "Vacancy marked as filled." : status === "published" ? "Vacancy published." : "Vacancy moved to draft."); await load(); }
  }

  async function remove(item: Vacancy) {
    if (!supabase || !window.confirm("Delete this vacancy permanently?")) return;
    const { error: deleteError } = await supabase.from("vacancies").delete().eq("id", item.id);
    if (deleteError) setError(deleteError.message);
    else { setMessage("Vacancy deleted."); await load(); }
  }

  const activeCount = items.filter((item) => item.status === "published" && (!item.expires_at || new Date(item.expires_at) > new Date())).length;
  const draftCount = items.filter((item) => item.status === "draft").length;
  const filledCount = items.filter((item) => item.status === "filled" || (item.expires_at && new Date(item.expires_at) <= new Date())).length;

  return (
    <main className="page admin-page vacancy-admin-page">
      <header className="back-header">
        <Link href="/admin" className="back-button" aria-label="Back to admin"><ArrowLeft size={20} /></Link>
        <div><h1>Vacancy Management</h1><p>Create and manage local job listings</p></div>
      </header>

      <section className="vacancy-admin-stats">
        <article><strong>{items.length}</strong><span>Total</span></article>
        <article><strong>{activeCount}</strong><span>Published</span></article>
        <article><strong>{draftCount}</strong><span>Drafts</span></article>
        <article><strong>{filledCount}</strong><span>Filled / expired</span></article>
      </section>

      <section className="vacancy-editor-section" id="vacancy-editor">
        <div className="admin-section-title"><div><p className="eyebrow">ADMIN ONLY</p><h2>{editingId ? "Edit vacancy" : "Add a vacancy"}</h2></div>{editingId && <button type="button" className="button button-ghost" onClick={resetForm}>Cancel edit</button>}</div>
        <form className="form-card" onSubmit={save}>
          <div className="form-grid">
            <label className="field"><span className="field-label">Job title *</span><input className="field-control" required maxLength={120} value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="e.g. Sales Assistant" /></label>
            <label className="field"><span className="field-label">Company / institution *</span><input className="field-control" required maxLength={120} value={form.company_name} onChange={(e) => change("company_name", e.target.value)} placeholder="Employer name" /></label>
            <label className="field"><span className="field-label">Category</span><select className="field-control" value={form.category} onChange={(e) => change("category", e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field"><span className="field-label">Job type *</span><select className="field-control" value={form.job_type} onChange={(e) => change("job_type", e.target.value)}>{["Full-time", "Part-time", "Temporary", "Internship", "Contract"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field full"><span className="field-label">Location *</span><input className="field-control" required maxLength={160} value={form.location} onChange={(e) => change("location", e.target.value)} placeholder="e.g. Koottilangadi, Malappuram" /></label>
            <label className="field"><span className="field-label">Minimum salary (₹ / month)</span><input className="field-control" type="number" min="0" step="1" value={form.salary_min} onChange={(e) => change("salary_min", e.target.value)} placeholder="Optional" /></label>
            <label className="field"><span className="field-label">Maximum salary (₹ / month)</span><input className="field-control" type="number" min="0" step="1" value={form.salary_max} onChange={(e) => change("salary_max", e.target.value)} placeholder="Optional" /></label>
            <label className="field full"><span className="field-label">Job description *</span><textarea className="field-control" required minLength={10} maxLength={8000} value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="Describe the role and responsibilities…" /></label>
            <label className="field full"><span className="field-label">Requirements / qualifications</span><textarea className="field-control" value={form.requirements} onChange={(e) => change("requirements", e.target.value)} placeholder="Skills, education or other requirements" /></label>
            <label className="field full"><span className="field-label">Experience required</span><input className="field-control" value={form.experience_required} onChange={(e) => change("experience_required", e.target.value)} placeholder="e.g. Freshers can apply" /></label>
            <label className="field"><span className="field-label">Contact phone</span><input className="field-control" type="tel" value={form.contact_phone} onChange={(e) => change("contact_phone", e.target.value)} placeholder="Employer contact" /></label>
            <label className="field"><span className="field-label">WhatsApp number</span><input className="field-control" type="tel" value={form.contact_whatsapp} onChange={(e) => change("contact_whatsapp", e.target.value)} placeholder="With country code" /></label>
            <label className="field full"><span className="field-label">Application URL</span><input className="field-control" type="url" value={form.application_url} onChange={(e) => change("application_url", e.target.value)} placeholder="https://…" /></label>
            <label className="field"><span className="field-label">Expiry date</span><input className="field-control" type="datetime-local" value={form.expires_at} onChange={(e) => change("expires_at", e.target.value)} /></label>
            <label className="field"><span className="field-label">Visibility</span><select className="field-control" value={form.status} onChange={(e) => change("status", e.target.value as Status)}><option value="draft">Save as draft</option><option value="published">Publish now</option><option value="filled">Already filled</option></select></label>
          </div>
          <p className="privacy-note">Only admins can create or edit listings. Verify the employer and vacancy details before publishing. Never publish a listing that asks applicants for an advance fee.</p>
          {error && <p className="status-message" role="alert">{error}</p>}
          {message && <p className="status-message" role="status">{message}</p>}
          <button className="button button-primary button-full" type="submit" disabled={saving}>{saving ? <LoaderCircle size={17} className="hotline-loading-spinner" /> : <Plus size={17} />}{saving ? "Saving…" : editingId ? "Update vacancy" : "Save vacancy"}</button>
        </form>
      </section>

      <section className="vacancy-admin-list-section">
        <div className="admin-section-title"><div><p className="eyebrow">LISTINGS</p><h2>All vacancies</h2></div><button className="button button-ghost" type="button" onClick={() => { void load(); }}><LoaderCircle size={16} /> Refresh</button></div>
        {loading ? <div className="empty-inline"><LoaderCircle size={24} className="hotline-loading-spinner" /><span>Loading vacancies…</span></div>
          : items.length === 0 ? <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={25} /></div><h2>No vacancies yet</h2><p>Create the first local job listing using the form above.</p></div>
          : <div className="vacancy-admin-list">{items.map((item) => {
            const expired = Boolean(item.expires_at && new Date(item.expires_at) <= new Date());
            const label = expired ? "Expired" : item.status;
            return <article className="vacancy-admin-card" key={item.id}>
              <div className="vacancy-admin-card-main"><div className="vacancy-admin-card-heading"><h3>{item.title}</h3><span className={"vacancy-admin-status " + (label === "published" ? "is-published" : label === "filled" || expired ? "is-closed" : "")}>{label}</span></div><p>{item.company_name} · {item.location}</p><small>{item.job_type} · {new Date(item.created_at).toLocaleDateString("en-IN")}</small></div>
              <div className="vacancy-admin-actions">
                <button type="button" className="icon-button" title="Edit vacancy" aria-label="Edit vacancy" onClick={() => startEdit(item)}><Pencil size={17} /></button>
                {item.status === "published" ? <button type="button" className="icon-button" title="Unpublish" aria-label="Unpublish" onClick={() => void setStatus(item, "draft")}><EyeOff size={17} /></button> : item.status !== "filled" && <button type="button" className="icon-button" title="Publish" aria-label="Publish" onClick={() => void setStatus(item, "published")}><Eye size={17} /></button>}
                {item.status !== "filled" && <button type="button" className="icon-button" title="Mark as filled" aria-label="Mark as filled" onClick={() => void setStatus(item, "filled")}><CheckCircle2 size={17} /></button>}
                <button type="button" className="icon-button danger" title="Delete vacancy" aria-label="Delete vacancy" onClick={() => void remove(item)}><Trash2 size={17} /></button>
              </div>
            </article>;
          })}</div>}
      </section>
    </main>
  );
}
