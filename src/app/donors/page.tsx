import { DonorSearch } from "@/components/donor-search";
import { ArrowLeft, Droplet } from "lucide-react";
import Link from "next/link";

export default function DonorsPage() {
  return <div className="page">
    <header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>Find a Donor</h1><p>Search by blood group</p></div></header>
    <div className="intro-panel"><div className="intro-icon blood-intro"><Droplet size={22}/></div><div><h2>Find a matching donor</h2><p>Choose the blood group you need.</p></div></div>
    <DonorSearch />
    <p className="notice">Donor information is sensitive. Only use contact details for genuine blood donation coordination. Please verify availability directly.</p>
  </div>;
}
