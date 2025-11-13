import Link from "next/link";
import Button from "../ui/Button";

const partners = {
  organizers: [
    {
      name: 'Runminders',
      logo: '/logos/run-indonesia.png',
      url: '#',
      type: 'main'
    },
    {
      name: 'Sobat Sabtu',
      logo: '/logos/sports-community.png',
      url: '#',
      type: 'main'
    }
  ],
  ourPartners: [
    {
      name: "Strava",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Strava_Logo.svg/1280px-Strava_Logo.svg.png",
      url: "https://www.strava.com",
    },
    {
      name: "Asics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Asics_Logo.svg/1280px-Asics_Logo.svg.png",
      url: "https://www.asics.com",
    },
    {
      name: "Suunto",
      logo: "https://logonoid.com/images/suunto-logo.png",
      url: "https://www.suunto.com",
    },
    {
      name: "Decathlon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Decathlon_Logo.png/1200px-Decathlon_Logo.png",
      url: "https://www.decathlon.com",
    },
    {
      name: "New Balance",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/2560px-New_Balance_logo.svg.png",
      url: "https://www.newbalance.com",
    },
    {
      name: "Hoka",
      logo: "https://1000logos.net/wp-content/uploads/2024/07/Hoka-Emblem.png",
      url: "https://www.hoka.com",
    },
  ]
};

export default function PartnersSection() {
  return (
    <section className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Our Suppports
          </h2>
          <p className="text-lg text-zinc-100">
            Brought to you by leading organizations in the running community,
            supported by trusted brands that share our passion for sports and wellness.
          </p>
        </div>

        {/* Organizers */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-zinc-100 text-center mb-12">
            Organized By
          </h3>
          <div className="flex justify-center items-center gap-16 flex-wrap">
            {partners.organizers.map((organizer, index) => (
              <div
                key={organizer.name}
                className="group relative"
              >
                <div className="text-zinc-300 font-semibold transition-colors text-5xl italic group-hover:text-zinc-100 duration-100 tracking-[-4px] underline underline-offset-2">
                  {organizer.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Partners */}
        <div>
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            Partners
          </h3>
          <div className="grid grid-cols-6 gap-16 justify-center items-center">
            {partners.ourPartners.map((partner, index) => (
              <div
                key={partner.name}
                className="group"
              >
                <div>
                  <img src={partner.logo} className=" object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become Partner CTA */}
        <div className="text-center mt-16 pt-8 border-t border-white/20">
          <p className="text-neutral-300 mb-6">
            Interested in becoming a partner?
          </p>
          <Link href={'/contact'}>
            <Button variant="primary" size="md" className=" text-zinc-900">
              &nbsp; Join &nbsp;
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
