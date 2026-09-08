// components/Footer.jsx
import { Link } from 'react-router-dom';

const FooterLink = ({ to, children, external = false }) => {
  const className =
    'text-white hover:text-[rgb(219,4,4)] transition-colors duration-300 text-base font-medium';

  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="relative w-full bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Heading */}
        <div className="mb-12 max-w-3xl">
          <h3 className="text-2xl md:text-4xl font-semibold text-white leading-snug">
            Making your car-buying experience transparent.
          </h3>
        </div>

        {/* Content Row */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          {/* Copyright */}
          <div className="text-neutral-300 text-sm">
            ©2026 Levrix. Designed By Grabui
          </div>

          {/* Main Pages */}
          <div className="flex flex-col gap-4">
            <p className="text-neutral-300 text-sm">/Main Pages</p>
            <div className="flex flex-col gap-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/inventory">Inventory</FooterLink>
              <FooterLink to="/blogs">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <p className="text-neutral-300 text-sm">/Social</p>
            <div className="flex flex-col gap-3">
              <FooterLink to="https://x.com/" external>
                X
              </FooterLink>
              <FooterLink to="https://www.instagram.com/" external>
                Instagram
              </FooterLink>
              <FooterLink to="https://www.linkedin.com/" external>
                LinkedIn
              </FooterLink>
              <FooterLink to="https://www.facebook.com/" external>
                Facebook
              </FooterLink>
            </div>
          </div>

          {/* Utility */}
          <div className="flex flex-col gap-4">
            <p className="text-neutral-300 text-sm">/Utility</p>
            <div className="flex flex-col gap-3">
              <FooterLink to="/404">404</FooterLink>
              <FooterLink to="/legal-pages/privacy-policy">
                Privacy Policy
              </FooterLink>
              <FooterLink to="/legal-pages/terms-conditions">
                Terms &amp; Conditions
              </FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Big Watermark Text */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none">
        <h1
          className="text-center font-bold text-[rgb(217,217,217)] leading-none"
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 'clamp(60px, 18vw, 220px)',
            WebkitMaskImage:
              'linear-gradient(0deg, rgba(0,0,0,0) 15%, rgb(0,0,0) 43%)',
            maskImage:
              'linear-gradient(0deg, rgba(0,0,0,0) 15%, rgb(0,0,0) 43%)',
          }}
        >
          Levrix
        </h1>
      </div>
    </footer>
  );
};

export default Footer;