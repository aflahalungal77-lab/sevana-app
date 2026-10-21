
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  LoaderCircle,
} from "lucide-react";
import { hotlineCategories } from "@/lib/data";

export default function HotlinesPage() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(
    null
  );

  return (
    <div className="page">
      <header className="back-header">
        <Link
          href="/"
          className="back-button"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1>Hotlines</h1>
          <p>Important local contacts</p>
        </div>
      </header>

      <div className="intro-panel">
        <div className="intro-icon">
          <PhoneCall size={22} />
        </div>

        <div>
          <h2>Who do you need?</h2>
          <p>Select a category to view contact numbers.</p>
        </div>
      </div>

      <div className="category-list">
        {hotlineCategories.map((category) => {
          const isLoading = loadingSlug === category.slug;

          return (
            <Link
              key={category.id}
              href={`/hotlines/${category.slug}`}
              prefetch={true}
              onClick={() => setLoadingSlug(category.slug)}
              aria-busy={isLoading}
              className={`category-row ${
                isLoading ? "category-row-loading" : ""
              }`}
            >
              <span
                className={`category-icon icon-${category.slug}`}
              >
                <Image
                  src={`/emojis/${category.slug}.png`}
                  alt={category.name}
                  width={40}
                  height={40}
                  className="hotline-emoji"
                />
              </span>

              <span className="category-title">
                {category.name}
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

      <p className="notice">
        For immediate danger, use verified official emergency
        numbers. This directory may be incomplete until local
        contacts are added.
      </p>
    </div>
  );
}
