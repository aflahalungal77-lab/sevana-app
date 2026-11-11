import {DonorSearch} from "@/components/donor-search"; import {ArrowLeft,Droplet,HeartHandshake} from "lucide-react"; import Link from "next/link";
export default function DonorsPage(){return <main className="page premium-directory service-page">
<header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><span className="page-kicker">COMMUNITY SUPPORT</span><h1>Find a Donor</h1><p>Search registered donors by blood group</p></div></header>
<section className="service-hero service-hero-blood"><div className="service-hero-icon"><Droplet size={27}/></div><div><span className="service-hero-label">EVERY DONATION MATTERS</span><h2>Find a matching blood group.</h2><p>Select the required group to see available donor contacts.</p></div><HeartHandshake className="service-hero-watermark" size={104}/></section>
<DonorSearch/>
<p className="notice">Donor information is sensitive. Only use contact details for genuine blood donation coordination. Please verify availability directly.</p>
</main>}