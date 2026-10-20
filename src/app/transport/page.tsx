import Link from "next/link";
import { ArrowLeft, CarFront, BusFront, KeyRound, ChevronRight, Truck } from "lucide-react";
import { transportCategories } from "@/lib/data";

const descriptions: Record<string, string> = {
  cars: "Local trips and longer journeys",
  auto: "Nearby rides and short trips",
  "tourist-bus": "Group travel and tours",
  "rent-a-car": "Rental vehicle services",
  "goods-lorry": "Goods transport, pickups and lorry services"
};
const icons: Record<string, React.ComponentType<{size?: number}>> = {
  cars: CarFront, auto: Truck, "tourist-bus": BusFront, "rent-a-car": KeyRound, "goods-lorry": Truck
};

export default function TransportPage() {
  return <div className="page">
    <header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>Taxi Services</h1><p>{process.env.NEXT_PUBLIC_APP_LOCATION || "Meenarkuzhi, Malappuram"}</p></div></header>
    <div className="intro-panel"><div className="intro-icon"><CarFront size={22}/></div><div><h2>Where do you need to go?</h2><p>Choose a transport category to find local contacts.</p></div></div>
    <div className="category-list">
      {transportCategories.map((category) => {
        const Icon = icons[category.slug] || CarFront;
        return <Link key={category.id} href={`/transport/${category.slug}`} className="category-row">
          <span className={`category-icon icon-${category.slug}`}><Icon size={20}/></span><span className="category-text"><strong>{category.name}</strong><small>{descriptions[category.slug]}</small></span><ChevronRight size={18} className="row-chevron"/>
        </Link>;
      })}
    </div>
    <p className="notice">Driver listings are added by the local admin. Confirm fares and availability directly with the driver.</p>
  </div>;
}
