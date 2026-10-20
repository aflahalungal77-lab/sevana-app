import Link from "next/link";
import { ArrowLeft, CarFront } from "lucide-react";
import { transportCategories, getListings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function TransportCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = transportCategories.find((item) => item.slug === slug);
  if (!category) return <div className="page"><h1>Category not found</h1><Link href="/transport">Back to Taxi</Link></div>;
  const listings = await getListings("transport", slug);
  return <div className="page">
    <header className="back-header"><Link href="/transport" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>{category.name}</h1><p>Local transport contacts</p></div></header>
    {listings.length ? <div className="listing-list">{listings.map((item) => <ListingCard key={item.id} item={item}/>)}</div> :
      <div className="empty-state"><div className="empty-icon"><CarFront size={25}/></div><h2>No drivers listed yet</h2><p>Local drivers and transport providers will appear here after the admin adds them.</p></div>}
  </div>;
}
