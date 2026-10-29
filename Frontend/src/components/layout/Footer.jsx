import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const XLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "X", icon: XLogo, href: "#" },
];

const linkGroups = [
  {
    title: "Explore",
    links: ["Models", "Browse by Category", "Technology", "Performance"],
  },
  {
    title: "Experience",
    links: ["Book a Test Drive", "Find a Dealer", "Service & Maintenance", "Vehicle Configurator"],
  },
  {
    title: "Discover",
    links: ["Our Story", "About Revex", "Stories", "Innovation"],
  },
];

const legalLinks = ["Privacy Policy", "Terms & Conditions"];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f05a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900";

const Footer = () => (
  <footer className="bg-neutral-900 px-4 pb-6 pt-4 md:px-12 md:pt-8">
    <div className="mx-auto max-w-[1400px]">
      {/* Giant wordmark */}
      <p
        aria-hidden="true"
        className="select-none text-center text-[21vw] font-black uppercase leading-none tracking-tight text-white min-[1400px]:text-[290px]"
      >
        REVE<span className="text-[#f05a1a]">X</span>
      </p>

      {/* Links */}
      <div className="mt-10 border-t border-white/10 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className={`rounded text-xl font-medium tracking-tight text-white ${focusRing}`}
            >
              REVE<span className="text-[#f05a1a]">X</span>
            </Link>
            <p className="mt-4 max-w-[250px] text-xs leading-relaxed text-white/70">
              Driving every journey forward, built on trust, precision, and a
              passion for performance.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <p className="text-[11px] font-semibold text-white">Follow us on</p>
              <div className="flex gap-2">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`flex size-7 items-center justify-center rounded-sm border border-white/20 text-white transition-colors hover:bg-white/10 ${focusRing}`}
                  >
                    <Icon className="size-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:flex lg:gap-x-20 xl:gap-x-28">
            {linkGroups.map(({ title, links }) => (
              <div key={title}>
                <h3 className="text-xs font-semibold text-white">{title}</h3>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`rounded text-[13px] text-white/85 transition-colors hover:text-white ${focusRing}`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-y border-white/10 py-6 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">2026 © REVEX. All rights reserved.</p>
          <div className="flex gap-6 text-white/70">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={`rounded transition-colors hover:text-white ${focusRing}`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;