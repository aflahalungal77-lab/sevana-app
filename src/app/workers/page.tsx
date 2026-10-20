
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Zap,
  Home,
  Hammer,
  Layers,
  Paintbrush,
  ChevronRight,
  House,
  Flower2,
  Sprout,
  Tractor,
} from "lucide-react";
import { workerCategories } from "@/lib/data";

const categoryMap = new Map(
  workerCategories.map((category) => [category.slug, category])
);

const groups = [
  {
    title: "Construction",
    subtitle: "Building and finishing work",
    Icon: Home,
    items: [
      { slug: "masonry-work", Icon: Layers, description: "Masonry and brick work" },
      { slug: "carpenter", Icon: Hammer, description: "Doors, furniture and wood work" },
      { slug: "tiles-marble", Icon: Layers, description: "Tiles and marble fitting" },
    ],
  },
  {
    title: "Plumbing & Wiring",
    subtitle: "Plumbing and electrical services",
    Icon: Zap,
    items: [
      { slug: "plumbing-wiring", Icon: Zap, description: "Plumbers and electricians" },
    ],
  },
  {
    title: "Home Maintenance",
    subtitle: "Help to maintain your home",
    Icon: House,
    items: [
      { slug: "painters", Icon: Paintbrush, description: "Interior and exterior painting" },
      { slug: "welders", Icon: Hammer, description: "Welding and metal work" },
      { slug: "home-workers", Icon: Wrench, description: "General home help" },
      { slug: "garden-services", Icon: Flower2, description: "Garden care and maintenance" },
    ],
  },
  {
    title: "Agricultural Works",
    subtitle: "Agriculture and local farm work",
    Icon: Tractor,
    items: [
      { slug: "agricultural-works", Icon: Sprout, description: "Agricultural and farming work" },
    ],
  },
];

export default function WorkersPage() {
  return (
    <main className="page workers-page">
      <header className="back-header">
        <Link href="/" className="back-button" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Local Workers</h1>
          <p>Find skilled help around you</p>
        </div>
      </header>

      <div className="intro-panel">
        <div className="intro-icon">
          <Wrench size={22} />
        </div>
        <div>
          <h2>What do you need help with?</h2>
          <p>Select a service to view worker contacts.</p>
        </div>
      </div>

      <div className="worker-category-groups">
        {groups.map((group) => (
          <section className="worker-parent-card" key={group.title}>
            {/* Parent card */}
            <div className="worker-parent-heading">
              <span className="worker-parent-icon">
                <group.Icon size={23} />
              </span>
              <div className="worker-parent-copy">
                <h2>{group.title}</h2>
                <p>{group.subtitle}</p>
                <small>{group.items.length} service categories</small>
              </div>
            </div>

            {/* Child cards */}
            <div className="worker-child-grid">
              {group.items.map(({ slug, Icon, description }) => {
                const category = categoryMap.get(slug);

                if (!category) return null;

                return (
                  <Link
                    key={slug}
                    href={`/workers/${slug}`}
                    className="worker-child-card"
                  >
                    <span className={`category-icon icon-${slug}`}>
                      <Icon size={21} />
                    </span>

                    <span className="worker-child-text">
                      <strong>{category.name}</strong>
                      <small>{description}</small>
                    </span>

                    <ChevronRight size={18} className="row-chevron" />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
