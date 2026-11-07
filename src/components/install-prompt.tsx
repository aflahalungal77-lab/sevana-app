"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, X, Smartphone } from "lucide-react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function InstallPrompt() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const dismissed = sessionStorage.getItem("sevana-install-dismissed");
    if (!dismissed) setShow(true);

    const handler = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as InstallEvent;
      (window as Window & { __sevanaInstallPrompt?: InstallEvent }).__sevanaInstallPrompt = promptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function install() {
    setShow(false);
    router.push("/install");
  }

  function continueOnWebsite() {
    sessionStorage.setItem("sevana-install-dismissed", "1");
    setShow(false);
    window.dispatchEvent(new Event("sevana:start-splash"));
  }

  if (!show) return null;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="install-modal" role="dialog" aria-modal="true" aria-labelledby="install-title">
        <button className="icon-button modal-close" aria-label="Close" onClick={continueOnWebsite}><X size={18} /></button>
        <div className="install-logo"><Smartphone size={28} /></div>
        <p className="eyebrow">YOUR LOCAL SERVICES, ONE APP</p>
        <h2 id="install-title">Install Sevana</h2>
        <p className="muted">Quick access to useful services around your area, right from your home screen.</p>
        <button className="button button-primary button-full" onClick={install}><Download size={18} /> Install App</button>
        <button className="button button-ghost button-full" onClick={continueOnWebsite}>Continue on Website</button>
        <p className="tiny-note">Installation availability depends on your browser.</p>
      </section>
    </div>
  );
}
