"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Users, MapPin, Landmark, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Member = { id: string; name: string; designation: "President" | "Vice President" | "Ward Member"; ward_number: number | null; photo_url: string | null; contact_number: string };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setError("Directory is not configured yet."); setLoading(false); return; }
      const { data, error: queryError } = await supabase.from("members")
        .select("id,name,designation,ward_number,photo_url,contact_number")
        .eq("is_active", true)
        .order("designation")
        .order("ward_number", { ascending: true, nullsFirst: true })
        .order("name");
      if (!active) return;
      if (queryError) setError("Unable to load members. Please try again later.");
      else setMembers((data || []) as Member[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);

  const panchayat = members.filter((member) => member.designation !== "Ward Member");
  const wards = members.filter((member) => member.designation === "Ward Member");

  function cards(items: Member[]) {
    return <div className="members-grid">{items.map((member) => (
      <article className="member-card" key={member.id}>
        <div className="member-photo">{member.photo_url ? <img src={member.photo_url} alt={member.name} /> : <Users size={28} />}</div>
        <div className="member-details">
          {member.ward_number !== null ? <span className="member-ward"><MapPin size={13} /> Ward {member.ward_number}</span> : <span className="member-ward">{member.designation}</span>}
          <h2>{member.name}</h2>
          {member.ward_number !== null && <p className="member-designation">Ward Member</p>}
          <p><Phone size={13} /> {member.contact_number}</p>
          <a className="call-button member-call" href={"tel:" + member.contact_number.replace(/[^+0-9]/g, "")}><Phone size={15} /> Call</a>
        </div>
      </article>
    ))}</div>;
  }

  return <main className="page members-page">
    <header className="back-header"><Link href="/" className="back-button" aria-label="Back to home"><ArrowLeft size={20} /></Link><div><h1>Members</h1><p>Local Panchayat & Ward representatives</p></div></header>
    <section className="intro-panel"><div className="intro-icon"><Users size={22} /></div><div><h2>Your local representatives</h2><p>Find a representative and contact them directly.</p></div></section>
    {loading ? <div className="empty-inline"><LoaderCircle className="hotline-loading-spinner" size={25} /><span>Loading members…</span></div>
      : error ? <div className="empty-state"><div className="empty-icon"><Users size={25} /></div><h2>Members unavailable</h2><p>{error}</p></div>
      : members.length === 0 ? <div className="empty-state"><div className="empty-icon"><Users size={25} /></div><h2>No members added yet</h2><p>Verified local representatives will appear here when available.</p></div>
      : <>
        {panchayat.length > 0 && <section className="members-group"><h2 className="members-group-title"><Landmark size={19} /> Panchayat</h2>{cards(panchayat)}</section>}
        {wards.length > 0 && <section className="members-group"><h2 className="members-group-title"><MapPin size={19} /> Ward Members</h2>{cards(wards)}</section>}
      </>}
    <p className="notice">Contact details are provided for community assistance. Please use them respectfully.</p>
  </main>;
}
