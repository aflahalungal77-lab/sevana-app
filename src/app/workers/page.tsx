
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { workerCategories } from "@/lib/data";

const categoryMap = new Map(
  workerCategories.map((category) => [category.slug, category])
);

const groups = [
  {
    title: "Construction",
    subtitle: "Building and finishing work",
    slug: "construction",
    items: [
      {
        slug: "masonry-work",
        description: "Masonry and brick work",
      },
      {
        slug: "carpenter",
        description: "Doors, furniture and wood work",
      },
      {
        slug: "tiles-marble",
        description: "Tiles and marble fitting",
      },
    ],
  },
  {
    title: "Plumbing & Wiring",
    subtitle: "Plumbing and electrical services",
    slug: "plumbing-wiring",
    items: [
      {
        slug: "plumbing-wiring",
        description: "Plumbers and electricians",
      },
    ],
  },
  {
    title: "Home Maintenance",
    subtitle: "Help to maintain your home",
    slug: "home-maintenance",
    items: [
      {
        slug: "painters",
        description: "Interior and exterior painting",
      },
      {
        slug: "welders",
        description: "Welding and metal work",
      },
      {
        slug: "home-workers",
        description: "General home help",
      },
      {
        slug: "garden-services",
        description: "Garden care and maintenance",
      },
    ],
  },
  {
    title: "Agricultural Works",
    subtitle: "Agriculture and local farm work",
    slug: "agricultural-works",
    items: [
      {
        slug: "agricultural-works",
        description: "Agricultural and farming work",
      },
    ],
  },
];

export default function WorkersPage() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

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
          <section
            className="worker-parent-card"
            key={group.title}
          >
            <div className="worker-parent-heading">
              <span className="worker-parent-icon">
                <Image
                  src={`/emojis/${group.slug}.png`}
                  alt=""
                  width={32}
                  height={32}
                  className="worker-emoji"
                />
              </span>

              <div className="worker-parent-copy">
                <h2>{group.title}</h2>
                <p>{group.subtitle}</p>
                <small>
                  {group.items.length} service categories
                </small>
              </div>
            </div>

            <div className="worker-child-grid">
              {group.items.map(({ slug, description }) => {
                const category = categoryMap.get(slug);

                if (!category) return null;

                const isLoading = loadingSlug === slug;

                return (
                  <Link
                    key={slug}
                    href={`/workers/${slug}`}
                    prefetch={true}
                    onClick={() => setLoadingSlug(slug)}
                    aria-busy={isLoading}
                    className={`worker-child-card ${
                      isLoading ? "category-row-loading" : ""
                    }`}
                  >
                    <span className={`category-icon icon-${slug}`}>
                      <Image
                        src={`/emojis/${slug}.png`}
                        alt=""
                        width={36}
                        height={36}
                        className="worker-emoji"
                      />
                    </span>

                    <span className="worker-child-text">
                      <strong>{category.name}</strong>
                      <small>{description}</small>
                    </span>

                    {isLoading ? (
                      <LoaderCircle
                        size={20}
                        className="hotline-loading-spinner"
                        aria-label="Loading"
                      />
                    ) : (
                      <ChevronRight
                        size={18}
                        className="row-chevron"
                      />
                    )}
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
