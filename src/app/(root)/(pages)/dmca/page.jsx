export const metadata = {
  title: "DMCA Policy | Telegram Channels",
  description:
    "Submit copyright complaints or DMCA takedown requests regarding content listed on Telegram Channels.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function DMCAPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            DMCA Policy
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Digital Millennium Copyright Act compliance
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              Telegram Channels respects intellectual property rights and complies with the Digital
              Millennium Copyright Act. If you believe that content on this website infringes your
              copyright, you may submit a DMCA takedown request.
            </p>

            <Section title="Required Information">
              <p>Your request must include:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Your full name</li>
                <li>Contact email</li>
                <li>URL of the listing</li>
                <li>Description of the copyrighted work</li>
                <li>Statement confirming ownership</li>
              </ul>
            </Section>

            <Section title="Review Process">
              <p>After receiving a valid request:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>We review the complaint</li>
                <li>Investigate the listing</li>
                <li>Remove or modify the content if necessary</li>
              </ol>
            </Section>

            <Section title="Contact">
              <p>Send DMCA requests to:</p>
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
