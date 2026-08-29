import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

export default function SpecialOffers() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-[1380px] mx-auto grid md:grid-cols-2 gap-6">
        <Reveal>
          <div className="relative rounded-2xl overflow-hidden p-10 bg-panel border card-border min-h-[280px] flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-3">
                Summer Sale
              </h3>
              <p className="text-mist max-w-xs">
                Up to $15,000 off on selected performance models. Limited
                time offer.
              </p>
            </div>
            <Link to="/inventory" className="btn-light self-start mt-6">
              Browse Inventory
            </Link>
            <img
              src="https://placehold.co/500x260/000000/2a2a2a?text=Car"
              alt="Featured car"
              className="absolute right-0 bottom-0 w-2/3 opacity-90 pointer-events-none select-none"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden p-10 bg-accent min-h-[280px] flex flex-col justify-between text-ink">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-3">
                0% APR Financing
              </h3>
              <p className="max-w-xs text-ink/80">
                Available on all certified pre-owned SUV models through the
                end of the month.
              </p>
            </div>
            <Link
              to="/contact"
              className="btn-primary self-start mt-6 !bg-ink !text-white"
            >
              Apply Now
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
