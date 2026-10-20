
import {
  MapPin,
  Phone,
  CarFront,
  Building2,
  Navigation,
  HeartPulse,
  Ambulance,
  Shield,
  Flame,
  Baby,
  Pill,
  Stethoscope,
  BusFront,
  KeyRound,
  Zap, Paintbrush, HardHat, Wrench, Hospital,
  Hammer, House, Flower2, Sprout, Truck, Layers,
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
  const iconMap: Record<string, typeof Building2> = {
    hospital: Hospital, ambulance: Ambulance, "police-station": Shield,
    "fire-station": Flame, "blood-banks": HeartPulse, "child-line": Baby,
    "medical-shop": Pill, "doctors-clinic": Stethoscope, cars: CarFront,
    auto: CarFront, "tourist-bus": BusFront, "rent-a-car": KeyRound, "goods-lorry": Truck, kseb: Zap,
    "plumbing-wiring": Zap, "masonry-work": Layers, carpenter: Hammer, "tiles-marble": Layers,
    painters: Paintbrush, welders: Hammer, "home-workers": House, "garden-services": Flower2,
    "agricultural-works": Sprout, repair: Wrench, construction: HardHat, painting: Paintbrush,
  };
  const ListingIcon = item.category_slug
    ? iconMap[item.category_slug] || (item.vehicle_type ? CarFront : Building2)
    : item.vehicle_type ? CarFront : Building2;

  return (
    <article className="listing-card premium-listing-card">
      <div className={`listing-icon premium-listing-icon category-${item.category_slug || "general"}`}>
        <ListingIcon size={22} strokeWidth={2} />
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
              <CarFront size={14} />
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
          <span>Contact for blood donation coordination</span>
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
