import Link from "next/link";
import { ArrowLeft, Hotel, MapPin } from "lucide-react";
import { getListings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const hotels = await getListings("hotel", "hotels");

  return (
    <main className="page">
      <header className="back-header">
        <Link href="/" className="back-button" aria-label="Back to home">
          <ArrowLeft size={20} />
        </Link>
        <span className="category-icon icon-hotels"><Hotel size={25} /></span>
        <div>
          <h1>Hotels</h1>
          <p>Find local hotels and accommodation</p>
        </div>
      </header>

      <div className="intro-panel">
        <div className="intro-icon"><MapPin size={22} /></div>
        <div>
          <h2>Stay around your community</h2>
          <p>Browse hotel contacts and call them directly for room availability and details.</p>
        </div>
      </div>

      {hotels.length ? (
        <div className="listing-list">
          {hotels.map((item) => <ListingCard key={item.id} item={item} label="Call" />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Hotel size={28} /></div>
          <h2>No hotels listed yet</h2>
          <p>Hotel listings added by the Sevana admin will appear here.</p>
        </div>
      )}
      <p className="notice">Please contact the hotel directly to confirm room availability, rates and facilities.</p>
    </main>
  );
}
