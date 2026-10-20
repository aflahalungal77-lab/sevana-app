import Link from "next/link";
import { ArrowLeft, ChevronRight, PhoneCall, Hospital, Ambulance, Shield, Flame, Droplet, Baby, Pill, Stethoscope, Zap } from "lucide-react";
import { hotlineCategories } from "@/lib/data";

const icons: Record<string, React.ComponentType<{size?: number}>> = {
  hospital: Hospital, ambulance: Ambulance, "police-station": Shield, "fire-station": Flame,
  "blood-banks": Droplet, "child-line": Baby, "medical-shop": Pill, "doctors-clinic": Stethoscope, kseb: Zap
};

export default function HotlinesPage() {
  return <div className="page">
    <header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>Hotlines</h1><p>Important local contacts</p></div></header>
    <div className="intro-panel"><div className="intro-icon"><PhoneCall size={22}/></div><div><h2>Who do you need?</h2><p>Select a category to view contact numbers.</p></div></div>
    <div className="category-list">
      {hotlineCategories.map((category) => {
        const Icon = icons[category.slug] || PhoneCall;
        return <Link key={category.id} href={`/hotlines/${category.slug}`} className="category-row">
          <span className={`category-icon icon-${category.slug}`}><Icon size={20}/></span><span className="category-title">{category.name}</span><ChevronRight size={18} className="row-chevron"/>
        </Link>;
      })}
    </div>
    <p className="notice">For immediate danger, use verified official emergency numbers. This directory may be incomplete until local contacts are added.</p>
  </div>;
}
