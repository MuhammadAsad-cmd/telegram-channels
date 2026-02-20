export const metadata = {
  title: "Contact Us - Telegram Channels",
  description:
    "Get in touch with the Telegram Channels team. We're here to help with questions and feedback.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Contact Us
          </h1>
          <p className="text-text-muted text-sm mb-10">
            We&apos;d love to hear from you.
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              If you have any questions about our service, feedback, or need
              assistance, please reach out using the options below.
            </p>

            <Section title="General Inquiries">
              <p>
                For general questions about{" "}
                <span className="text-accent-primary">
                  Telegram Channels
                </span>
                , how to use the directory, or suggestions, you can contact us
                through the channels we make available (e.g. support email or
                contact form when available). We aim to respond as soon as
                possible.
              </p>
            </Section>

            <Section title="Report an Issue">
              <p>
                If you believe a channel, group, or bot listed on our site
                violates our guidelines or the law, please describe the issue
                and the relevant link when you contact us. We review reports
                and take action in line with our{" "}
                <a
                  href="/terms"
                  className="text-accent-primary hover:underline"
                >
                  Terms of Service
                </a>
                .
              </p>
            </Section>

            <Section title="Legal &amp; Privacy">
              <p>
                For matters related to privacy, data, or legal inquiries,
                please refer to our{" "}
                <a
                  href="/privacy"
                  className="text-accent-primary hover:underline"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms"
                  className="text-accent-primary hover:underline"
                >
                  Terms of Service
                </a>
                . You can still use the same contact channel above and mention
                &ldquo;Privacy&rdquo; or &ldquo;Legal&rdquo; in your message.
              </p>
            </Section>

            <Section title="Response Time">
              <p>
                We do our best to reply within a few business days. If your
                request is urgent, please indicate that in your message.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
