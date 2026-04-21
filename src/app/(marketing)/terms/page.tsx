import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms of Service | NDLedger",
  description: "The terms that govern your use of NDLedger.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" aria-label="NDLedger home">
            <Image
              src="/logo.png"
              alt="NDLedger logo"
              width={1536}
              height={1024}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
  href="/"
  className="hidden sm:inline-block text-sm font-medium text-[#1E3A5F] hover:text-[#0D9488]"
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
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mb-10">Last updated: April 2026</p>

          <div className="mb-10 text-slate-600 leading-relaxed space-y-3">
            <p>
              These Terms form a contract between you and{" "}
              <strong className="text-slate-800">AREASPEC PTY LTD</strong> (ACN
              690 941 078), the Australian company behind{" "}
              <strong className="text-slate-800">NDLedger</strong>
              {" "}(&quot;NDLedger&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;). They apply every time you use ndledger.com or
              any related service we operate.
            </p>
            <p>
              We have written them in plain English. If something is unclear,
              please email{" "}
              <a
                href="mailto:privacy@ndledger.com"
                className="text-[#0D9488] hover:underline"
              >
                privacy@ndledger.com
              </a>
              .
            </p>
          </div>

          <Section title="1. Acceptance">
            <p>
              By using NDLedger, you agree to these Terms of Service. If you
              do not agree, please do not use the service. You must be 18
              years or older to use NDLedger.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              NDLedger is an AI-powered knowledge library. It lets you upload
              AI conversation transcripts, automatically extracts decisions,
              commitments, insights, tasks, and pivots from them, organises
              the results into searchable topics and categories, and
              visualises the connections between them as a mind map.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>When you create an account, you agree to:</p>
            <ul>
              <li>provide accurate information;</li>
              <li>maintain the security of your account credentials;</li>
              <li>
                take responsibility for all activity that occurs under your
                account; and
              </li>
              <li>
                notify us immediately of any unauthorised access to, or use
                of, your account.
              </li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul>
              <li>upload illegal, harmful, or offensive content;</li>
              <li>infringe anyone&apos;s intellectual property rights;</li>
              <li>
                attempt to gain unauthorised access to the service, other
                users&apos; accounts, or our underlying systems;
              </li>
              <li>harass, harm, or defraud other users;</li>
              <li>
                use automated systems to access or interact with the service
                without our written permission; or
              </li>
              <li>
                reverse engineer, decompile, or disassemble any part of the
                service.
              </li>
            </ul>
          </Section>

          <Section title="5. User Content">
            <p>
              You retain ownership of the content you upload to NDLedger. By
              uploading content, you grant NDLedger a limited licence to
              process and store that content on your behalf to provide the
              service. We do not use your content to train AI models, we do
              not sell it, and we do not share it with advertisers.
            </p>
            <p>
              Transcripts are sent to Anthropic&apos;s API for extraction and
              are then deleted from our servers, as described in our{" "}
              <Link href="/privacy" className="text-[#0D9488] hover:underline">
                Privacy Policy
              </Link>
              . Extracted insights (decisions, commitments, topics, and so
              on) remain in your account until you delete them.
            </p>
            <p>
              The &quot;Record Voice&quot; feature uses your browser&apos;s
              built-in Web Speech API. Audio is transcribed locally in your
              browser and never reaches our servers. Only the resulting text
              is sent to NDLedger.
            </p>
            <p>
              You are solely responsible for the content you upload and for
              ensuring you have the right to upload it.
            </p>
          </Section>

          <Section title="6. AI Processing">
            <p>
              Transcripts you upload are processed by Anthropic&apos;s Claude
              to extract insights. AI extraction may not be accurate in every
              case. Outputs can contain errors, omissions, or
              misinterpretations. You are responsible for reviewing extracted
              insights for accuracy. NDLedger is not responsible for any
              decisions you make based on AI-extracted information.
            </p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              NDLedger is owned and operated by AREASPEC PTY LTD (ACN 690 941
              078), the Australian company behind NDLedger. The NDLedger
              name, logo, and branding belong to AREASPEC PTY LTD. These
              Terms do not grant you any right to use those trademarks, or
              any other proprietary material of AREASPEC PTY LTD, without our
              prior written permission.
            </p>
          </Section>

          <Section title="8. Service Availability">
            <p>
              NDLedger does not guarantee continuous uptime. We may modify,
              suspend, or discontinue the service, in whole or in part, at
              any time, with reasonable notice where practical.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              NDLedger is provided on an &quot;as is&quot; basis. To the
              fullest extent permitted by law, NDLedger and AREASPEC PTY LTD
              are not liable for any indirect, incidental, special, or
              consequential damages arising from your use of the service. Our
              total aggregate liability to you for any claim arising from, or
              related to, these Terms or your use of NDLedger is capped at
              AUD $50.
            </p>
            <p>
              Nothing in these Terms excludes or limits any rights you have
              under the Australian Consumer Law that cannot lawfully be
              excluded.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              You may delete your account at any time via Settings → Danger
              Zone → Delete My Account. We may suspend or terminate your
              account if you breach these Terms. On termination, whether by
              you or by us, your data is deleted as described in our{" "}
              <Link href="/privacy" className="text-[#0D9488] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms are governed by the laws of Queensland, Australia.
              Any dispute arising from these Terms, or from your use of
              NDLedger, will be resolved in the courts of Queensland,
              Australia.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>Questions about these Terms?</p>
            <ul>
              <li>
                <strong>Email:</strong> privacy@ndledger.com
              </li>
              <li>
                <strong>Entity:</strong> AREASPEC PTY LTD (ACN 690 941 078)
              </li>
              <li>
                <strong>Address:</strong> Ipswich, Queensland, Australia 4305
              </li>
            </ul>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              We may update these Terms from time to time. We will notify you
              of material changes by email or through an in-app notice.
              Continued use of NDLedger after changes take effect means you
              accept the updated Terms.
            </p>
          </Section>

          <p className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500 italic">
            These terms are published for transparency. Please contact us
            with any questions.
          </p>
        </article>
      </main>

      <footer className="px-4 py-10 bg-[#1E3A5F] text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="NDLedger logo"
            width={1536}
            height={1024}
            className="h-10 w-auto"
          />
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Terms of Service
            </Link>
           <a href="mailto:privacy@ndledger.com" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
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
