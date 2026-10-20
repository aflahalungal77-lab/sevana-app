import Link from "next/link";
import { ArrowLeft, PhoneCall } from "lucide-react";
import { hotlineCategories, getListings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function HotlineCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = hotlineCategories.find((item) => item.slug === slug);
  if (!category) return <div className="page"><h1>Category not found</h1><Link href="/hotlines">Back to Hotlines</Link></div>;
  const listings = await getListings("hotline", slug);
  return <div className="page">
    <header className="back-header"><Link href="/hotlines" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>{category.name}</h1><p>Local contact directory</p></div></header>
    {listings.length ? <div className="listing-list">{listings.map((item) => <ListingCard key={item.id} item={item}/>)}</div> :
      <div className="empty-state"><div className="empty-icon"><PhoneCall size={25}/></div><h2>No contacts added yet</h2><p>The admin can add verified {category.name.toLowerCase()} contacts. Check back soon.</p><Link className="button button-secondary" href="/admin/login">Admin login</Link></div>}
  </div>;
}
