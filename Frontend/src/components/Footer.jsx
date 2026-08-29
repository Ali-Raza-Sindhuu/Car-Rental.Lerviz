import { Link } from 'react-router-dom'
import { navLinks, socialLinks } from '../data/dummyData'

export default function Footer() {
  return (
    <footer className="bg-ink pt-20 pb-6 px-5 relative overflow-hidden">
      <div className="max-w-[1380px] mx-auto">
        <h3 className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 max-w-lg mb-14">
          Making your car-buying experience transparent.
        </h3>

        <div className="grid sm:grid-cols-3 gap-10 pb-14 border-b border-line">
          <p className="text-mist text-sm">© 2026 Levrix. All rights reserved.</p>

          <div>
            <p className="eyebrow text-xs uppercase mb-4">Main Pages</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-xs uppercase mb-4">Social</p>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors text-sm"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-xs uppercase mb-4">Legal</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/legal/privacy-policy"
                  className="text-white hover:text-accent transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/terms-conditions"
                  className="text-white hover:text-accent transition-colors text-sm"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2
        aria-hidden="true"
        className="pointer-events-none select-none text-center font-display font-semibold text-mist/10 mt-10 whitespace-nowrap"
        style={{ fontSize: 'min(20vw, 220px)', lineHeight: 1 }}
      >
        Levrix
      </h2>
    </footer>
  )
}
