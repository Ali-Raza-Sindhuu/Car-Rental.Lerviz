import SectionHeading from "@/shared/SectionHeading";

const team = [
  ["AM", "Alex Morgan", "Founder & managing director"],
  ["JC", "Jamie Chen", "Head of vehicle sourcing"],
  ["SP", "Sam Patel", "Head of customer experience"],
  ["TR", "Taylor Reed", "Head of aftercare"],
];
const TeamSection = () => (
  <section aria-labelledby="team-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="team-title" eyebrow="People behind the keys" lead={["Car people."]} muted={["People people."]} body="Meet the roles behind a more considered journey, from the first conversation to life on the road." />
      <p className="mt-5 text-[11px] text-neutral-500">All team names and roles below are placeholders.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map(([initials, name, role]) => <article key={name} className="rounded-2xl border border-neutral-200 bg-white p-3"><div aria-hidden="true" className="grid aspect-[4/3] place-items-center rounded-xl bg-neutral-100 text-5xl font-bold tracking-tighter text-neutral-400">{initials}</div><div className="px-2 py-5"><p className="text-[11px] text-neutral-500">Placeholder profile</p><h3 className="mt-2 text-base font-bold tracking-tight text-neutral-950">{name}</h3><p className="mt-1 text-xs text-neutral-500">{role}</p></div></article>)}
      </div>
    </div>
  </section>
);
export default TeamSection;

