"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Info,
  Code2,
  Globe,
  MapPin,
  Heart,
  Sparkles,
  Github,
  Linkedin,
  Instagram,
  Smartphone,
  Users,
  Lightbulb,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="about-page">
      <style jsx global>{`
        .about-page {
          --about-green: #16734b;
          --about-green-dark: #105638;
          --about-ink: #17251e;
          --about-muted: #718078;
          --about-line: #e8eee9;
          width: 100%;
          max-width: 760px;
          min-height: 100vh;
          margin: 0 auto;
          padding: 22px 20px 34px;
          color: var(--about-ink);
          background: #f7faf8;
          font-family: inherit;
        }
        .about-page * { box-sizing: border-box; }
        .about-header { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
        .about-back {
          display: grid; place-items: center; width: 42px; height: 42px;
          border: 1px solid var(--about-line); border-radius: 14px;
          color: var(--about-ink); background: #fff; text-decoration: none;
          transition: transform .2s ease, border-color .2s ease;
        }
        .about-back:hover { transform: translateX(-3px); border-color: #b9d8c6; }
        .about-header h1 { margin: 0; font-size: 19px; font-weight: 800; letter-spacing: -.4px; }
        .about-header p { margin: 3px 0 0; color: var(--about-muted); font-size: 12px; }
        .about-hero {
          position: relative; overflow: hidden; text-align: center;
          padding: 34px 25px 30px; border: 1px solid #dcebe1;
          border-radius: 28px; background: linear-gradient(145deg, #fff 5%, #f0f8f3 100%);
          box-shadow: 0 16px 45px rgba(25, 89, 57, .07);
        }
        .about-hero:before, .about-hero:after {
          content: ""; position: absolute; border-radius: 50%; pointer-events: none;
          background: rgba(39, 145, 91, .055);
        }
        .about-hero:before { width: 190px; height: 190px; top: -105px; right: -65px; }
        .about-hero:after { width: 150px; height: 150px; bottom: -100px; left: -50px; }
        .about-brand-icon {
          position: relative; z-index: 1; display: grid; place-items: center;
          width: 76px; height: 76px; margin: 0 auto 18px; padding: 10px;
          border: 1px solid #e0eee5; border-radius: 23px; background: #fff;
          box-shadow: 0 9px 24px rgba(22, 115, 75, .10);
        }
        .about-brand-icon img { width: 100%; height: 100%; object-fit: contain; }
        .about-overline { position: relative; z-index: 1; margin: 0 0 8px; color: var(--about-green); font-size: 10px; font-weight: 800; letter-spacing: 2.2px; }
        .about-hero h2 { position: relative; z-index: 1; margin: 0; font-size: clamp(42px, 9vw, 58px); line-height: 1; font-weight: 900; letter-spacing: -3px; }
        .about-dot { color: #28a36b; }
        .about-tagline { position: relative; z-index: 1; margin: 11px 0 0; color: var(--about-green-dark); font-size: 15px; font-weight: 700; }
        .about-intro { position: relative; z-index: 1; max-width: 480px; margin: 15px auto 0; color: #66756c; font-size: 13px; line-height: 1.8; }
        .about-location { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px; margin-top: 20px; padding: 8px 12px; border: 1px solid #e2eee6; border-radius: 999px; color: #47715a; background: rgba(255,255,255,.75); font-size: 11px; font-weight: 600; }
        .about-section { margin-top: 30px; }
        .about-section-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
        .about-heading-icon { display: grid; place-items: center; width: 42px; height: 42px; flex: 0 0 42px; border: 1px solid #dcebe1; border-radius: 14px; color: var(--about-green); background: #edf7f0; }
        .about-eyebrow { margin: 0 0 3px; color: #7c8c82; font-size: 9px; font-weight: 800; letter-spacing: 1.5px; }
        .about-section-heading h2 { margin: 0; font-size: 19px; font-weight: 850; letter-spacing: -.5px; }
        .about-description { margin: 0; color: #64736a; font-size: 13px; line-height: 1.85; }
        .about-feature-list { display: grid; gap: 10px; margin-top: 17px; }
        .about-feature { display: flex; align-items: flex-start; gap: 13px; padding: 15px; border: 1px solid var(--about-line); border-radius: 17px; background: #fff; }
        .about-feature-icon { display: grid; place-items: center; width: 38px; height: 38px; flex: 0 0 38px; border-radius: 12px; color: var(--about-green); background: #eff7f1; }
        .about-feature strong { display: block; margin: 1px 0 4px; font-size: 12px; font-weight: 800; }
        .about-feature p { margin: 0; color: var(--about-muted); font-size: 11px; line-height: 1.6; }
        .developer-card {
          overflow: hidden; padding: 21px; border: 1px solid #dce9e0;
          border-radius: 24px; background: linear-gradient(150deg, #fff 0%, #f5faf6 100%);
          box-shadow: 0 14px 38px rgba(23, 74, 48, .07);
        }
        .developer-top { display: flex; align-items: center; gap: 16px; }
        .developer-photo {
          width: 82px; height: 82px; flex: 0 0 82px; overflow: hidden;
          padding: 3px; border: 2px solid #c8e5d2; border-radius: 23px;
          background: #eaf5ed; box-shadow: 0 7px 18px rgba(22,115,75,.12);
        }
        .developer-photo img { width: 100%; height: 100%; border-radius: 18px; object-fit: cover; }
        .developer-badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 9px; border-radius: 999px; color: #16734b; background: #e9f5ed; font-size: 9px; font-weight: 800; letter-spacing: .3px; }
        .developer-identity h3 { margin: 9px 0 3px; font-size: 20px; line-height: 1.2; font-weight: 900; letter-spacing: -.7px; }
        .developer-identity p { margin: 0; color: #708077; font-size: 11px; font-weight: 600; }
        .developer-divider { height: 1px; margin: 19px 0 15px; background: linear-gradient(90deg, #dce9e0, transparent); }
        .developer-bio { margin: 0; color: #637269; font-size: 12px; line-height: 1.85; }
        .developer-highlights { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .developer-highlights span { display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border: 1px solid #e3eee6; border-radius: 10px; color: #426b53; background: #fff; font-size: 10px; font-weight: 700; }
        .developer-socials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-top: 19px; }
        .developer-socials a { display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 42px; border: 1px solid #e1ebe4; border-radius: 12px; color: #355844; background: #fff; text-decoration: none; font-size: 10px; font-weight: 750; transition: .2s ease; }
        .developer-socials a:hover { transform: translateY(-2px); border-color: #acd2b8; background: #f4faf5; }
        .supporter-card { overflow: hidden; margin-top: 14px; padding: 20px; border: 1px solid #dce9e0; border-radius: 24px; background: linear-gradient(150deg, #fff 0%, #f3f9f5 100%); box-shadow: 0 12px 32px rgba(23, 74, 48, .06); }
        .supporter-top { display: flex; align-items: center; gap: 16px; }
        .supporter-photo { width: 82px; height: 82px; flex: 0 0 82px; overflow: hidden; padding: 3px; border: 2px solid #c8e5d2; border-radius: 23px; background: #eaf5ed; box-shadow: 0 7px 18px rgba(22,115,75,.12); }
        .supporter-photo img { width: 100%; height: 100%; border-radius: 18px; object-fit: cover; }
        .supporter-badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 9px; border-radius: 999px; color: #16734b; background: #e9f5ed; font-size: 9px; font-weight: 800; letter-spacing: .5px; }
        .supporter-identity h3 { margin: 9px 0 3px; font-size: 19px; line-height: 1.2; font-weight: 900; letter-spacing: -.5px; }
        .supporter-identity p { margin: 0; color: #708077; font-size: 11px; font-weight: 600; }
        .supporter-note { margin: 17px 0 0; padding-top: 14px; border-top: 1px solid #e3eee6; color: #637269; font-size: 12px; line-height: 1.8; }
        .about-community { display: flex; align-items: center; gap: 13px; margin-top: 24px; padding: 17px; border: 1px solid #dcebe1; border-radius: 18px; background: #eef7f1; }
        .about-community-icon { display: grid; place-items: center; width: 42px; height: 42px; flex: 0 0 42px; border-radius: 13px; color: var(--about-green); background: #fff; }
        .about-community strong { display: block; font-size: 12px; font-weight: 850; }
        .about-community p { margin: 4px 0 0; color: #718078; font-size: 10px; line-height: 1.5; }
        .about-language-tags { display: flex; gap: 6px; margin-left: auto; }
        .about-language-tags span { padding: 6px 8px; border: 1px solid #d9e9de; border-radius: 8px; color: #47715a; background: #fff; font-size: 9px; font-weight: 700; white-space: nowrap; }
        .about-footer { padding: 27px 0 5px; text-align: center; }
        .about-footer-brand { display: inline-flex; align-items: center; gap: 8px; }
        .about-footer-brand img { width: 27px; height: 27px; object-fit: contain; }
        .about-footer-brand strong { font-size: 17px; font-weight: 900; letter-spacing: -.7px; }
        .about-footer-brand .about-dot { color: #28a36b; }
        .about-footer p { margin: 8px 0 0; color: #839087; font-size: 10px; }
        .about-footer .about-copyright { margin-top: 5px; color: #a0aaa3; font-size: 9px; }
        @media (max-width: 480px) {
          .about-page { padding: 17px 14px 28px; }
          .about-hero { padding: 29px 18px 25px; border-radius: 23px; }
          .developer-card { padding: 17px; }
          .developer-photo { width: 70px; height: 70px; flex-basis: 70px; border-radius: 20px; }
          .developer-identity h3 { font-size: 18px; }
          .developer-socials a { gap: 5px; font-size: 9px; }
          .about-community { flex-wrap: wrap; }
          .about-language-tags { margin-left: 55px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-page * { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>

      <header className="about-header">
        <Link href="/" className="about-back" aria-label="Back to home"><ArrowLeft size={19} /></Link>
        <div><h1>Aamugam</h1><p>About Sevana</p></div>
      </header>

      <section className="about-hero">
        <div className="about-brand-icon"><img src="/sevana-logo.png" alt="Sevana logo" /></div>
        <p className="about-overline">YOUR COMMUNITY, CONNECTED</p>
        <h2>sevana<span className="about-dot">.</span></h2>
        <p className="about-tagline">Local services. Connected.</p>
        <p className="about-intro">A simple community platform that brings useful local services, important contacts and everyday support together in one place.</p>
        <div className="about-location"><MapPin size={14} /><span>Meenarkuzhi, Malappuram, Kerala</span></div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-heading-icon"><Info size={19} /></span>
          <div><p className="about-eyebrow">OUR PURPOSE</p><h2>About Sevana</h2></div>
        </div>
        <p className="about-description">Sevana aims to make finding local help easier. From blood donors and emergency contacts to transport services and skilled workers, the goal is to connect people with useful services in their neighbourhood.</p>
        <div className="about-feature-list">
          <div className="about-feature"><span className="about-feature-icon"><Heart size={18} /></span><div><strong>Community support</strong><p>Helping people find the support they need.</p></div></div>
          <div className="about-feature"><span className="about-feature-icon"><Smartphone size={18} /></span><div><strong>Simple and accessible</strong><p>Useful local services in one easy-to-use platform.</p></div></div>
          <div className="about-feature"><span className="about-feature-icon"><ShieldCheck size={18} /></span><div><strong>Use information responsibly</strong><p>Confirm contact details and service availability before use.</p></div></div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-heading-icon"><Code2 size={19} /></span>
          <div><p className="about-eyebrow">THE PERSON BEHIND SEVANA</p><h2>Meet the Developer</h2></div>
        </div>
        <div className="developer-card">
          <div className="developer-top">
            <div className="developer-photo"><img src="/images/aflah.png" alt="Muhammed Aflah" loading="lazy" /></div>
            <div className="developer-identity">
              <span className="developer-badge"><Sparkles size={11} /> DEVELOPER</span>
              <h3>Muhammed Aflah</h3>
              <p>Developer &amp; Creator</p>
            </div>
          </div>
          <div className="developer-divider" />
          <p className="developer-bio">I enjoy turning ideas into useful digital experiences. Sevana is a community-focused project built with one simple purpose — making everyday help easier to find and access.</p>
          <div className="developer-highlights">
            <span><Lightbulb size={13} /> Creative problem-solving</span>
            <span><Users size={13} /> Community-focused</span>
            <span><Globe size={13} /> Building for everyone</span>
          </div>
          <div className="developer-socials">
            <a href="https://github.com/aflahalungal77-lab" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /><span>GitHub</span></a>
            <a href="https://www.linkedin.com/in/aflah-a-4827a3421/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /><span>LinkedIn</span></a>
            <a href="https://www.instagram.com/aflahh.a/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /><span>Instagram</span></a>
          </div>
        </div>
      </section>

        <div className="supporter-card">
          <div className="supporter-top">
            <div className="supporter-photo"><img src="/supporter.png" alt="Musthafa Meenarkuzhi" loading="lazy" /></div>
            <div className="supporter-identity">
              <span className="supporter-badge"><Heart size={11} /> SUPPORTER</span>
              <h3>Musthafa Meenarkuzhi</h3>
              <p>Supporter of Sevana</p>
            </div>
          </div>
          <p className="supporter-note">With gratitude for the encouragement and support that help community initiatives grow.</p>
        </div>

      <section className="about-community">
        <span className="about-community-icon"><Globe size={19} /></span>
        <div><strong>Built for our community</strong><p>Designed with local people and everyday needs in mind.</p></div>
        <div className="about-language-tags"><span>മലയാളം</span><span>English</span></div>
      </section>

      <footer className="about-footer">
        <div className="about-footer-brand"><img src="/sevana-logo.png" alt="Sevana logo" /><strong>sevana<span className="about-dot">.</span></strong></div>
        <p>Made with care for the community.</p>
        <p className="about-copyright">© {new Date().getFullYear()} Sevana</p>
      </footer>
    </main>
  );
}
