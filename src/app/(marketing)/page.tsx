import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  Upload,
  Sparkles,
  Layers,
  Hash,
  Lightbulb,
  GitBranch,
  Search,
  ChevronDown,
} from "lucide-react";

// Marketing landing page at /. Server component so we can auth-check
// up-front and bounce already-signed-in users straight to the dashboard
// instead of forcing them through marketing copy on every refresh.
export default async function MarketingHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top nav */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="NDLedger logo"
            width={1536}
            height={1024}
            className="h-10 w-auto"
            priority
          />
          <Link
            href="/login"
            className="text-sm font-medium text-[#1E3A5F] hover:text-[#0D9488]"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Image
            src="/logo.png"
            alt="NDLedger"
            width={1536}
            height={1024}
            className="mx-auto h-24 w-auto mb-8"
            priority
          />
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Transform scattered AI conversations into an organised, searchable
            knowledge library.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1E3A5F]">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              icon={<Upload className="h-8 w-8" />}
              title="1. Upload"
              desc="Paste an AI conversation transcript or record audio directly in the browser."
            />
            <Step
              icon={<Sparkles className="h-8 w-8" />}
              title="2. Extract"
              desc="Claude reads the conversation and pulls out topics, decisions, commitments, tasks, insights, and pivots."
            />
            <Step
              icon={<Layers className="h-8 w-8" />}
              title="3. Organise"
              desc="Browse your categorised library, search across everything, and explore connections in the mind map."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1E3A5F]">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Feature
              icon={<Hash className="h-6 w-6" />}
              title="Topics"
              desc="Auto-categorised topics across business, technical, personal, and other contexts."
            />
            <Feature
              icon={<Lightbulb className="h-6 w-6" />}
              title="Insights"
              desc="Decisions, commitments, tasks, insights, and pivots, extracted automatically and tagged by personal or business context."
            />
            <Feature
              icon={<GitBranch className="h-6 w-6" />}
              title="Mind Map"
              desc="Visual graph showing how your topics, categories, and insights connect across every conversation."
            />
            <Feature
              icon={<Search className="h-6 w-6" />}
              title="Search"
              desc="Full-text search across every insight, filterable by type."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1E3A5F]">
            Frequently asked
          </h2>
          <div className="space-y-3">
            <Faq
              q="What is NDLedger?"
              a="NDLedger turns your AI chat history into a searchable knowledge library. Upload transcripts from any AI assistant and we extract the topics, decisions, commitments, tasks, insights, and pivots automatically, so the work you do with AI accumulates into something you can come back to."
            />
            <Faq
              q="How does extraction work?"
              a="When you upload a transcript, Claude reads through it and identifies discrete topics and the insights tied to each one. Each insight is tagged by type (decision, commitment, insight, pivot, or task) and by personal/business context, then stored in your library and linked to the originating transcript."
            />
            <Faq
              q="What are the categories?"
              a="Topics fall into six categories: Business & Monetisation, Go to Market, Legal & Compliance, Personal & Ideas, Product & Features, and Technical. Categories are assigned automatically during extraction and you can filter and explore by category in the mind map."
            />
            <Faq
              q="Is my data private?"
              a="Yes. Your data lives in a row-level-secured Postgres database. Only your authenticated session can read or write your rows. We don't share, sell, or train models on your data."
            />
            <Faq
              q="How do I delete my data?"
              a="Go to Settings → Danger Zone → Delete My Account. This permanently removes every transcript, topic, and insight tied to your account, plus the account itself. The action cannot be undone."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
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

function Step({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-[#0D9488] text-white">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-[#1E3A5F]">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-lg border border-slate-200 bg-white hover:border-[#0D9488] transition-colors">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg mb-3 bg-[#0D9488] text-white">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1 text-[#1E3A5F]">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-white rounded-lg border border-slate-200 p-5 open:border-[#0D9488]">
      <summary className="cursor-pointer font-semibold text-[#1E3A5F] flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <ChevronDown className="h-5 w-5 shrink-0 text-[#0D9488] transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
    </details>
  );
}
