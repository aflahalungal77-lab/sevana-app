"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, MapPin, Search, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Vacancy = {
  id: string; title: string; company_name: string;
  location: string; created_at: string;
};

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setError("Vacancies are not configured yet."); setLoading(false); return; }
      const { data, error: queryError } = await supabase.from("vacancies")
        .select("id,title,company_name,location,created_at")
        .eq("status", "published").order("created_at", { ascending: false });
      if (!active) return;
      if (queryError) setError("Unable to load vacancies right now. Please try again later.");
      else setVacancies((data || []) as Vacancy[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vacancies.filter((job) =>
      (!query || [job.title, job.company_name, job.location].some((value) => value?.toLowerCase().includes(query)))
    );
  }, [vacancies, search]);

  return (
    <main className="page vacancies-page">
      <header className="back-header"><Link href="/" className="back-button" aria-label="Back to home"><ArrowLeft size={20} /></Link><div><h1>Vacancies</h1><p>Local job opportunities around your community</p></div></header>
      <section className="intro-panel"><div className="intro-icon"><BriefcaseBusiness size={22} /></div><div><h2>Find local opportunities</h2><p>Job listings reviewed and published by the Sevana admin team.</p></div></section>
      <label className="vacancy-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search job, employer or location" aria-label="Search vacancies" /></label>
      {loading ? <div className="empty-inline"><LoaderCircle size={24} className="hotline-loading-spinner" /><span>Loading vacancies…</span></div>
        : error ? <div className="empty-state"><h2>Vacancies unavailable</h2><p>{error}</p></div>
        : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={25} /></div><h2>No vacancies found</h2><p>{vacancies.length ? "Try another search." : "New local opportunities will appear here when published."}</p></div>
        : <section className="vacancy-list" aria-label="Available vacancies"><p className="result-count">{filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} available</p>
          {filtered.map((job) => <Link href={"/vacancies/" + job.id} className="vacancy-card" key={job.id}>
            <div className="vacancy-card-top"><span className="vacancy-card-icon"><BriefcaseBusiness size={21} /></span></div>
            <h2>{job.title}</h2><p className="vacancy-company">{job.company_name}</p>
            <div className="vacancy-meta"><span><MapPin size={14} />{job.location}</span><span>{new Date(job.created_at).toLocaleDateString("en-IN")}</span></div>
            <div className="vacancy-card-bottom"><strong>View opportunity</strong><span>View details →</span></div>
          </Link>)}
        </section>}
      <p className="notice">Please verify the employer and job details before sharing personal information. Never pay money to secure a job.</p>
    </main>
  );
}
