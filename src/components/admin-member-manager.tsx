"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Users, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Designation = "President" | "Vice President" | "Ward Member";
type Member = { id: string; name: string; designation: Designation; ward_number: number | null; photo_url: string | null; contact_number: string; is_active: boolean };
const emptyForm = { name: "", designation: "Ward Member" as Designation, ward_number: "", contact_number: "" };

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
    setLoading(true);
    const { data, error: queryError } = await supabase.from("members").select("*").order("designation").order("ward_number", { ascending: true, nullsFirst: true }).order("name");
    if (queryError) setError(queryError.message);
    else { setMembers((data || []) as Member[]); setError(""); }
    setLoading(false);
  }
  useEffect(() => { void loadMembers(); }, []);

  function editMember(member: Member) {
    setEditing(member.id);
    setForm({ name: member.name, designation: member.designation, ward_number: member.ward_number?.toString() || "", contact_number: member.contact_number });
    setPhoto(null); setMessage(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function resetForm() { setEditing(null); setForm(emptyForm); setPhoto(null); }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (!file) { setPhoto(null); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPG, PNG or WebP image."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Photo must be 5 MB or smaller."); return; }
    setPhoto(file); setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || saving) return;
    setSaving(true); setError(""); setMessage("");
    try {
      let photoUrl = editing ? members.find((member) => member.id === editing)?.photo_url || null : null;
      if (photo) {
        const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = crypto.randomUUID() + "." + extension;
        const { error: uploadError } = await supabase.storage.from("member-photos").upload(filePath, photo, { upsert: false, contentType: photo.type });
        if (uploadError) throw uploadError;
        photoUrl = supabase.storage.from("member-photos").getPublicUrl(filePath).data.publicUrl;
      }
      const payload = {
        name: form.name.trim(),
        designation: form.designation,
        ward_number: form.designation === "Ward Member" ? Number(form.ward_number) : null,
        contact_number: form.contact_number.trim(),
        photo_url: photoUrl,
        is_active: true,
      };
      const result = editing ? await supabase.from("members").update(payload).eq("id", editing) : await supabase.from("members").insert(payload);
      if (result.error) throw result.error;
      setMessage(editing ? "Member updated successfully." : "Member added successfully.");
      resetForm(); await loadMembers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save member.");
    } finally { setSaving(false); }
  }

  async function removeMember(member: Member) {
    if (!supabase || !window.confirm("Delete " + member.name + " from the directory?")) return;
    const { error: deleteError } = await supabase.from("members").delete().eq("id", member.id);
    if (deleteError) setError(deleteError.message);
    else { setMessage("Member deleted."); await loadMembers(); }
  }

  return <main className="page admin-page members-admin-page">
    <header className="back-header"><Link href="/admin" className="back-button" aria-label="Back to admin"><ArrowLeft size={20} /></Link><div><h1>Members Management</h1><p>Manage panchayat and ward representatives</p></div></header>
    <form className="form-card admin-edit-form" onSubmit={submit}>
      <div className="section-heading"><div><p className="eyebrow">REPRESENTATIVE DIRECTORY</p><h2>{editing ? "Edit member" : "Add a member"}</h2></div><Users size={22} /></div>
      <label className="field"><span className="field-label">Full name</span><input className="field-control" required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Member name" /></label>
      <label className="field"><span className="field-label">Designation</span><select className="field-control" value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value as Designation, ward_number: "" })}><option value="President">Panchayat President</option><option value="Vice President">Panchayat Vice President</option><option value="Ward Member">Ward Member</option></select></label>
      {form.designation === "Ward Member" && <label className="field"><span className="field-label">Ward number</span><input className="field-control" type="number" required min="1" max="999" value={form.ward_number} onChange={(event) => setForm({ ...form, ward_number: event.target.value })} placeholder="e.g. 5" /></label>}
      <label className="field"><span className="field-label">Contact number</span><input className="field-control" type="tel" required minLength={7} maxLength={20} value={form.contact_number} onChange={(event) => setForm({ ...form, contact_number: event.target.value })} placeholder="Phone number" /></label>
      <label className="field"><span className="field-label">Profile photo</span><input className="field-control" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} /><small className="privacy-note">JPG, PNG or WebP · maximum 5 MB</small></label>
      {error && <p className="status-message" role="alert">{error}</p>}
      {message && <p className="status-message" role="status">{message}</p>}
      <div className="record-actions"><button className="button button-primary" type="submit" disabled={saving}>{saving ? <LoaderCircle size={17} /> : <Plus size={17} />}{saving ? "Saving…" : editing ? "Save changes" : "Add member"}</button>{editing && <button className="button button-ghost" type="button" onClick={resetForm}>Cancel</button>}</div>
    </form>
    <div className="admin-section-title"><div><p className="eyebrow">DIRECTORY</p><h2>All members ({members.length})</h2></div></div>
    {loading ? <div className="empty-inline"><LoaderCircle className="hotline-loading-spinner" size={24} />Loading…</div> : members.length === 0 ? <div className="empty-state"><div className="empty-icon"><Users size={25} /></div><h2>No members yet</h2><p>Add the first representative using the form above.</p></div> : <div className="admin-records">{members.map((member) => <article className="admin-record" key={member.id}>
      <div className="admin-record-member-photo">{member.photo_url ? <img src={member.photo_url} alt="" /> : <Users size={22} />}</div>
      <div className="admin-record-member-copy"><strong>{member.name}</strong><p>{member.designation}{member.ward_number !== null ? " · Ward " + member.ward_number : ""} · {member.contact_number}</p></div>
      <div className="record-actions"><button className="icon-button" type="button" onClick={() => editMember(member)} aria-label={"Edit " + member.name}><Pencil size={17} /></button><button className="icon-button danger-icon" type="button" onClick={() => void removeMember(member)} aria-label={"Delete " + member.name}><Trash2 size={17} /></button></div>
    </article>)}</div>}
  </main>;
}
