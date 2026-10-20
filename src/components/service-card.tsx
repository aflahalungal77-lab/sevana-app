import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function ServiceCard({ href, title, description, Icon, tone = "green" }: {
  href: string; title: string; description?: string; Icon: LucideIcon; tone?: "green" | "mint" | "amber" | "rose" | "blue";
}) {
  return <Link href={href} className={`service-card tone-${tone}`}>
    <div className="service-icon"><Icon size={22} strokeWidth={1.9} /></div>
    <div className="service-card-copy"><h3>{title}</h3>{description && <p>{description}</p>}</div>
    <ArrowUpRight className="service-arrow" size={18} />
  </Link>;
}
