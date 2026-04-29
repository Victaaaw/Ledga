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
  Shield,
  CheckCircle,
} from "lucide-react";

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
            style={{ height: "auto", maxHeight: "6rem" }}
            priority
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-5 leading-tight">
            Your AI conversations are full of good ideas.
            <br /> Stop losing them.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            NDLedger extracts every decision, task, and insight from your AI
            chats and builds you a searchable library. No note-taking required.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors"
          >
            Create My Free Library
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            Free to use. No credit card. Works with any AI tool.
          </p>
        </div>
      </section>

      {/* Pain */}
      <section className="px-4 py-14 sm:py-16 bg-[#1E3A5F]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Sound familiar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PainCard text="You made a big product decision last month, and now you can't find it." />
            <PainCard text="You solved this exact problem before, in a chat you'll never locate again." />
            <PainCard text="Your AI history is sorted by date. Your brain isn't." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-[#1E3A5F]">
            Three steps. No extra effort.
          </h2>
          <p className="text-center text-slate-500 mb-12">
            Add a conversation; your library builds itself from there.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              icon={<Upload className="h-8 w-8" />}
              title="1. Paste or record"
              desc="Drop in a transcript from any AI tool: ChatGPT, Claude, Gemini, Perplexity, anything. Or record audio right in the browser; Whisper handles transcription automatically."
            />
            <Step
              icon={<Sparkles className="h-8 w-8" />}
              title="2. We extract everything"
              desc="Claude reads the conversation and pulls out every decision, commitment, task, insight, and pivot. The original transcript is deleted immediately after."
            />
            <Step
              icon={<Layers className="h-8 w-8" />}
              title="3. Your library builds itself"
              desc="Browse by topic or category, search across everything, or see how your ideas connect in the mind map. The work accumulates; you don't have to."
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-[#1E3A5F]">
            Everything scattered, now organised
          </h2>
          <p className="text-center text-slate-500 mb-12">
            Built for people who do their best thinking in conversation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Feature
              icon={<Hash className="h-6 w-6" />}
              title="Auto-organised topics"
              desc="Every conversation is sorted into six business-relevant categories (and one personal). No tagging, no manual sorting, no system to maintain."
            />
            <Feature
              icon={<Lightbulb className="h-6 w-6" />}
              title="Six types of insight"
              desc="Decisions, commitments, tasks, insights, and pivots: each labelled and searchable, not buried inside paragraphs of transcript."
            />
            <Feature
              icon={<GitBranch className="h-6 w-6" />}
              title="Mind map view"
              desc="See how topics and ideas connect across weeks of conversations. Patterns you'd never spot by scrolling through chat history."
            />
            <Feature
              icon={<Search className="h-6 w-6" />}
              title="Full-text search"
              desc="One search box. Every insight you've ever extracted. Filter by type to find decisions, tasks, or ideas in seconds."
            />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="px-4 py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#0D9488] text-white mb-6">
            <Shield className="h-7 w-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1E3A5F]">
            Built for people who think out loud, privately.
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Paste your most sensitive strategy sessions without hesitation. Your
            transcript is deleted the moment extraction finishes. The only thing
            we keep is the structured insight, not the raw conversation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-left">
            <TrustPoint text="Transcript deleted immediately after extraction" />
            <TrustPoint text="Row-level security: only your account reads your data" />
            <TrustPoint text="We never share, sell, or train on your data" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1E3A5F]">
            Questions
          </h2>
          <div className="space-y-3">
            <Faq
              q="Which AI tools does this work with?"
              a="Any of them. ChatGPT, Claude, Gemini, Grok, Perplexity. If you can copy-paste the conversation, NDLedger can extract it. You can also record audio directly in the browser and we'll transcribe it for you."
            />
            <Faq
              q="Is my data private?"
              a="Yes. Transcripts are deleted immediately after extraction. Only the structured insights are stored, in a row-level-secured database that only your authenticated account can access. We don't share, sell, or train models on your data."
            />
            <Faq
              q="What if the extraction misses something important?"
              a="You can paste the transcript again at any time. Extraction runs again and adds any new insights it finds, without duplicating ones already in your library."
            />
            <Faq
              q="How does extraction work?"
              a="When you paste or record a conversation, Claude reads through it and identifies discrete topics and the insights within each. Each insight is labelled by type (decision, commitment, task, insight, or pivot) and assigned to one of seven categories, then stored in your library. The original text is deleted immediately after."
            />
            <Faq
              q="How do I delete my data?"
              a="Delete individual transcripts from your dashboard at any time. To remove everything, go to Settings → Danger Zone → Delete My Account. This permanently removes all your data and the account itself. It cannot be undone."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 sm:py-24 bg-[#1E3A5F]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start building the library your AI sessions deserve.
          </h2>
          <p className="text-lg text-white/70 mb-10">
            Free to use. No credit card. Works with any AI tool.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors"
          >
            Create My Free Library
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10 bg-[#1E3A5F] border-t border-white/10 text-white">
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

function PainCard({ text }: { text: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-5">
      <p className="text-white/90 text-base leading-relaxed">{text}</p>
    </div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle className="h-5 w-5 text-[#0D9488] shrink-0 mt-0.5" />
      <span className="text-sm text-slate-700">{text}</span>
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
