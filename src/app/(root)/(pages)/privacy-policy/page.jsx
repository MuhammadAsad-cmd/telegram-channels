export const metadata = {
  title: "Privacy Policy | Telegram Channels",
  description:
    "Learn how Telegram Channels collects, uses, and protects your personal information when you use our Telegram channel directory and services.",
};

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    {children}
  </section>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Last updated: March 2025
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              Welcome to Telegram Channels. Your privacy is important to us. This Privacy Policy
              explains how we collect, use, and protect information when you visit or interact with
              our website.
            </p>
            <p>
              Telegram Channels operates as an independent directory of public channels, groups,
              and bots on Telegram.
            </p>

            <Section title="Information We Collect">
              <p>We may collect the following types of information:</p>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">Personal Information</h3>
                  <p className="mb-2">When users interact with our website, we may collect:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Listing submissions</li>
                    <li>Messages sent through our contact forms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">Technical Information</h3>
                  <p className="mb-2">We may automatically collect:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Pages visited</li>
                    <li>Referral sources</li>
                  </ul>
                  <p>This information helps us improve website functionality and user experience.</p>
                </div>
              </div>
            </Section>

            <Section title="Cookies">
              <p>Our website may use cookies to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Improve site performance</li>
                <li>Analyze user behavior</li>
                <li>Remember user preferences</li>
              </ul>
              <p>Users may disable cookies through their browser settings.</p>
            </Section>

            <Section title="How We Use Information">
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Manage listings submitted to our directory</li>
                <li>Improve website services</li>
                <li>Prevent spam or abuse</li>
                <li>Respond to support requests</li>
                <li>Maintain website security</li>
              </ul>
            </Section>

            <Section title="Third-Party Services">
              <p>
                We may use third-party tools for analytics, advertising, or security monitoring.
                These services may collect anonymous usage data according to their own privacy policies.
              </p>
            </Section>

            <Section title="Data Protection">
              <p>
                We take reasonable technical and administrative measures to protect user data. However,
                no online system can guarantee complete security.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                This Privacy Policy may be updated periodically to reflect website changes or legal
                requirements.
              </p>
            </Section>

            <Section title="Contact">
              <p>For privacy-related questions, contact:</p>
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
