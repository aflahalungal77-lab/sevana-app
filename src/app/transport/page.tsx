
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CarFront,
  ChevronRight,
} from "lucide-react";
import { transportCategories } from "@/lib/data";

const descriptions: Record<string, string> = {
  cars: "Local trips and longer journeys",
  auto: "Nearby rides and short trips",
  "tourist-bus": "Group travel and tours",
  "rent-a-car": "Rental vehicle services",
  "goods-lorry": "Goods transport, pickups and lorry services",
};

export default function TransportPage() {
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
          <h1>Taxi Services</h1>
          <p>
            {process.env.NEXT_PUBLIC_APP_LOCATION ||
              "Meenarkuzhi, Malappuram"}
          </p>
        </div>
      </header>

      <div className="intro-panel">
        <div className="intro-icon">
          <CarFront size={22} />
        </div>

        <div>
          <h2>Where do you need to go?</h2>
          <p>
            Choose a transport category to find local contacts.
          </p>
        </div>
      </div>

      <div className="category-list">
        {transportCategories.map((category) => (
          <Link
            key={category.id}
            href={`/transport/${category.slug}`}
            className="category-row"
          >
            <span
              className={`category-icon icon-${category.slug}`}
            >
              <Image
                src={`/emojis/${category.slug}.png`}
                alt={category.name}
                width={40}
                height={40}
                className="transport-emoji"
              />
            </span>

            <span className="category-text">
              <strong>{category.name}</strong>
              <small>
                {descriptions[category.slug] ||
                  "Local transport services"}
              </small>
            </span>

            <ChevronRight
              size={18}
              className="row-chevron"
            />
          </Link>
        ))}
      </div>

      <p className="notice">
        Driver listings are added by the local admin. Confirm
        fares and availability directly with the driver.
      </p>
    </div>
  );
}
