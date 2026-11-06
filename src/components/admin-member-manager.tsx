"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Users, Upload, Phone, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Member = { id: string; name: string; ward_number: number; photo_url: string | null; contact_number: string; is_active: boolean };

const emptyForm = { name: "", ward_number: "", contact_number: "", photo_url: "" };

export function AdminMemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMembers() {
    if (!supabase) { setError("Supabase is not configured."); setLoading(false); return; }
    const { data, error: queryError } = await supabase.from("members").select("*").order("ward_number").order("name");
    if (queryError) setError(queryError.message);
    else setMembers((data || []) as Member[]);
    setLoading(false);
  }

  useEffect(() => { void loadMembers(); }, []);

  function editMember(member: Member) {
    setEditing(member.id);
    setForm({ name: member.name, ward_number: String(member.ward_number), contact_number: member.contact_number, photo_url: member.photo_url || "" });
    setPhoto(null);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() { setEditing(null); setForm(emptyForm); setPhoto(null); }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (!file) { setPhoto(null); return; }
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Photo must be 5 MB or smaller."); return; }
    setPhoto(file);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || saving) return;
    setSaving(true); setError(""); setMessage("");
    let photoUrl = form.photo_url.trim() || null;

    if (photo) {
      const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("member-photos").upload(filePath, photo, { upsert: false, contentType: photo.type });
      if (uploadError) { setError(uploadError.message); setSaving(false); return; }
      const { data } = supabase.storage.from("member-photos").getPublicUrl(filePath);
      photoUrl = data.publicUrl;
    }

    const payload = { name: form.name.trim(), ward_number: Number(form.ward_number), contact_number: form.contact_number.trim(), photo_url: photoUrl, is_active: true };
    const result = editing
      ? await supabase.from("members").update(payload).eq("id", editing)
      : await supabase.from("members").insert(payload);
    if (result.error) setError(result.error.message);
    else { setMessage(editing ? "Member updated successfully." : "Member added successfully."); resetForm(); await loadMembers(); }
    setSaving(false);
  }

  async function removeMember(member: Member) {
    if (!supabase || !window.confirm(`Delete ${member.name} from the directory?`)) return;
    const { error: deleteError } = await supabase.from("members").delete().eq("id", member.id);
    if (deleteError) setError(deleteError.message);
    else { setMessage("Member deleted."); await loadMembers(); }
  }

  return (
    <main className="page admin-page members-admin-page">
      <header className="back-header">
        <Link href="/admin" className="back-button" aria-label="Back to admin"><ArrowLeft size={20} /></Link>
        <div><h1>Members Management</h1><p>Add and manage Ward Members</p></div>
      </header>

      <form className="form-card admin-edit-form" onSubmit={submit}>
        <div className="section-heading"><div><p className="eyebrow">REPRESENTATIVE DIRECTORY</p><h2>{editing ? "Edit member" : "Add a member"}</h2></div><Users size={22} /></div>
        <label className="field"><span className="field-label">Full name</span><input className="field-control" required maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Member name" /></label>
        <div className="form-grid">
          <label className="field"><span className="field-label">Ward number</span><input className="field-control" type="number" required min="1" max="999" value={form.ward_number} onChange={e => setForm({ ...form, ward_number: e.target.value })} placeholder="e.g. 5" /></label>
          <label className="field"><span className="field-label">Contact number</span><input className="field-control" type="tel" required minLength={7} maxLength={20} value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} placeholder="Phone number" /></label>
        </div>
        <label className="field"><span className="field-label">Profile photo</span><input className="field-control" type="file" accept="image/*" onChange={handlePhoto} /><small className="privacy-note">Image up to 5 MB. Uploaded to the public member-photos bucket.</small></label>
        {form.photo_url && !photo && <p className="privacy-note">A photo is currently linked to this member. Choose a new file to replace it.</p>}
        {error && <p className="status-message" role="alert">{error}</p>}
        {message && <p className="status-message" role="status">{message}</p>}
        <div className="record-actions">
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? <LoaderCircle size={17} /> : <Plus size={17} />}{saving ? "Saving…" : editing ? "Save changes" : "Add member"}</button>
          {editing && <button className="button button-ghost" type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-section-title"><div><p className="eyebrow">DIRECTORY</p><h2>All ward members ({members.length})</h2></div></div>
      {loading ? <div className="empty-inline"><LoaderCircle className="hotline-loading-spinner" size={24} />Loading…</div> : members.length === 0 ? <div className="empty-state"><div className="empty-icon"><Users size={25} /></div><h2>No members yet</h2><p>Add the first ward representative using the form above.</p></div> : (
        <div className="admin-records">
          {members.map(member => <article className="admin-record" key={member.id}>
            <div><strong>{member.name}</strong><p>Ward {member.ward_number} · {member.contact_number}</p></div>
            <div className="record-actions"><button className="icon-button" type="button" onClick={() => editMember(member)} aria-label={`Edit ${member.name}`}><Pencil size={17} /></button><button className="icon-button danger-icon" type="button" onClick={() => void removeMember(member)} aria-label={`Delete ${member.name}`}><Trash2 size={17} /></button></div>
          </article>)}
        </div>
      )}
    </main>
  );
}
