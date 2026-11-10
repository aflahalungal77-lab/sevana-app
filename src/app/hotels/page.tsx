import Link from "next/link";
import { ArrowLeft, Hotel } from "lucide-react";
import { getListings } from "@/lib/data";
import { HospitalityDirectory } from "@/components/hospitality-directory";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const listings = await getListings("hotel");

  return (
    <main className="page">
      <header className="back-header">
        <Link href="/" className="back-button" aria-label="Back to home"><ArrowLeft size={20} /></Link>
        <span className="category-icon icon-hotels"><Hotel size={25} /></span>
        <div><h1>Hotels & Restaurants</h1><p>Find places to stay and eat nearby</p></div>
      </header>
      <div className="intro-panel">
        <div className="intro-icon"><Hotel size={22} /></div>
        <div><h2>Explore local places</h2><p>Search by name, phone number or location, and filter hotels and restaurants.</p></div>
      </div>
      <HospitalityDirectory listings={listings} />
      <p className="notice">Please contact the business directly to confirm availability, prices and services.</p>
    </main>
  );
}
