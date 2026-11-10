"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, MapPin, Phone, MessageCircle, CalendarDays, ExternalLink, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Vacancy = {
  id: string; title: string; company_name: string; description: string;
  category: string; job_type: string; location: string; salary_min: number | null;
  salary_max: number | null; requirements: string | null; experience_required: string | null;
  minimum_age: number | null; contact_phone: string | null; contact_whatsapp: string | null;
  application_url: string | null; expires_at: string | null; created_at: string;
};

function salaryLabel(min: number | null, max: number | null) {
  const format = (value: number) => "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
  if (min == null && max == null) return "Not specified";
  if (min != null && max != null) return format(min) + " – " + format(max);
  return min != null ? "From " + format(min) : "Up to " + format(max!);
}

export default function VacancyDetailsPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase || !params.id) { setError("This vacancy is unavailable."); setLoading(false); return; }
      const now = new Date().toISOString();
      const { data, error: queryError } = await supabase.from("vacancies").select("*")
        .eq("id", params.id).eq("status", "published")
        .or("expires_at.is.null,expires_at.gt." + now).maybeSingle();
      if (!active) return;
      if (queryError || !data) setError("This vacancy may have expired or is no longer available.");
      else setJob(data as Vacancy);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [params.id]);

  const phone = job?.contact_phone?.replace(/[^+\d]/g, "");
  const whatsapp = job?.contact_whatsapp?.replace(/\D/g, "");

  return (
    <main className="page vacancy-detail-page">
      <header className="back-header">
        <Link href="/vacancies" className="back-button" aria-label="Back to vacancies"><ArrowLeft size={20} /></Link>
        <div><h1>Job details</h1><p>Sevana Vacancies</p></div>
      </header>
      {loading ? <div className="empty-inline"><LoaderCircle size={24} className="hotline-loading-spinner" /><span>Loading job details…</span></div>
        : error || !job ? <div className="empty-state"><h2>Vacancy unavailable</h2><p>{error}</p><Link href="/vacancies" className="button button-primary">Browse vacancies</Link></div>
        : <>
          <section className="vacancy-detail-hero">
            <span className="vacancy-card-icon"><img src="/emojis/vacancy.png" alt="" width={44} height={44} /></span>
            <span className="vacancy-type">{job.job_type}</span>
            <h1>{job.title}</h1>
            <p>{job.company_name}</p>
            <div className="vacancy-meta"><span><MapPin size={14} />{job.location}</span><span><CalendarDays size={14} />Posted {new Date(job.created_at).toLocaleDateString("en-IN")}</span></div>
            <strong className="vacancy-salary">{salaryLabel(job.salary_min, job.salary_max)}</strong>
          </section>
          <section className="vacancy-detail-section"><h2>About this role</h2><p>{job.description}</p></section>
          {job.requirements && <section className="vacancy-detail-section"><h2>Requirements</h2><p>{job.requirements}</p></section>}
          {(job.experience_required || job.minimum_age) && <section className="vacancy-detail-section"><h2>Eligibility</h2>{job.experience_required && <p>Experience: {job.experience_required}</p>}{job.minimum_age && <p>Minimum age: {job.minimum_age}+</p>}</section>}
          {job.expires_at && <p className="notice">Apply before {new Date(job.expires_at).toLocaleDateString("en-IN")}.</p>}
          <section className="vacancy-contact-actions">
            {phone && <a className="button button-primary" href={"tel:" + phone}><Phone size={17} /> Call employer</a>}
            {whatsapp && <a className="button button-secondary" href={"https://wa.me/" + whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a>}
            {job.application_url && <a className="button button-ghost" href={job.application_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={17} /> Apply online</a>}
          </section>
          <p className="notice">Sevana publishes these listings for community information. Verify the employer, job conditions and any payment requests independently. Never pay an advance fee to get a job.</p>
        </>}
    </main>
  );
}
