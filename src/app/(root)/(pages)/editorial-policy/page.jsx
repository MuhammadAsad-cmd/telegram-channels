export const metadata = {
  title: "Editorial Policy | Telegram Channels Content Guidelines",
  description:
    "Learn about the editorial standards and content review process used by Telegram Channels to maintain accurate and trustworthy Telegram channel listings.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Editorial Policy
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Content guidelines and review standards
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              At Telegram Channels, we are committed to providing users with reliable and well-organized
              listings of public channels, groups, and bots available on Telegram. This Editorial Policy
              explains the standards and review processes used to ensure that the content published on
              our website remains accurate, useful, and trustworthy.
            </p>

            <Section title="Content Sources">
              <p>Listings published on Telegram Channels may come from the following sources:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong className="text-text-primary">User Submissions</strong> — Channel owners and community members may submit Telegram channels for inclusion in our directory.</li>
                <li><strong className="text-text-primary">Publicly Available Information</strong> — Some listings may be created using publicly available information about Telegram channels and communities.</li>
                <li><strong className="text-text-primary">Editorial Review</strong> — Our team may review, edit, or improve listing descriptions to maintain quality and clarity.</li>
              </ul>
            </Section>

            <Section title="Content Review Process">
              <p>To maintain high-quality listings, Telegram Channels follows a content review process that includes:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Checking submissions for accuracy</li>
                <li>Verifying category relevance</li>
                <li>Reviewing descriptions for clarity</li>
                <li>Removing spam or misleading content</li>
              </ul>
              <p>Listings that do not meet our guidelines may be rejected or removed.</p>
            </Section>

            <Section title="Content Quality Standards">
              <p>All listings should meet the following standards:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong className="text-text-primary">Clear and Accurate Descriptions</strong> — Descriptions should provide useful information about the Telegram channel or group.</li>
                <li><strong className="text-text-primary">Relevant Categories</strong> — Listings must be placed in appropriate categories to improve discoverability.</li>
                <li><strong className="text-text-primary">Informative Titles</strong> — Channel titles should accurately represent the content of the community.</li>
              </ul>
            </Section>

            <Section title="Prohibited Content">
              <p>Telegram Channels does not allow listings that contain:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Illegal material</li>
                <li>Spam or deceptive promotions</li>
                <li>Scam or phishing content</li>
                <li>Copyright-infringing content</li>
                <li>Malicious or harmful links</li>
              </ul>
              <p>Listings that violate these rules may be removed without notice.</p>
            </Section>

            <Section title="Content Updates">
              <p>
                Because Telegram communities may change over time, Telegram Channels may update or
                modify listings to maintain accuracy. Users are encouraged to report outdated or
                incorrect information.
              </p>
            </Section>

            <Section title="Community Reporting">
              <p>Users can help maintain the quality of the directory by reporting:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Spam channels</li>
                <li>Broken links</li>
                <li>Misleading descriptions</li>
                <li>Inappropriate content</li>
              </ul>
              <p>
                Reports submitted through the website will be reviewed by our moderation team.
              </p>
            </Section>

            <Section title="Transparency">
              <p>
                Telegram Channels aims to maintain transparency in how listings are managed and
                displayed. Editorial decisions are made independently to ensure the quality and
                reliability of the platform.
              </p>
            </Section>

            <Section title="Independence">
              <p>
                Telegram Channels operates independently and is not affiliated with or endorsed by
                Telegram. The purpose of the website is to help users discover communities available
                on the Telegram platform.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                If you have questions regarding this Editorial Policy or wish to report a content
                issue, please contact us:
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
