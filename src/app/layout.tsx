
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-sw";
import { InstallPrompt } from "@/components/install-prompt";
import { SplashScreen } from "@/components/splash-screen";
import { BottomNav } from "@/components/bottom-nav";
import { LanguageToggle } from "@/components/language-toggle";

export const metadata: Metadata = {
  title: "Sevana — Local Services",
  description:
    "Find useful local services, transport, workers and blood donors.",
  manifest: "/manifest.json",
  applicationName: "Sevana",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sevana",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#17633a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RegisterServiceWorker />
        <InstallPrompt />
        <SplashScreen />

        <main className="app-shell">{children}</main>

        <BottomNav />
        <LanguageToggle />

      </body>
    </html>
  );
}
