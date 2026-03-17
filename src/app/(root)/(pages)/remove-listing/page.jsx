export const metadata = {
  title: "Content Removal Request | Telegram Channels",
  description:
    "Request removal of a Telegram channel listing from Telegram Channels if you are the owner or have a valid request.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function ContentRemovalPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Content Removal Request
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Request removal of your channel listing
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              If you are the owner of a Telegram channel listed on Telegram Channels and would like
              it removed, you may submit a removal request.
            </p>

            <Section title="Required Information">
              <p>Please include:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Listing URL</li>
                <li>Proof of channel ownership</li>
                <li>Reason for removal</li>
              </ul>
            </Section>

            <Section title="Review Process">
              <p>
                Our team will review your request and take appropriate action within a reasonable
                timeframe.
              </p>
            </Section>

            <Section title="Contact">
              <p>Send removal requests to:</p>
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
