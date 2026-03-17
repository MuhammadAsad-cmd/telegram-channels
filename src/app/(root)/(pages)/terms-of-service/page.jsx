export const metadata = {
  title: "Terms of Service | Telegram Channels",
  description:
    "Read the terms and conditions for using Telegram Channels, our Telegram channel directory platform.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Last updated: March 2025
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              Welcome to Telegram Channels. By accessing or using this website, you agree to comply
              with these Terms of Service. If you do not agree with these terms, please discontinue
              using the website.
            </p>

            <Section title="Website Purpose">
              <p>
                Telegram Channels provides a directory of public channels, groups, and bots available
                on Telegram. Our platform helps users discover Telegram communities and resources.
              </p>
            </Section>

            <Section title="User Submissions">
              <p>Users may submit listings to our directory. By submitting content, you confirm that:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>You have permission to promote the channel</li>
                <li>The information provided is accurate</li>
                <li>The content does not violate any laws or intellectual property rights</li>
              </ul>
            </Section>

            <Section title="Content Moderation">
              <p>Telegram Channels reserves the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Approve or reject listings</li>
                <li>Edit descriptions for clarity</li>
                <li>Remove listings without notice</li>
                <li>Suspend users who violate policies</li>
              </ul>
            </Section>

            <Section title="External Content">
              <p>
                Our website links to third-party Telegram channels and external platforms. We do not
                control or guarantee the content posted on those platforms.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>Telegram Channels is not responsible for:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Content posted within Telegram channels</li>
                <li>Actions taken by third-party users</li>
                <li>External websites linked from our platform</li>
              </ul>
            </Section>

            <Section title="Changes to Terms">
              <p>
                We may update these Terms of Service at any time without prior notice.
              </p>
            </Section>

            <Section title="Contact">
              <p>For questions about these terms, contact:</p>
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
