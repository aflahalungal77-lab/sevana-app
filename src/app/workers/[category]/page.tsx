
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { workerCategories, getListings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function WorkerCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;

  const category = workerCategories.find(
    (item) => item.slug === slug
  );

  if (!category) {
    return (
      <div className="page">
        <h1>Category not found</h1>
        <Link href="/workers">Back to Workers</Link>
      </div>
    );
  }

  const listings = await getListings("worker", slug);

  return (
    <div className="page">
      <header className="back-header">
        <Link
          href="/workers"
          className="back-button"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </Link>

        <Image
          src={`/emojis/${slug}.png`}
          alt={category.name}
          width={48}
          height={48}
          className="transport-emoji"
        />

        <div>
          <h1>{category.name}</h1>
          <p>Local worker directory</p>
        </div>
      </header>

      {listings.length ? (
        <div className="listing-list">
          {listings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Image
              src={`/emojis/${slug}.png`}
              alt={category.name}
              width={56}
              height={56}
              className="transport-emoji"
            />
          </div>

          <h2>No workers listed yet</h2>

          <p>
            Worker details will appear here when added by the
            admin.
          </p>
        </div>
      )}
    </div>
  );
}
