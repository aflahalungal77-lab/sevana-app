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
  Mail,
  Github,
  Linkedin,
  Instagram,
  Users,
  Smartphone,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="page sevana-about-page">
      {/* Header */}
      <header className="back-header sevana-about-header">
        <Link href="/" className="back-button" aria-label="Back to home">
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1>Aamugam</h1>
          <p>About Sevana</p>
        </div>
      </header>

      {/* Brand hero */}
      <section className="profile-hero sevana-about-hero">
        <div className="sevana-about-brand-icon">
          <span className="brand-mark">
            <span />
          </span>
        </div>

        <p className="sevana-about-overline">YOUR COMMUNITY, CONNECTED</p>

        <h2>
          sevana<span className="brand-dot">.</span>
        </h2>

        <p className="sevana-about-tagline">
          Local services. Connected.
        </p>

        <p className="sevana-about-intro">
          A simple community platform that brings useful local services,
          important contacts and everyday support together in one place.
        </p>

        <div className="sevana-about-location">
          <MapPin size={15} />
          <span>Meenarkuzhi, Malappuram, Kerala</span>
        </div>
      </section>

      {/* About Sevana */}
      <section className="sevana-about-section">
        <div className="sevana-about-section-heading">
          <span className="sevana-about-heading-icon">
            <Info size={19} />
          </span>

          <div>
            <p className="sevana-about-eyebrow">OUR PURPOSE</p>
            <h2>About Sevana</h2>
          </div>
        </div>

        <p className="sevana-about-description">
          Sevana aims to make finding local help easier. From blood donors
          and emergency contacts to transport services and skilled workers,
          the goal is to connect people with useful services in their
          neighbourhood.
        </p>

        <div className="sevana-about-features">
          <div className="sevana-about-feature">
            <span className="sevana-about-feature-icon">
              <Heart size={19} />
            </span>
            <div>
              <strong>Community support</strong>
              <p>Helping people find the support they need.</p>
            </div>
          </div>

          <div className="sevana-about-feature">
            <span className="sevana-about-feature-icon">
              <Smartphone size={19} />
            </span>
            <div>
              <strong>Simple and accessible</strong>
              <p>Useful local services in one easy-to-use platform.</p>
            </div>
          </div>

          <div className="sevana-about-feature">
            <span className="sevana-about-feature-icon">
              <ShieldCheck size={19} />
            </span>
            <div>
              <strong>Use information responsibly</strong>
              <p>Confirm contact details and service availability before use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="sevana-about-section sevana-developer-section">
        <div className="sevana-about-section-heading">
          <span className="sevana-about-heading-icon">
            <Code2 size={19} />
          </span>

          <div>
            <p className="sevana-about-eyebrow">THE PERSON BEHIND THE CODE</p>
            <h2>Meet the Developer</h2>
          </div>
        </div>

        <div className="sevana-developer-card">
          <div className="sevana-developer-top">
            {/* Add your photo at public/images/aflah.jpg */}
            <div className="sevana-developer-photo">
              <img
                src="/images/aflah.png"
                alt="Muhammed Aflah"
                loading="lazy"
              />
            </div>

            <div className="sevana-developer-identity">
              <span className="sevana-developer-badge">
                <Sparkles size={12} />
                Developer
              </span>

              <h3>Muhammed Aflah</h3>
              <p>Developer &amp; Creator</p>
            </div>
          </div>

          <div className="sevana-developer-divider" />

          <p className="sevana-developer-bio">
            Passionate about building useful digital products and simple
            experiences that solve real-world problems. Sevana is built with
            the idea of making local services easier to discover and access.
          </p>

          <div className="sevana-developer-skills">
            <span>Next.js</span>
            <span>TypeScript</span>
            <span>Supabase</span>
            <span>Web Development</span>
          </div>

          <div className="sevana-developer-socials">
            <a
              href="https://github.com/aflahalungal77-lab"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/aflah-a-4827a3421/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://www.instagram.com/aflahh.a/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="sevana-about-language">
        <div className="sevana-about-language-icon">
          <Globe size={20} />
        </div>

        <div>
          <strong>Built for our community</strong>
          <p>Designed with local people and everyday needs in mind.</p>
        </div>

        <div className="sevana-language-tags">
          <span>മലയാളം</span>
          <span>English</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="sevana-about-footer">
        <div className="sevana-about-footer-brand">
          <span className="brand-mark">
            <span />
          </span>
          <strong>
            sevana<span className="brand-dot">.</span>
          </strong>
        </div>

        <p>Made with care for the community.</p>
        <p className="sevana-about-copyright">
          © {new Date().getFullYear()} Sevana
        </p>
      </footer>
    </main>
  );
}