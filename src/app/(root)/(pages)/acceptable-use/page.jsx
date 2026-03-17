export const metadata = {
  title: "Acceptable Use Policy | Telegram Channels",
  description:
    "Guidelines for submitting and using content on the Telegram Channels directory.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function AcceptableUsePolicyPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Acceptable Use Policy
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Guidelines for using our platform
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              Users must follow these rules when using Telegram Channels.
            </p>

            <Section title="Allowed Content">
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Educational channels</li>
                <li>Community groups</li>
                <li>Informational Telegram resources</li>
              </ul>
            </Section>

            <Section title="Prohibited Content">
              <p>Users must not submit:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Illegal content</li>
                <li>Spam channels</li>
                <li>Scam or phishing content</li>
                <li>Copyright-infringing material</li>
                <li>Harmful or malicious links</li>
              </ul>
            </Section>

            <Section title="Enforcement">
              <p>
                Listings that violate these rules may be removed without notice.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
