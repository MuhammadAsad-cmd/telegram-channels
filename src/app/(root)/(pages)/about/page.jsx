export const metadata = {
  title: "About Us - Telegram Channels",
  description:
    "Learn about Telegram Channels — a curated directory of Telegram channels, groups, and bots.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            About Us
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Discover who we are and what we offer.
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              <span className="text-accent-primary font-medium">
                Telegram Channels
              </span>{" "}
              is a curated directory where users can discover and explore
              Telegram channels, groups, and bots. We help people find
              communities and tools that match their interests.
            </p>

            <Section title="Our Mission">
              <p>
                We aim to make it easy to discover quality Telegram content.
                Whether you&apos;re looking for channels by category, trending
                channels, or ranked listings, our search and filters help you
                find what matters to you.
              </p>
            </Section>

            <Section title="What We Offer">
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Search across channels, groups, bots, and stickers</li>
                <li>Browse by category and type</li>
                <li>Trending and top-ranked listings</li>
                <li>User-submitted and curated content</li>
              </ul>
            </Section>

            <Section title="Not Affiliated with Telegram">
              <p>
                We are not affiliated with, endorsed by, or officially connected
                with Telegram Messenger Inc. Telegram is a trademark of
                Telegram Messenger Inc. Our site is an independent directory
                for discovery purposes only.
              </p>
            </Section>

            <Section title="Get in Touch">
              <p>
                Have questions or feedback? Visit our{" "}
                <a
                  href="/contact"
                  className="text-accent-primary hover:underline"
                >
                  Contact Us
                </a>{" "}
                page. For legal information, see our{" "}
                <a
                  href="/terms-of-service"
                  className="text-accent-primary hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-accent-primary hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
