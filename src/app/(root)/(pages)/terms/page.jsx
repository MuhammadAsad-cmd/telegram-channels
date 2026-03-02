export const metadata = {
  title: "Terms of Service - Telegram Channels",
  description:
    "Read our Terms of Service to understand the rules and guidelines for using Telegram Channels.",
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
            Terms of Service (&ldquo;Terms&rdquo;)
          </h1>
          <p className="text-text-muted text-sm mb-10">
            Last updated: April 1, 19, 2026
          </p>

          <div className="space-y-10 text-text-muted leading-relaxed">
            <p>
              Please read these Terms of Service (&ldquo;Terms&rdquo;,
              &ldquo;Terms of Service&rdquo;) carefully before using the{" "}
              <span className="text-accent-primary">
                https://telegramchannels.me
              </span>{" "}
              website (the &ldquo;Service&rdquo;) operated by &ldquo;Telegram
              Channels&rdquo; (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or
              &ldquo;our&rdquo;).
            </p>
            <p>
              Your access to and use of the Service is conditioned on your
              acceptance of and compliance with these Terms. These Terms apply
              to all visitors, users and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these
              Terms. If you disagree with any part of the terms then you may not
              access the Service.
            </p>

            <Section title="Accounts">
              <p className="mb-3">
                When you create an account with us, you must provide us
                information that is accurate, complete, and current at all
                times. Failure to do so constitutes a breach of the Terms,
                which may result in immediate termination of your account on our
                Service.
              </p>
              <p className="mb-3">
                You are responsible for safeguarding the password that you use
                to access the Service and for any activities or actions under
                your password, whether your password is with our Service or a
                third-party service.
              </p>
              <p>
                You agree not to disclose your password to any third party. You
                must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>
            </Section>

            <Section title="Usage Restrictions">
              <p className="mb-3">
                By creating an account and using our Service, you agree to our{" "}
                <a href="/privacy" className="text-accent-primary hover:underline">
                  Privacy Policy
                </a>{" "}
                and agree not to use our services for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Using our service for spam or abusive actions</li>
                <li>
                  Submitting content that promotes illegal activities, hate
                  speech, or harassment
                </li>
                <li>
                  Posting any Telegram Channels or Groups that contain illegal
                  content
                </li>
                <li>
                  Attempting to gain unauthorized access to any portion of our
                  Service
                </li>
                <li>
                  To impersonate or attempt to impersonate another user,
                  person, or entity
                </li>
                <li>
                  Transmitting any advertising or promotional material without
                  our prior written consent
                </li>
              </ul>
            </Section>

            <Section title="Refunds">
              <p className="mb-3">
                We do not issue refunds for services once the order is confirmed
                and the service has been provided.
              </p>
              <p>
                We recommend contacting us for assistance if you experience any
                issues with our services.
              </p>
            </Section>

            <Section title="Links To Other Web Sites">
              <p className="mb-3">
                Our Service may contain links to third-party web sites or
                services that are not owned or controlled by &ldquo;Telegram
                Channels&rdquo;.
              </p>
              <p className="mb-3">
                &ldquo;Telegram Channels&rdquo; has no control over, and
                assumes no responsibility for, the content, privacy policies, or
                practices of any third party web sites or services. You further
                acknowledge and agree that &ldquo;Telegram Channels&rdquo;
                shall not be responsible or liable, directly or indirectly, for
                any damage or loss caused or alleged to be caused by or in
                connection with use of or reliance on any such content, goods or
                services available on or through any such web sites or services.
              </p>
              <p>
                We strongly advise you to read the terms and conditions and
                privacy policies of any third-party web sites or services that
                you visit.
              </p>
            </Section>

            <Section title="Termination">
              <p className="mb-3">
                We may terminate or suspend access to our Service immediately,
                without prior notice or liability, for any reason whatsoever,
                including without limitation if you breach the Terms.
              </p>
              <p className="mb-3">
                All provisions of the Terms which by their nature should survive
                termination shall survive termination, including, without
                limitation, ownership provisions, warranty disclaimers,
                indemnity and limitations of liability.
              </p>
              <p className="mb-3">
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p className="mb-3">
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive
                termination shall survive termination, including, without
                limitation, ownership provisions, warranty disclaimers,
                indemnity and limitations of liability.
              </p>
            </Section>

            <Section title="Governing Law">
              <p className="mb-3">
                These Terms shall be governed and construed in accordance with
                the laws, without regard to its conflict of law provisions.
              </p>
              <p className="mb-3">
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights. If any
                provision of these Terms is held to be invalid or unenforceable
                by a court, the remaining provisions of these Terms will remain
                in effect. These Terms constitute the entire agreement between
                us regarding our Service, and supersede and replace any prior
                agreements we might have between us regarding the Service.
              </p>
            </Section>

            <Section title="Changes">
              <p className="mb-3">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material we
                will try to provide at least 15 days notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Service after those revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, please stop using the
                Service.
              </p>
            </Section>

            <Section title="Contact Us">
              <p className="mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>
                  By visiting this page on our website:{" "}
                  <a
                    href="/contact"
                    className="text-accent-primary hover:underline"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
