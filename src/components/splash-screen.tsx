"use client";

import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let timer: number | undefined;
    const start = () => {
      setVisible(true);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(false), 2000);
    };
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || sessionStorage.getItem("sevana-install-dismissed") === "1") start();
    window.addEventListener("sevana:start-splash", start);
    return () => {
      window.removeEventListener("sevana:start-splash", start);
      if (timer) window.clearTimeout(timer);
    };
  }, []);
  if (!visible) return null;
  return (
    <div className="splash-screen" aria-label="Sevana loading">
      <div className="splash-mark"><Leaf size={34} strokeWidth={2.2} /></div>
      <h1>sevana<span>.</span></h1>
      <p>Local services. Connected.</p>
      <div className="splash-loader" />
    </div>
  );
}
