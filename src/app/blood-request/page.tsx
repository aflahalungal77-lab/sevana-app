import { ArrowLeft, HeartPulse } from "lucide-react";
import Link from "next/link";
import { BloodRequestForm } from "@/components/blood-request-form";

export default function BloodRequestPage() {
  return <div className="page">
    <header className="back-header"><Link href="/" className="back-button" aria-label="Back"><ArrowLeft size={20}/></Link><div><h1>Need Blood</h1><p>Submit a blood request</p></div></header>
    <div className="intro-panel"><div className="intro-icon blood-intro"><HeartPulse size={22}/></div><div><h2>Blood request details</h2><p>Enter accurate information so people can respond.</p></div></div>
    <BloodRequestForm />
  </div>;
}
