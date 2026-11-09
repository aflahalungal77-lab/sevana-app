"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, MapPin, Search, CalendarDays, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Vacancy = {
  id: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  expires_at: string | null;
  created_at: string;
};

function salaryLabel(min: number | null, max: number | null) {
  if (min == null && max == null) return "Salary not specified";
  const format = (value: number) => "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
  if (min != null && max != null) return format(min) + " – " + format(max);
  return (min != null ? "From " + format(min) : "Up to " + format(max!));
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) {
        setError("Vacancies are not configured yet.");
        setLoading(false);
        return;
      }
      const now = new Date().toISOString();
      const { data, error: queryError } = await supabase
        .from("vacancies")
        .select("id,title,company_name,category,job_type,location,salary_min,salary_max,expires_at,created_at")
        .eq("status", "published")
        .or("expires_at.is.null,expires_at.gt." + now)
        .order("created_at", { ascending: false });
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
    return vacancies.filter((job) => {
      const matchesType = jobType === "All" || job.job_type === jobType;
      const matchesSearch = !query || [job.title, job.company_name, job.location, job.category]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [vacancies, search, jobType]);

  return (
    <main className="page vacancies-page">
      <header className="back-header">
        <Link href="/" className="back-button" aria-label="Back to home"><ArrowLeft size={20} /></Link>
        <div><h1>Vacancies</h1><p>Local job opportunities around your community</p></div>
      </header>

      <section className="intro-panel">
        <div className="intro-icon"><BriefcaseBusiness size={22} /></div>
        <div><h2>Find your next opportunity</h2><p>Job listings published by the Sevana admin team.</p></div>
      </section>

      <label className="vacancy-search">
        <Search size={18} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search job, company or location" aria-label="Search vacancies" />
      </label>

      <div className="vacancy-filters" aria-label="Filter by job type">
        {["All", "Full-time", "Part-time", "Temporary", "Internship", "Contract"].map((type) => (
          <button key={type} type="button" className={jobType === type ? "vacancy-filter active" : "vacancy-filter"} onClick={() => setJobType(type)}>{type === "All" ? "All jobs" : type}</button>
        ))}
      </div>

      {loading ? <div className="empty-inline"><LoaderCircle size={24} className="hotline-loading-spinner" /><span>Loading vacancies…</span></div>
        : error ? <div className="empty-state"><h2>Vacancies unavailable</h2><p>{error}</p></div>
        : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={25} /></div><h2>No vacancies found</h2><p>{vacancies.length ? "Try another search or job type." : "New local job opportunities will appear here when published."}</p></div>
        : <section className="vacancy-list" aria-label="Available vacancies">
          <p className="result-count">{filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} available</p>
          {filtered.map((job) => (
            <Link href={"/vacancies/" + job.id} className="vacancy-card" key={job.id}>
              <div className="vacancy-card-top">
                <span className="vacancy-card-icon"><BriefcaseBusiness size={21} /></span>
                <span className="vacancy-type">{job.job_type}</span>
              </div>
              <h2>{job.title}</h2>
              <p className="vacancy-company">{job.company_name}</p>
              <div className="vacancy-meta"><span><MapPin size={14} />{job.location}</span><span><CalendarDays size={14} />{new Date(job.created_at).toLocaleDateString("en-IN")}</span></div>
              <div className="vacancy-card-bottom"><strong>{salaryLabel(job.salary_min, job.salary_max)}</strong><span>View details →</span></div>
            </Link>
          ))}
        </section>}

      <p className="notice">Please verify the employer and job details independently before sharing personal information or accepting an offer. Never pay money to secure a job.</p>
    </main>
  );
}
