import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Privacy Policy — NDLedger",
  description: "How NDLedger collects, stores, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NDLedger logo"
              width={1536}
              height={1024}
              className="h-10 w-auto"
              priority
            />
            <span className="text-lg font-bold text-[#1E3A5F]">NDLedger</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-[#1E3A5F] hover:text-[#0D9488]"
            >
              ← Back to home
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-[#1E3A5F] hover:text-[#0D9488]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-16 sm:py-20">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-10">Last updated: April 2026</p>

          <Section title="1. What We Collect">
            <p>We collect the minimum information needed to run NDLedger:</p>
            <ul>
              <li>
                <strong>Email address</strong> — used for account authentication.
              </li>
              <li>
                <strong>Conversation transcripts</strong> that you upload.
              </li>
              <li>
                <strong>Extracted insights, topics, decisions, tasks, and
                commitments</strong> generated from your transcripts.
              </li>
              <li>
                <strong>Timestamps</strong> that you provide against transcripts
                and insights.
              </li>
            </ul>
            <p>
              <strong>Voice recordings are processed locally</strong> in your
              browser using the Web Speech API. The resulting text is sent to
              NDLedger for extraction, but the audio itself is never uploaded
              or stored.
            </p>
          </Section>

          <Section title="2. How We Use Data">
            <p>We use your data only to:</p>
            <ul>
              <li>Provide the NDLedger service,</li>
              <li>Extract and organise insights using AI, and</li>
              <li>Authenticate your account.</li>
            </ul>
            <p>
              We do not sell your data, share it with advertisers, or use it to
              train AI models.
            </p>
          </Section>

          <Section title="3. Data Storage">
            <p>
              Your data is stored on Supabase servers in Sydney, Australia.
              Data is encrypted in transit using TLS and encrypted at rest on
              disk. Row Level Security is enforced at the database layer so
              that you can only access rows tied to your own account.
            </p>
          </Section>

          <Section title="4. Third Parties">
            <p>NDLedger relies on the following third-party services:</p>
            <ul>
              <li>
                <strong>Supabase</strong> — database and authentication.
              </li>
              <li>
                <strong>Vercel</strong> — application hosting.
              </li>
              <li>
                <strong>Anthropic (Claude)</strong> — AI processing. Transcripts
                are sent to Claude for extraction. Per Anthropic&apos;s policy,
                API content is processed to return a response and is not
                retained or used for training.
              </li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              Your data is kept until you delete it. You can delete individual
              transcripts — which cascades to the topics and insights extracted
              from them — or delete your entire account via Settings.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>You can, at any time:</p>
            <ul>
              <li>Access your data through the app,</li>
              <li>Delete your data through the app, and</li>
              <li>Correct your data through the app.</li>
            </ul>
            <p>
              A dedicated data export feature is not yet available. If you need
              an export before we ship it, contact us.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              NDLedger uses session cookies for authentication only. We do not
              use tracking cookies, advertising cookies, or third-party
              cookies.
            </p>
          </Section>

          <Section title="8. Children">
            <p>
              NDLedger is not intended for users under 18. We do not knowingly
              collect data from children. If you believe a child has provided
              us with personal information, contact us and we will delete it.
            </p>
          </Section>

          <Section title="9. Australian Privacy Act">
            <p>
              NDLedger complies with the Australian Privacy Principles (APPs)
              under the Privacy Act 1988 (Cth). If you believe we have breached
              the APPs, you can lodge a complaint with the Office of the
              Australian Information Commissioner (OAIC) at{" "}
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0D9488] hover:underline"
              >
                oaic.gov.au
              </a>
              .
            </p>
          </Section>

          <Section title="10. International Users">
            <p>
              If you access NDLedger from outside Australia, your data will be
              transferred to and stored in Australia.
            </p>
          </Section>

          <Section title="11. Security">
            <p>
              We use industry-standard security measures including TLS
              encryption in transit, encryption at rest, and Row Level Security
              at the database layer. No system is perfectly secure, but we take
              reasonable steps to protect your data.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about this policy or how your data is handled?
            </p>
            <ul>
              <li>
                <strong>Email:</strong> hobbesinvestments@gmail.com
              </li>
              <li>
                <strong>Address:</strong> Ipswich, Queensland, Australia 4305
              </li>
            </ul>
          </Section>

          <Section title="13. Changes to This Policy">
            <p>
              We may update this policy from time to time. If we make material
              changes, we will notify you by email or through an in-app notice
              before the changes take effect.
            </p>
          </Section>

          <p className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500 italic">
            This policy is published for transparency. Contact us with
            questions.
          </p>
        </article>
      </main>

      <footer className="px-4 py-10 bg-[#1E3A5F] text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NDLedger logo"
              width={1536}
              height={1024}
              className="h-10 w-auto"
            />
            <span className="font-semibold">NDLedger</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Privacy Policy
            </Link>
            <a href="#" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Contact
            </a>
          </nav>
          <p className="text-xs text-white/60">© 2026 NDLedger</p>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-[#1E3A5F] mb-3">{title}</h2>
      <div className="text-slate-600 leading-relaxed text-base space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_strong]:text-slate-800">
        {children}
      </div>
    </section>
  );
}
