import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronDown } from "lucide-react";

export const metadata = {
  title: "Pricing — NDLedger",
  description: "Simple pricing. Start for free. Upgrade when you are ready.",
};

const TIERS = [
  {
    name: "Free",
    priceLabel: "$0",
    period: null,
    description: "Get started and see the value before you commit.",
    cta: "Get Started",
    ctaHref: "/login",
    highlight: false,
    features: [
      "5 transcripts total",
      "Full AI extraction on every session",
      "Seven auto-assigned categories",
      "Full-text search",
      "Interactive mind map",
      "Privacy-first: transcripts deleted after extraction",
    ],
    note: null,
  },
  {
    name: "Pro",
    priceLabel: "$12",
    period: "per month",
    description:
      "For people who think best in conversation and cannot afford to lose what comes out of it.",
    cta: "Join the Waitlist",
    ctaHref: "#waitlist",
    highlight: true,
    features: [
      "Unlimited transcripts",
      "Full AI extraction on every session",
      "Seven auto-assigned categories",
      "Full-text search",
      "Interactive mind map",
      "Privacy-first: transcripts deleted after extraction",
      "Priority extraction queue",
    ],
    note: "Paid plans coming soon. Join the waitlist to be first.",
  },
  {
    name: "Enterprise",
    priceLabel: "$99",
    period: "per month",
    description:
      "For teams that run on AI conversations and need a shared knowledge layer.",
    cta: "Join the Waitlist",
    ctaHref: "#waitlist",
    highlight: false,
    features: [
      "Everything in Pro",
      "Multiple users and seats",
      "Shared team knowledge library",
      "Admin dashboard",
      "Usage reporting",
      "Priority support",
    ],
    note: null,
  },
];

const FAQ_ITEMS = [
  {
    q: "What counts as a transcript?",
    a: "Each conversation you paste or record counts as one transcript. Transcripts are capped at 100,000 words per conversation.",
  },
  {
    q: "Is my data private?",
    a: "Yes. The original transcript is deleted immediately after extraction. Only the structured insights are stored, in a database only your account can read.",
  },
  {
    q: "Which AI tools does NDLedger work with?",
    a: "Any AI tool you can copy text from: ChatGPT, Claude, Gemini, Grok, Perplexity, and more. You can also record audio directly in the browser.",
  },
  {
    q: "When are paid plans launching?",
    a: "Soon. Join the waitlist above and you will be the first to know.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900" id="top">
      {/* Top nav */}
      <header className="bg-[#1E3A5F]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
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
              className="hidden sm:inline-block text-sm font-medium text-white/80 hover:text-[#5EEAD4]"
            >
              ← Back to home
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 hover:text-[#5EEAD4]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Scroll down arrow */}
      <div className="flex justify-center py-2">
        <a href="#bottom" className="text-[#0D9488] hover:text-[#0F766E] transition-colors" aria-label="Scroll to bottom">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>

      {/* Hero */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#0D9488] mb-4">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0D9488] mb-4 leading-tight">
            <span className="block">Simple pricing.</span>
            <span className="block">No surprises.</span>
          </h1>
          <p className="text-lg text-slate-500">
            Start for free. Upgrade when you are ready. No credit card required.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-7 flex flex-col gap-5 ${
                tier.highlight
                  ? "bg-[#1E3A5F] border-[1.5px] border-[#1E3A5F] shadow-lg"
                  : "bg-white border-[1.5px] border-slate-200"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0D9488] text-white text-xs font-semibold tracking-wide uppercase px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Tier header */}
              <div className="flex flex-col gap-2">
                <p
                  className={`text-xs font-semibold tracking-widest uppercase ${
                    tier.highlight ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      tier.highlight ? "text-white" : "text-[#1E3A5F]"
                    }`}
                  >
                    {tier.priceLabel}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-slate-500">
                      /{tier.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    tier.highlight ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {tier.description}
                </p>
              </div>

              {/* CTA */}
              {tier.highlight ? (
                <a
                  href={tier.ctaHref}
                  className="block text-center bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-5 py-3 rounded-lg text-sm transition-colors"
                >
                  {tier.cta}
                </a>
              ) : tier.ctaHref.startsWith("#") ? (
                <a
                  href={tier.ctaHref}
                  className="block text-center border-[1.5px] border-slate-200 text-[#1E3A5F] font-semibold px-5 py-3 rounded-lg text-sm hover:border-[#0D9488] transition-colors"
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  href={tier.ctaHref}
                  className="block text-center border-[1.5px] border-slate-200 text-[#1E3A5F] font-semibold px-5 py-3 rounded-lg text-sm hover:border-[#0D9488] transition-colors"
                >
                  {tier.cta}
                </Link>
              )}

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 text-sm leading-relaxed ${
                      tier.highlight ? "text-white/85" : "text-slate-700"
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        tier.highlight ? "text-[#0D9488]" : "text-[#0D9488]"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {tier.note && (
                <p className="text-xs text-white/50 text-center leading-relaxed">
                  {tier.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section className="px-4 py-16 sm:py-20 bg-[#F8FAFC]" id="waitlist">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] mb-3">
            Be first when Pro launches.
          </h2>
          <p className="text-base text-slate-500 leading-relaxed mb-8">
            Paid plans are coming soon. Join the waitlist and we will let you
            know the moment they go live.
          </p>
          <WaitlistForm />
          <p className="text-xs text-slate-500 mt-3">
            No spam. No commitment. Unsubscribe any time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#1E3A5F]">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group bg-white rounded-lg border border-slate-200 p-5 open:border-[#0D9488]"
              >
                <summary className="cursor-pointer font-semibold text-[#1E3A5F] flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#0D9488] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll up arrow */}
      <div className="flex justify-center py-2" id="bottom">
        <a href="#top" className="text-[#0D9488] hover:text-[#0F766E] transition-colors" aria-label="Scroll to top">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </a>
      </div>

      {/* Footer */}
      <footer className="px-4 py-10 bg-[#1E3A5F] border-t border-white/10 text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NDLedger logo"
              width={1536}
              height={1024}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-white/80 hover:text-[#5EEAD4] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/80 hover:text-[#5EEAD4] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-white/80 hover:text-[#5EEAD4] transition-colors"
            >
              Contact
            </Link>
          </nav>
          <p className="text-xs text-white/60">&copy; 2026 NDLedger</p>
          <a href="https://dofollow.tools" target="_blank" rel="noopener noreferrer">
            <img src="https://dofollow.tools/badge/badge_transparent.svg" alt="Featured on Dofollow.Tools" width="200" height="54" />
          </a>
        </div>
      </footer>
    </div>
  );
}

function WaitlistForm() {
  return (
    <form className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-lg border-[1.5px] border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-[#0D9488] transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold whitespace-nowrap transition-colors"
      >
        Join the Waitlist
      </button>
    </form>
  );
}
