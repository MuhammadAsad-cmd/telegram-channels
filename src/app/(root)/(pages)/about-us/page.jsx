export const metadata = {
  title: "About Us | Telegram Channels",
  description:
    "Learn about Telegram Channels, an independent directory helping users discover quality Telegram channels, groups, and bots across multiple categories.",
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
              Welcome to <span className="text-accent-primary font-medium">Telegram Channels</span>.
              We are an independent online directory designed to help users discover high-quality
              channels, groups, and bots available on Telegram.
            </p>
            <p>
              Our mission is to make it easier for people around the world to explore valuable Telegram
              communities related to education, technology, entertainment, finance, news, and many other
              topics.
            </p>

            <Section title="Our Mission">
              <p>
                The goal of Telegram Channels is simple: to create a reliable and organized directory
                where users can easily find useful Telegram communities.
              </p>
              <p>
                With thousands of channels available on Telegram, finding quality content can be difficult.
                Telegram Channels helps solve this problem by providing:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Structured categories</li>
                <li>Verified listings</li>
                <li>Curated recommendations</li>
                <li>Easy search and discovery</li>
              </ul>
            </Section>

            <Section title="What We Offer">
              <p>
                Telegram Channels provides a platform where users can:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong className="text-text-primary">Discover Telegram Channels</strong> — Browse categorized listings to find communities related to your interests.</li>
                <li><strong className="text-text-primary">Submit Telegram Channels</strong> — Channel owners can submit their communities to reach a wider audience.</li>
                <li><strong className="text-text-primary">Explore Trending Communities</strong> — Our platform highlights popular and trending channels across different categories.</li>
                <li><strong className="text-text-primary">Organized Categories</strong> — We categorize listings to make it easy for users to navigate and discover relevant channels quickly.</li>
              </ul>
            </Section>

            <Section title="Independent Directory">
              <p>
                Telegram Channels operates as an independent directory platform. We are not affiliated with
                or endorsed by Telegram. All channels listed on our website are either submitted by users
                or collected from publicly available information.
              </p>
            </Section>

            <Section title="Our Commitment to Quality">
              <p>
                To maintain a reliable directory, Telegram Channels follows several quality practices:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Reviewing submitted listings</li>
                <li>Removing spam or misleading content</li>
                <li>Providing accurate category placement</li>
                <li>Allowing users to report inappropriate listings</li>
              </ul>
              <p>
                These measures help ensure a better experience for visitors.
              </p>
            </Section>

            <Section title="Community Contribution">
              <p>
                Telegram Channels grows with the help of the community. Users can contribute by:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Submitting useful Telegram channels</li>
                <li>Reporting problematic listings</li>
                <li>Sharing feedback and suggestions</li>
              </ul>
              <p>
                Community participation helps improve the quality and usefulness of the directory.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                If you have questions or suggestions, contact us:
              </p>
              <p>
                Email:{" "}
                <a href="mailto:abraham.uk.org@gmail.com" className="text-accent-primary hover:underline">
                  abraham.uk.org@gmail.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
