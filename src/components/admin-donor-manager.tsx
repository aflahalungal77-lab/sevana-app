"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Row = {id:string;name:string;blood_group:string;phone:string;area:string;available:boolean};
const groups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export function AdminDonorManager() {
  const [rows,setRows] = useState<Row[]>([]);
  const [editing,setEditing] = useState<Row|null>(null);
  const [message,setMessage] = useState("");
  async function load() {
    const {data,error} = await supabase!.from("donors").select("*").order("name");
    if(error) setMessage("Could not load donors. Check admin permissions.");
    setRows((data || []) as Row[]);
  }
  useEffect(()=>{ if(supabase) void load(); else setMessage("Supabase is not configured."); },[]);
  function create() { setEditing({id:"",name:"",blood_group:"O+",phone:"",area:"",available:true}); setMessage(""); }
  async function save(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(!supabase||!editing) return;
    const payload={name:editing.name.trim(),blood_group:editing.blood_group,phone:editing.phone.trim(),area:editing.area.trim(),available:editing.available};
    const result=editing.id ? await supabase.from("donors").update(payload).eq("id",editing.id) : await supabase.from("donors").insert(payload);
    if(result.error){setMessage("Could not save donor. Check fields and permissions.");return;}
    setEditing(null);setMessage("Donor saved.");await load();
  }
  async function remove(id:string) {
    if(!supabase||!window.confirm("Delete this donor record?"))return;
    const {error}=await supabase.from("donors").delete().eq("id",id);
    if(error)setMessage("Could not delete donor.");else{setMessage("Donor deleted.");await load();}
  }
  return <div className="page admin-page">
    <header className="back-header"><Link href="/admin" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>Donors</h1><p>Manage donor records carefully</p></div><button className="icon-button header-action" onClick={create} aria-label="Add donor"><Plus size={20}/></button></header>
    <p className="notice">Get each donor&apos;s explicit consent before publishing their name and phone number. Keep availability up to date.</p>
    {editing&&<form className="form-card" onSubmit={save}><div className="section-heading"><h2>{editing.id?"Edit donor":"Add donor"}</h2><button type="button" className="icon-button" onClick={()=>setEditing(null)}><X size={18}/></button></div>
      <div className="field"><label className="field-label">Donor name</label><input className="field-control" required value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></div>
      <div className="field"><label className="field-label">Blood group</label><select className="field-control" value={editing.blood_group} onChange={e=>setEditing({...editing,blood_group:e.target.value})}>{groups.map(g=><option key={g}>{g}</option>)}</select></div>
      <div className="field"><label className="field-label">Phone</label><input className="field-control" type="tel" required value={editing.phone} onChange={e=>setEditing({...editing,phone:e.target.value})}/></div>
      <div className="field"><label className="field-label">Area</label><input className="field-control" required value={editing.area} onChange={e=>setEditing({...editing,area:e.target.value})}/></div>
      <label className="check-row"><input type="checkbox" checked={editing.available} onChange={e=>setEditing({...editing,available:e.target.checked})}/>Available for requests</label>
      <button className="button button-primary button-full"><Save size={17}/>Save donor</button>
    </form>}
    {message&&<p className="status-message">{message}</p>}
    {rows.length?<div className="admin-records">{rows.map(r=><article className="admin-record" key={r.id}><div><strong>{r.name} · {r.blood_group}</strong><p>{r.phone} · {r.area}</p><small>{r.available?"Available":"Unavailable"}</small></div><div className="record-actions"><button className="icon-button" onClick={()=>setEditing(r)}><Pencil size={17}/></button><button className="icon-button danger-icon" onClick={()=>remove(r.id)}><Trash2 size={17}/></button></div></article>)}</div>:<div className="empty-state"><h2>No donors added yet</h2><p>Add donors only with their permission.</p><button className="button button-primary" onClick={create}><Plus size={17}/>Add donor</button></div>}
  </div>;
}
