"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Droplet, UserRound } from "lucide-react";

const links = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/services", label: "Services", Icon: LayoutGrid },
  { href: "/donors", label: "Blood", Icon: Droplet },
  { href: "/profile", label: "About", Icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {links.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return <Link key={href} href={href} className={`bottom-nav-item ${active ? "active" : ""}`}>
          <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
          <span>{label}</span>
        </Link>;
      })}
    </nav>
  );
}
