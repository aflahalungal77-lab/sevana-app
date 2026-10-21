
import Image from "next/image";
import {
  MapPin,
  Phone,
  Building2,
  Navigation,
  HeartPulse,
} from "lucide-react";

import type { ServiceListing, Donor } from "@/lib/types";

export function ListingCard({
  item,
  label = "Call",
}: {
  item: ServiceListing;
  label?: string;
}) {
  const phone = item.phone.replace(/[^\d+]/g, "");

  const slug = item.category_slug || "";

  const imageMap: Record<string, string> = {
    hospital: "hospital",
    ambulance: "ambulance",
    "police-station": "police-station",
    "fire-station": "fire-station",
    "blood-banks": "blood-banks",
    "child-line": "child-line",
    "medical-shop": "medical-shop",
    "doctors-clinic": "doctors-clinic",
    cars: "cars",
    auto: "auto",
    "tourist-bus": "tourist-bus",
    "rent-a-car": "rent-a-car",
    "goods-lorry": "goods-lorry",
    kseb: "kseb",
    "plumbing-wiring": "plumbing-wiring",
    "masonry-work": "masonry-work",
    carpenter: "carpenter",
    "tiles-marble": "tiles-marble",
    painters: "painters",
    welders: "welders",
    "home-workers": "home-workers",
    "garden-services": "garden-services",
    "agricultural-works": "agricultural-works",
    repair: "repair",
    construction: "construction",
    painting: "painting",
  };

  const imageName = imageMap[slug];

  return (
    <article className="listing-card premium-listing-card">
      <div
        className={`listing-icon premium-listing-icon category-${slug || "general"}`}
      >
        {imageName ? (
          <Image
            src={`/emojis/${imageName}.png`}
            alt={item.category_slug || "Service"}
            width={48}
            height={48}
            className="listing-emoji"
          />
        ) : (
          <Building2 size={22} strokeWidth={2} />
        )}
      </div>

      <div className="listing-main premium-listing-main">
        <h3>{item.name}</h3>

        {item.description && (
          <p className="premium-listing-description">
            {item.description}
          </p>
        )}

        <div className="listing-meta premium-listing-meta">
          {item.area && (
            <span>
              <MapPin size={14} />
              {item.area}
            </span>
          )}

          {item.vehicle_type && (
            <span>
              {item.vehicle_type}
            </span>
          )}
        </div>

        {item.address && (
          <p className="listing-address premium-listing-address">
            <Navigation size={13} />
            <span>{item.address}</span>
          </p>
        )}
      </div>

      <a
        className="call-button premium-call-button"
        href={`tel:${phone}`}
        aria-label={`${label} ${item.name}`}
      >
        <Phone size={16} strokeWidth={2.3} />
        <span>{label}</span>
      </a>
    </article>
  );
}

export function DonorCard({ donor }: { donor: Donor }) {
  const phone = donor.phone.replace(/[^\d+]/g, "");

  return (
    <article className="listing-card donor-card premium-listing-card premium-donor-card">
      <div className="blood-badge premium-blood-badge">
        <HeartPulse size={15} />
        <span>{donor.blood_group}</span>
      </div>

      <div className="listing-main premium-listing-main">
        <h3>{donor.name}</h3>

        <div className="listing-meta premium-listing-meta">
          <span>
            <MapPin size={14} />
            {donor.area}
          </span>
        </div>

        <p className="privacy-note premium-privacy-note">
          <HeartPulse size={13} />
          <span>
            Contact for blood donation coordination
          </span>
        </p>
      </div>

      <a
        className="call-button premium-call-button premium-donor-call"
        href={`tel:${phone}`}
        aria-label={`Call donor ${donor.name}`}
      >
        <Phone size={16} strokeWidth={2.3} />
        <span>Call</span>
      </a>
    </article>
  );
}
