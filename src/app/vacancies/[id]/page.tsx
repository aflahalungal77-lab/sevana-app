"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, MapPin, CalendarDays, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Vacancy = {
  id: string; title: string; company_name: string; description: string;
  location: string; created_at: string;
};

export default function VacancyDetailsPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase || !params.id) { setError("This vacancy is unavailable."); setLoading(false); return; }
      const { data, error: queryError } = await supabase.from("vacancies")
        .select("id,title,company_name,description,location,created_at")
        .eq("id", params.id).eq("status", "published").maybeSingle();
      if (!active) return;
      if (queryError || !data) setError("This vacancy is no longer available.");
      else setJob(data as Vacancy);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [params.id]);

  return (
    <main className="page vacancy-detail-page">
      <header className="back-header"><Link href="/vacancies" className="back-button" aria-label="Back to vacancies"><ArrowLeft size={20} /></Link><div><h1>Job details</h1><p>Sevana Vacancies</p></div></header>
      {loading ? <div className="empty-inline"><LoaderCircle size={24} className="hotline-loading-spinner" /><span>Loading job details…</span></div>
        : error || !job ? <div className="empty-state"><h2>Vacancy unavailable</h2><p>{error}</p><Link href="/vacancies" className="button button-primary">Browse vacancies</Link></div>
        : <>
          <section className="vacancy-detail-hero"><span className="vacancy-card-icon"><BriefcaseBusiness size={24} /></span><h1>{job.title}</h1><p>{job.company_name}</p><div className="vacancy-meta"><span><MapPin size={14} />{job.location}</span><span><CalendarDays size={14} />Posted {new Date(job.created_at).toLocaleDateString("en-IN")}</span></div></section>
          <section className="vacancy-detail-section"><h2>About this role</h2><p>{job.description}</p></section>
          <p className="notice">Sevana shares these listings for community information. Confirm the employer and job conditions independently. Never pay an advance fee to get a job.</p>
        </>}
    </main>
  );
}
