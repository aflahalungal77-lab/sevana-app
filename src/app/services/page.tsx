import { PhoneCall, CarFront, Droplet, HeartPulse, Wrench } from "lucide-react";
import { ServiceCard } from "@/components/service-card";

export default function ServicesPage() {
  return <div className="page">
    <header className="page-header"><p className="eyebrow">SEVANA DIRECTORY</p><h1>All services</h1><p>Choose what you need and find the right contact.</p></header>
    <div className="stack-cards">
      <ServiceCard href="/hotlines" title="Hotlines" description="Hospitals, ambulance and important contacts" Icon={PhoneCall} tone="rose" />
      <ServiceCard href="/transport" title="Taxi & Transport" description="Cars, auto, tourist bus and rentals" Icon={CarFront} tone="blue" />
      <ServiceCard href="/donors" title="Find a blood donor" description="Search available donors by blood group" Icon={Droplet} tone="rose" />
      <ServiceCard href="/blood-request" title="Need Blood" description="Send a blood request through WhatsApp" Icon={HeartPulse} tone="green" />
      <ServiceCard href="/workers" title="Workers" description="Plumbing, wiring, repairs and more" Icon={Wrench} tone="amber" />
    </div>
  </div>;
}
