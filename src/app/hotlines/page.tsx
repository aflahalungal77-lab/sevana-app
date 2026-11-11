"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, PhoneCall, LoaderCircle, ShieldCheck } from "lucide-react";
import { hotlineCategories } from "@/lib/data";
const descriptions: Record<string,string> = {
  hospital:"Hospitals and medical assistance", ambulance:"Emergency ambulance services",
  "police-station":"Police and public safety", "fire-station":"Fire and rescue services",
  "blood-banks":"Blood bank contacts", kseb:"Electricity and utility support",
  "cyber-crime":"Cyber safety and online fraud support",
  "child-line":"Child protection and support"
};
export default function HotlinesPage(){
 const [loadingSlug,setLoadingSlug]=useState<string|null>(null);
 return <main className="page premium-directory service-page">
  <header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><span className="page-kicker">COMMUNITY DIRECTORY</span><h1>Hotlines</h1><p>Important local contacts, all in one place</p></div></header>
  <section className="service-hero service-hero-red"><div className="service-hero-icon"><PhoneCall size={25}/></div><div><span className="service-hero-label">NEED HELP?</span><h2>Find the right contact quickly.</h2><p>Choose a service below to view available phone numbers and local support.</p></div><ShieldCheck className="service-hero-watermark" size={100}/></section>
  <div className="service-section-heading"><div><span className="page-kicker">BROWSE SERVICES</span><h2>Contact categories</h2></div><span className="category-count">{hotlineCategories.length} categories</span></div>
  <div className="premium-category-grid">{hotlineCategories.map((category,index)=>{const busy=loadingSlug===category.slug;return <Link key={category.id} href={"/hotlines/"+category.slug} onClick={()=>setLoadingSlug(category.slug)} aria-busy={busy} className="premium-category-card"><span className="premium-card-index">{String(index+1).padStart(2,"0")}</span><span className="premium-card-icon"><Image src={category.icon||(category.slug==="cyber-crime"?"/emojis/cyber.png":"/emojis/"+category.slug+".png")} alt="" width={48} height={48}/></span><span className="premium-card-copy"><strong>{category.name}</strong><small>{descriptions[category.slug]||"Local support and important contacts"}</small></span><span className="premium-card-action">{busy?<LoaderCircle size={18} className="hotline-loading-spinner"/>:<ChevronRight size={19}/>}</span></Link>})}</div>
  <p className="notice">For immediate danger, use verified official emergency numbers. This directory may be incomplete until local contacts are added.</p>
 </main>;
}