
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sevana Admin",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    title: "Sevana Admin",
    statusBarStyle: "default",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
