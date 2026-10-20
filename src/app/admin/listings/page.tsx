import { AdminListingManager } from "@/components/admin-listing-manager";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; category?: string }>;
}) {
  const { kind = "hotline", category } = await searchParams;
  const allowed = ["hotline", "transport", "worker"];
  const safeKind = allowed.includes(kind) ? kind : "hotline";
  return (
    <AdminListingManager
      kind={safeKind as "hotline" | "transport" | "worker"}
      selectedCategory={category}
    />
  );
}
