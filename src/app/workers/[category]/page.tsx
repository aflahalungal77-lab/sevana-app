import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getListings } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

function normalizeIconPath(path: string | null | undefined, fallback = "/emojis/others.png") {
  if (!path?.trim()) return fallback;
  const value = path.trim();
  if (/^(https?:\/\/|data:)/i.test(value)) return value;
  const clean = value.replace(/^public\//, "").replace(/^\/+/, "");
  return "/" + clean;
}

export default async function WorkerCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const client = await createSupabaseServerClient();
  const { data: category } = client
    ? await client.from("service_categories").select("id,name,slug,icon_path").eq("kind", "worker").eq("slug", slug).maybeSingle()
    : { data: null };

  if (!category) return <div className="page premium-directory"><h1>Category not found</h1><Link href="/workers">Back to Workers</Link></div>;

  const listings = await getListings("worker", slug);
  const categoryKey = (slug + " " + category.name).toLowerCase().replace(/[_-]+/g, " ");
  const categoryIcon = categoryKey.includes("laterite") || categoryKey.includes("stone quarry")
    ? "/emojis/stone.png"
    : categoryKey.includes("plaster")
      ? "/emojis/masonry-work.png"
      : normalizeIconPath(category.icon_path || ("/emojis/" + slug + ".png"));

  return (
    <div className="page premium-directory">
      <header className="back-header">
        <Link href="/workers" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link>
        <img src={categoryIcon} alt={category.name} width={48} height={48} className="transport-emoji" />
        <div><h1>{category.name}</h1><p>Local worker directory</p></div>
      </header>
      {listings.length ? <div className="listing-list">{listings.map(item=><ListingCard key={item.id} item={item}/>)}</div> : (
        <div className="empty-state">
          <div className="empty-icon"><img src={categoryIcon} alt={category.name} width={56} height={56} className="transport-emoji"/></div>
          <h2>No workers listed yet</h2>
          <p>Worker details will appear here when added by the admin.</p>
        </div>
      )}
    </div>
  );
}
