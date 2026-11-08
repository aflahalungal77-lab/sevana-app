"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2, Pencil, GripVertical, FolderTree, Image as ImageIcon, RefreshCw, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Parent = { id: string; name: string; slug: string; icon_path: string; sort_order: number };
type Child = { id: string; name: string; slug: string; icon_path: string | null; sort_order: number; parent_group_id: string | null };

const slugify = (value: string) => value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function LocalWorkerCategorization() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [parentForm, setParentForm] = useState<Parent | null>(null);
  const [childForm, setChildForm] = useState<Child | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    if (!supabase) { setMessage("Supabase is not configured."); setLoading(false); return; }
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from("worker_category_groups").select("id,name,slug,icon_path,sort_order").order("sort_order").order("name"),
      supabase.from("service_categories").select("id,name,slug,icon_path,sort_order,parent_group_id").eq("kind", "worker").order("sort_order").order("name"),
    ]);
    if (p.error || c.error) setMessage(p.error?.message || c.error?.message || "Could not load categories.");
    else { setParents((p.data || []) as Parent[]); setChildren((c.data || []) as Child[]); setMessage(""); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function resolveIconPath(name: string, fallback: string) {
    if (!supabase || !iconFile) return fallback;
    if (!iconFile.type.startsWith("image/") || iconFile.size > 2 * 1024 * 1024) throw new Error("Choose an image under 2 MB.");
    const extension = iconFile.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${slugify(name)}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("worker-category-icons").upload(filePath, iconFile, { upsert: false, contentType: iconFile.type });
    if (error) throw error;
    return supabase.storage.from("worker-category-icons").getPublicUrl(filePath).data.publicUrl;
  }

  async function saveParent(e: React.FormEvent) {
    e.preventDefault(); if (!supabase || !parentForm) return;
    setBusy(true);
    let iconPath = parentForm.icon_path.trim() || "/emojis/others.png";
    try { iconPath = await resolveIconPath(parentForm.name, iconPath); } catch (error) { setBusy(false); setMessage(error instanceof Error ? error.message : "Icon upload failed."); return; }
    const payload = { name: parentForm.name.trim(), slug: slugify(parentForm.name), icon_path: iconPath, sort_order: parentForm.sort_order };
    const result = parentForm.id
      ? await supabase.from("worker_category_groups").update(payload).eq("id", parentForm.id)
      : await supabase.from("worker_category_groups").insert(payload);
    setBusy(false);
    if (result.error) { setMessage(result.error.message); return; }
    setParentForm(null); setIconFile(null); setMessage("Main category saved."); await load();
  }

  async function saveChild(e: React.FormEvent) {
    e.preventDefault(); if (!supabase || !childForm) return;
    if (!childForm.parent_group_id) { setMessage("Choose a Main Category."); return; }
    setBusy(true);
    let iconPath = childForm.icon_path?.trim() || "/emojis/others.png";
    try { iconPath = await resolveIconPath(childForm.name, iconPath); } catch (error) { setBusy(false); setMessage(error instanceof Error ? error.message : "Icon upload failed."); return; }
    const payload = { name: childForm.name.trim(), slug: slugify(childForm.name), kind: "worker", parent_group_id: childForm.parent_group_id, icon_path: iconPath, sort_order: childForm.sort_order };
    const result = childForm.id
      ? await supabase.from("service_categories").update(payload).eq("id", childForm.id).eq("kind", "worker")
      : await supabase.from("service_categories").insert(payload);
    setBusy(false);
    if (result.error) { setMessage(result.error.message); return; }
    setChildForm(null); setIconFile(null); setMessage("Sub category saved."); await load();
  }

  async function removeParent(parent: Parent) {
    if (!supabase || !window.confirm(`Delete "${parent.name}"? Its sub categories will become unassigned, not deleted.`)) return;
    const { error } = await supabase.from("worker_category_groups").delete().eq("id", parent.id);
    if (error) setMessage(error.message); else { setMessage("Main category deleted."); await load(); }
  }

  async function removeChild(child: Child) {
    if (!supabase || !window.confirm(`Delete "${child.name}"? Listings assigned to it may prevent deletion.`)) return;
    const { error } = await supabase.from("service_categories").delete().eq("id", child.id).eq("kind", "worker");
    if (error) setMessage(error.message); else { setMessage("Sub category deleted."); await load(); }
  }

  async function moveChild(childId: string, parentId: string) {
    if (!supabase) return;
    const { error } = await supabase.from("service_categories").update({ parent_group_id: parentId }).eq("id", childId).eq("kind", "worker");
    if (error) setMessage(error.message); else { setMessage("Sub category moved."); await load(); }
    setDragged(null);
  }

  return (
    <main className="page admin-page premium-admin local-worker-categorization">
      <header className="admin-subpage-header">
        <Link href="/admin" className="admin-back-link" aria-label="Back to dashboard"><ArrowLeft size={19}/></Link>
        <div><p className="eyebrow">LOCAL WORKERS · DIRECTORY STRUCTURE</p><h1>Categorization</h1><p>Create and organise main and sub categories.</p></div>
        <button className="admin-add-button" onClick={() => {setIconFile(null);setParentForm({id:"",name:"",slug:"",icon_path:"/emojis/others.png",sort_order:parents.length+1});}}><Plus size={17}/> Main</button>
      </header>

      <div className="admin-category-intro"><span className="admin-category-intro-icon"><FolderTree size={23}/></span><div><h2>Local Workers structure</h2><p>Add categories, set image paths, or drag a sub category into another main category.</p></div></div>

      {message && <p className="status-message admin-status">{message}</p>}

      {(parentForm || childForm) && (
        <form className="form-card admin-edit-form premium-admin-form" onSubmit={parentForm ? saveParent : saveChild}>
          <div className="section-heading"><div><p className="eyebrow">CATEGORY SETTINGS</p><h2>{parentForm ? (parentForm.id ? "Edit main category" : "New main category") : (childForm?.id ? "Edit sub category" : "New sub category")}</h2></div><button type="button" className="icon-button" onClick={() => {setParentForm(null);setChildForm(null);}}><X size={18}/></button></div>
          <div className="field"><label className="field-label">Category name</label><input className="field-control" required maxLength={80} value={parentForm?.name ?? childForm?.name ?? ""} onChange={e => parentForm ? setParentForm({...parentForm,name:e.target.value}) : setChildForm({...childForm!,name:e.target.value})} placeholder="Enter category name"/></div>
          {!parentForm && <div className="field"><label className="field-label">Main category</label><select className="field-control" required value={childForm?.parent_group_id || ""} onChange={e=>setChildForm({...childForm!,parent_group_id:e.target.value})}><option value="">Choose main category</option>{parents.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}
          <div className="field"><label className="field-label">Upload icon image</label><div className="admin-icon-path-input"><ImageIcon size={17}/><input className="field-control" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setIconFile(e.target.files?.[0] || null)}/></div><small>PNG, JPG or WebP · Maximum 2 MB. Uploaded icons are stored securely in Sevana storage.</small><label className="field-label" style={{marginTop:10}}>Or use an existing image path</label><input className="field-control" value={parentForm?.icon_path ?? childForm?.icon_path ?? ""} onChange={e=>parentForm?setParentForm({...parentForm,icon_path:e.target.value}):setChildForm({...childForm!,icon_path:e.target.value})} placeholder="/emojis/category-name.png"/></div>
          <button className="button button-primary button-full" type="submit" disabled={busy}><Save size={17}/>{busy ? "Saving…" : "Save category"}</button>
        </form>
      )}

      {loading ? <div className="admin-loading"><span className="admin-loading-spinner"/>Loading categories…</div> : (
        <div className="local-worker-parent-list">
          {parents.map(parent => (
            <section className="local-worker-parent-panel" key={parent.id} onDragOver={e=>{if(dragged){e.preventDefault();e.dataTransfer.dropEffect="move";}}} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData("text/plain")||dragged;if(id)void moveChild(id,parent.id);}}>
              <div className="local-worker-parent-heading">
                <img src={parent.icon_path} alt="" onError={e=>{e.currentTarget.src="/emojis/others.png";}}/>
                <div><strong>{parent.name}</strong><small>{children.filter(c=>c.parent_group_id===parent.id).length} sub categories · Drop here to move</small></div>
                <button className="icon-button" onClick={()=>{setIconFile(null);setParentForm(parent);}} aria-label="Edit main category"><Pencil size={16}/></button>
                <button className="icon-button danger-icon" onClick={()=>void removeParent(parent)} aria-label="Delete main category"><Trash2 size={16}/></button>
                <button className="admin-add-button" onClick={()=>{setIconFile(null);setChildForm({id:"",name:"",slug:"",icon_path:"/emojis/others.png",sort_order:children.length+1,parent_group_id:parent.id});}}><Plus size={16}/> Sub</button>
              </div>
              <div className="local-worker-sub-list">
                {children.filter(c=>c.parent_group_id===parent.id).map(child=>(
                  <article key={child.id} className={`local-worker-sub-card ${dragged===child.id?"is-dragging":""}`} draggable onDragStart={e=>{setDragged(child.id);e.dataTransfer.setData("text/plain",child.id);e.dataTransfer.effectAllowed="move";}} onDragEnd={()=>setDragged(null)}>
                    <GripVertical size={17} className="local-worker-sub-grip"/>
                    <img src={child.icon_path || "/emojis/others.png"} alt="" onError={e=>{e.currentTarget.src="/emojis/others.png";}}/>
                    <div><strong>{child.name}</strong><small>{child.slug}</small></div>
                    <button className="icon-button" onClick={()=>{setIconFile(null);setChildForm(child);}} aria-label="Edit sub category"><Pencil size={15}/></button>
                    <button className="icon-button danger-icon" onClick={()=>void removeChild(child)} aria-label="Delete sub category"><Trash2 size={15}/></button>
                  </article>
                ))}
                {children.every(c=>c.parent_group_id!==parent.id) && <p className="local-worker-empty">No sub categories yet. Add one or drag an existing category here.</p>}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
