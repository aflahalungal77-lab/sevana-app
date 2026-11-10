"use client";

import { useMemo, useState } from "react";
import { Search, Hotel, Utensils, SlidersHorizontal } from "lucide-react";
import type { ServiceListing } from "@/lib/types";
import { ListingCard } from "@/components/listing-card";

type Filter = "all" | "hotels" | "restaurants";

export function HospitalityDirectory({ listings }: { listings: ServiceListing[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return listings.filter((item) => {
      const typeMatches = filter === "all" || item.category_slug === filter;
      const searchable = [item.name, item.phone, item.area, item.address, item.description]
        .filter(Boolean).join(" ").toLocaleLowerCase();
      return typeMatches && (!term || searchable.includes(term));
    });
  }, [listings, filter, search]);

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: listings.length },
    { value: "hotels", label: "Hotels", count: listings.filter((x) => x.category_slug === "hotels").length },
    { value: "restaurants", label: "Restaurants", count: listings.filter((x) => x.category_slug === "restaurants").length },
  ];

  return (
    <section className="hospitality-directory">
      <label className="directory-search" htmlFor="hospitality-search">
        <Search size={18} />
        <input id="hospitality-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, place, area or phone number..." />
      </label>

      <div className="directory-filter-row" role="group" aria-label="Filter by listing type">
        {filters.map((item) => (
          <button key={item.value} type="button" onClick={() => setFilter(item.value)}
            className={`directory-filter-chip ${filter === item.value ? "active" : ""}`}
            aria-pressed={filter === item.value}>
            {item.value === "hotels" ? <Hotel size={15} /> : item.value === "restaurants" ? <Utensils size={15} /> : <SlidersHorizontal size={15} />}
            <span>{item.label}</span><small>{item.count}</small>
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="listing-list">
          {visible.map((item) => <ListingCard key={item.id} item={item} label="Call" />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{filter === "restaurants" ? <Utensils size={28} /> : <Hotel size={28} />}</div>
          <h2>{search ? "No matching places found" : filter === "restaurants" ? "No restaurants listed yet" : filter === "hotels" ? "No hotels listed yet" : "No listings yet"}</h2>
          <p>{search ? "Try another name, phone number or location." : "Listings added by the Sevana admin will appear here."}</p>
        </div>
      )}
      <p className="directory-result-count">Showing {visible.length} of {listings.length} places</p>
    </section>
  );
}
