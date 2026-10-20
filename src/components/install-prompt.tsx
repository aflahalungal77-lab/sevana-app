"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const dismissed = sessionStorage.getItem("sevana-install-dismissed");
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIos(isIos);
    if (!dismissed) setShow(true);

    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") { setShow(false); window.dispatchEvent(new Event("sevana:start-splash")); }
      setInstallEvent(null);
    } else if (ios) {
      setShow(false);
      alert('To install Sevana on iPhone: tap Share, then "Add to Home Screen".');
      window.dispatchEvent(new Event("sevana:start-splash"));
    } else {
      setShow(false);
      alert("If installation is supported, use your browser menu and choose Install app or Add to Home screen.");
      window.dispatchEvent(new Event("sevana:start-splash"));
    }
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
