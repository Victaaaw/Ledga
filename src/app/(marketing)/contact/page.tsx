import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Building2 } from "lucide-react";

export const metadata = {
  title: "Contact — NDLedger",
  description: "Get in touch with the NDLedger team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900" id="top">
      <header className="bg-[#1E3A5F]">
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

      <main className="px-4 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0D9488] mb-4">
            Contact
          </h1>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Have a question about NDLedger, your data, or your account? We are happy to help.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-slate-200 bg-white">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg mb-4 bg-[#0D9488] text-white">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[#1E3A5F] mb-2">Email</h2>
              <a
                href="mailto:privacy@ndledger.com"
                className="text-sm text-[#0D9488] hover:underline"
              >
                privacy@ndledger.com
              </a>
            </div>

            <div className="p-6 rounded-lg border border-slate-200 bg-white">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg mb-4 bg-[#0D9488] text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[#1E3A5F] mb-2">Entity</h2>
              <p className="text-sm text-slate-600">
                AREASPEC PTY LTD<br />
                ACN 690 941 078
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200 bg-white">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg mb-4 bg-[#0D9488] text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[#1E3A5F] mb-2">Address</h2>
              <p className="text-sm text-slate-600">
                Ipswich, Queensland<br />
                Australia 4305
              </p>
            </div>
          </div>

          <p className="mt-12 text-sm text-slate-500">
            We aim to respond within 2 business days.
          </p>
        </div>
      </main>

      {/* Scroll up arrow */}
      <div className="flex justify-center py-2" id="bottom">
        <a href="#top" className="text-[#0D9488] hover:text-[#0F766E] transition-colors" aria-label="Scroll to top">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </a>
      </div>

      <footer className="px-4 py-10 bg-[#1E3A5F] text-white">
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
            <Link href="/pricing" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/80 hover:text-[#5EEAD4] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-[#5EEAD4] font-medium">
              Contact
            </Link>
          </nav>
          <p className="text-xs text-white/60">&copy; 2026 NDLedger</p>
        </div>
      </footer>
    </div>
  );
}
