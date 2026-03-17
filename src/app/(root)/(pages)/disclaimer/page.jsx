export const metadata = {
  title: "Disclaimer | Telegram Channels",
  description:
    "Understand the limitations of responsibility when using the Telegram Channels directory.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Disclaimer
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Important information about our service
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              Telegram Channels is an independent directory of public Telegram channels, groups, and
              bots. This website is not affiliated with, endorsed by, or officially connected to
              Telegram.
            </p>

            <Section title="Third-Party Content">
              <p>
                Listings on Telegram Channels are submitted by users or collected from publicly
                available information. We do not control the content shared inside Telegram channels.
              </p>
            </Section>

            <Section title="Accuracy">
              <p>
                While we strive to provide accurate information, we cannot guarantee the completeness
                or reliability of all listings.
              </p>
            </Section>

            <Section title="Responsibility">
              <p>
                Users access Telegram channels at their own discretion and responsibility.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
