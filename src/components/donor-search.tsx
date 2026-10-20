"use client";

import { useState } from "react";
import { Search, Droplet } from "lucide-react";
import { findDonors } from "@/lib/data";
import type { Donor } from "@/lib/types";
import { DonorCard } from "@/components/listing-card";

const groups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function DonorSearch() {
  const [group, setGroup] = useState("All");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const results = await findDonors(group === "All" ? undefined : group);
    setDonors(results);
    setSearched(true);
    setLoading(false);
  }

  return <section className="form-card">
    <label className="field-label" htmlFor="blood-group">Blood group</label>
    <select id="blood-group" className="field-control" value={group} onChange={(e) => setGroup(e.target.value)}>
      {groups.map((value) => <option key={value} value={value}>{value === "All" ? "All blood groups" : value}</option>)}
    </select>
    <button className="button button-primary button-full" onClick={search} disabled={loading}><Search size={17}/>{loading ? "Searching..." : "Find Donors"}</button>
    {searched && (donors.length ? <div className="result-list"><p className="result-count">{donors.length} donor{donors.length === 1 ? "" : "s"} found</p>{donors.map((donor) => <DonorCard key={donor.id} donor={donor}/>)}</div> :
      <div className="empty-inline"><Droplet size={21}/><strong>No donors found</strong><p>No matching donors are listed yet. Try another group later.</p></div>)}
  </section>;
}
