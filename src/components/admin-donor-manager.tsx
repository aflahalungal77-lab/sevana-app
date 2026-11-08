"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2, Pencil, Save, X, Droplets, Users, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Row = {id:string;name:string;blood_group:string;phone:string;area:string;available:boolean};
const groups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const groupColors: Record<string,string> = {"A+":"#16A34A","A-":"#0D9488","B+":"#3B82F6","B-":"#6366F1","AB+":"#A855F7","AB-":"#D9468D","O+":"#F59E0B","O-":"#EA580C"};

export function AdminDonorManager() {
  const [rows,setRows] = useState<Row[]>([]);
  const [editing,setEditing] = useState<Row|null>(null);
  const [message,setMessage] = useState("");
  const [selectedGroup,setSelectedGroup] = useState<string|null>(null);

  async function load() {
    const {data,error} = await supabase!.from("donors").select("*").order("name");
    if(error) setMessage("Could not load donors. Check admin permissions.");
    setRows((data || []) as Row[]);
  }
  useEffect(()=>{ if(supabase) void load(); else setMessage("Supabase is not configured."); },[]);

  const groupCounts = useMemo(()=>groups.map(group=>({group,count:rows.filter(row=>row.blood_group===group).length,color:groupColors[group]})),[rows]);
  const totalDonors = rows.length;
  let cursor = 0;
  const stops = groupCounts.filter(item=>item.count>0).map(item=>{
    const start=cursor; cursor+=(item.count/Math.max(totalDonors,1))*100;
    return `${item.color} ${start}% ${cursor}%`;
  });
  const chartBackground = totalDonors ? `conic-gradient(${stops.join(",")})` : "conic-gradient(#E5E7EB 0% 100%)";
  const filteredRows = selectedGroup ? rows.filter(row=>row.blood_group===selectedGroup) : rows;

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

    <section aria-label="Blood donor analytics" style={{margin:"22px 0 26px",padding:20,borderRadius:22,border:"1px solid var(--border, #E5E7EB)",background:"linear-gradient(145deg, var(--card, #FFFFFF), rgba(22,163,74,.045))",boxShadow:"0 12px 34px rgba(15,23,42,.055)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:18}}>
        <div><div style={{display:"flex",alignItems:"center",gap:8,color:"#15803D",fontSize:12,fontWeight:800,letterSpacing:".09em",textTransform:"uppercase"}}><Droplets size={15}/> Donor analytics</div><h2 style={{fontSize:20,fontWeight:800,margin:"5px 0 3px"}}>Blood Group Distribution</h2><p style={{fontSize:13,opacity:.68,margin:0}}>Live breakdown of registered donors</p></div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:14,background:"rgba(22,163,74,.09)",color:"#15803D",fontSize:12,fontWeight:700}}><span style={{width:7,height:7,borderRadius:"50%",background:"#16A34A"}}/> Live data</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:20}}>
        <div style={{padding:"14px 15px",borderRadius:16,background:"var(--surface, rgba(148,163,184,.09))",border:"1px solid var(--border, rgba(148,163,184,.16))"}}><div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,opacity:.68}}><Users size={15}/> Total donors</div><div style={{fontSize:27,fontWeight:850,letterSpacing:"-.04em",marginTop:5,lineHeight:1.2}}>{totalDonors}</div><div style={{fontSize:11,opacity:.58,marginTop:4}}>All registered records</div></div>
        <div style={{padding:"14px 15px",borderRadius:16,background:"var(--surface, rgba(148,163,184,.09))",border:"1px solid var(--border, rgba(148,163,184,.16))"}}><div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,opacity:.68}}><Droplets size={15}/> Blood groups</div><div style={{fontSize:27,fontWeight:850,letterSpacing:"-.04em",marginTop:5,lineHeight:1.2}}>{groupCounts.filter(item=>item.count>0).length}<span style={{fontSize:13,fontWeight:600,opacity:.55}}> / 8</span></div><div style={{fontSize:11,opacity:.58,marginTop:4}}>Groups with donors</div></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,230px),1fr))",gap:22,alignItems:"center"}}>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 0"}}>
          <div role="img" aria-label={`Donor distribution across 8 blood groups. Total donors: ${totalDonors}`} style={{width:190,height:190,maxWidth:"100%",borderRadius:"50%",background:chartBackground,position:"relative",display:"grid",placeItems:"center",boxShadow:"0 8px 25px rgba(15,23,42,.10)"}}>
            <div style={{width:126,height:126,borderRadius:"50%",background:"var(--card, #FFFFFF)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"inset 0 0 0 1px var(--border, #E5E7EB)"}}><strong style={{fontSize:32,lineHeight:1,fontWeight:850,letterSpacing:"-.05em"}}>{totalDonors}</strong><span style={{fontSize:10,letterSpacing:".12em",fontWeight:800,opacity:.55,marginTop:6}}>TOTAL DONORS</span></div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:9}}>
          {groupCounts.map(item=>{
            const active=selectedGroup===item.group;
            const percentage=totalDonors?(item.count/totalDonors)*100:0;
            return <button key={item.group} type="button" onClick={()=>setSelectedGroup(active?null:item.group)} aria-pressed={active} style={{textAlign:"left",padding:"11px 10px",borderRadius:13,border:active?`1.5px solid ${item.color}`:"1px solid var(--border, #E5E7EB)",background:active?`${item.color}14`:"var(--card, rgba(255,255,255,.7))",cursor:"pointer",transition:"all .18s",minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:5}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:800}}><span style={{width:9,height:9,borderRadius:3,background:item.color,flexShrink:0}}/>{item.group}</span><span style={{fontSize:15,fontWeight:850,fontVariantNumeric:"tabular-nums"}}>{item.count}</span></div>
              <div style={{height:4,borderRadius:9,background:"var(--border, #E5E7EB)",marginTop:9,overflow:"hidden"}}><div style={{height:"100%",width:`${percentage}%`,background:item.color,borderRadius:9}}/></div>
              <div style={{fontSize:10,opacity:.58,marginTop:5}}>{percentage.toFixed(1)}% of donors</div>
            </button>;
          })}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",marginTop:18,paddingTop:14,borderTop:"1px solid var(--border, #E5E7EB)"}}>
        <p style={{fontSize:12,opacity:.65,margin:0}}>{selectedGroup?`Showing ${selectedGroup} donors in the list below`:"Select a blood group to filter the donor list"}</p>
        {selectedGroup&&<button type="button" onClick={()=>setSelectedGroup(null)} style={{display:"inline-flex",alignItems:"center",gap:6,border:0,background:"transparent",color:"#15803D",fontSize:12,fontWeight:750,cursor:"pointer"}}><RotateCcw size={13}/> Clear filter</button>}
      </div>
    </section>

    {editing&&<form className="form-card" onSubmit={save}><div className="section-heading"><h2>{editing.id?"Edit donor":"Add donor"}</h2><button type="button" className="icon-button" onClick={()=>setEditing(null)}><X size={18}/></button></div>
      <div className="field"><label className="field-label">Donor name</label><input className="field-control" required value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></div>
      <div className="field"><label className="field-label">Blood group</label><select className="field-control" value={editing.blood_group} onChange={e=>setEditing({...editing,blood_group:e.target.value})}>{groups.map(g=><option key={g}>{g}</option>)}</select></div>
      <div className="field"><label className="field-label">Phone</label><input className="field-control" type="tel" required value={editing.phone} onChange={e=>setEditing({...editing,phone:e.target.value})}/></div>
      <div className="field"><label className="field-label">Area</label><input className="field-control" required value={editing.area} onChange={e=>setEditing({...editing,area:e.target.value})}/></div>
      <label className="check-row"><input type="checkbox" checked={editing.available} onChange={e=>setEditing({...editing,available:e.target.checked})}/>Available for requests</label>
      <button className="button button-primary button-full"><Save size={17}/>Save donor</button>
    </form>}
    {message&&<p className="status-message">{message}</p>}
    {filteredRows.length?<div className="admin-records">{filteredRows.map(r=><article className="admin-record" key={r.id}><div><strong>{r.name} · {r.blood_group}</strong><p>{r.phone} · {r.area}</p><small>{r.available?"Available":"Unavailable"}</small></div><div className="record-actions"><button className="icon-button" onClick={()=>setEditing(r)} aria-label={`Edit ${r.name}`}><Pencil size={17}/></button><button className="icon-button danger-icon" onClick={()=>remove(r.id)} aria-label={`Delete ${r.name}`}><Trash2 size={17}/></button></div></article>)}</div>:<div className="empty-state"><h2>{selectedGroup?`No ${selectedGroup} donors found`:"No donors added yet"}</h2><p>{selectedGroup?"Choose another blood group or clear the filter.":"Add donors only with their permission."}</p>{selectedGroup?<button className="button button-secondary" onClick={()=>setSelectedGroup(null)}>Show all donors</button>:<button className="button button-primary" onClick={create}><Plus size={17}/>Add donor</button>}</div>}
  </div>;
}
