'use client';

import { useState } from 'react';

const TIERS = [
  {
    name: 'Free',
    price: null,
    priceLabel: '$0',
    period: null,
    description: 'Get started and see the value before you commit.',
    cta: 'Get Started',
    ctaHref: '/signup',
    ctaStyle: 'outline',
    highlight: false,
    features: [
      '5 transcripts total',
      'Full AI extraction on every session',
      'Seven auto-assigned categories',
      'Full-text search',
      'Interactive mind map',
      'Privacy-first: transcripts deleted after extraction',
    ],
    note: null,
  },
  {
    name: 'Pro',
    price: 12,
    priceLabel: '$12',
    period: 'per month',
    description: 'For people who think best in conversation and cannot afford to lose what comes out of it.',
    cta: 'Join the Waitlist',
    ctaHref: '#waitlist',
    ctaStyle: 'primary',
    highlight: true,
    features: [
      'Unlimited transcripts',
      'Full AI extraction on every session',
      'Seven auto-assigned categories',
      'Full-text search',
      'Interactive mind map',
      'Privacy-first: transcripts deleted after extraction',
      'Priority extraction queue',
    ],
    note: 'Paid plans coming soon. Join the waitlist to be first.',
  },
  {
    name: 'Enterprise',
    price: 99,
    priceLabel: '$99',
    period: 'per month',
    description: 'For teams that run on AI conversations and need a shared knowledge layer.',
    cta: 'Join the Waitlist',
    ctaHref: '#waitlist',
    ctaStyle: 'outline',
    highlight: false,
    features: [
      'Everything in Pro',
      'Multiple users and seats',
      'Shared team knowledge library',
      'Admin dashboard',
      'Usage reporting',
      'Priority support',
    ],
    note: null,
  },
];

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Replace with your actual waitlist endpoint
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <nav style={styles.nav}>
        <a href="/" style={styles.navBrand}>
          <img src="/logo.png" alt="NDLedger" style={styles.navIconImg} />
          <span style={styles.navName}>
            <span style={styles.navND}>ND</span>
            <span style={styles.navLedger}>Ledger</span>
          </span>
        </a>
        <a href="/signin" style={styles.navSignIn}>Sign in</a>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Pricing</p>
        <h1 style={styles.heroTitle}>
          Simple pricing.<br />No surprises.
        </h1>
        <p style={styles.heroSub}>
          Start for free. Upgrade when you are ready. No credit card required.
        </p>
      </section>

      {/* Tiers */}
      <section style={styles.tiersSection}>
        <div style={styles.tiersGrid}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                ...styles.tierCard,
                ...(tier.highlight ? styles.tierCardHighlight : {}),
              }}
            >
              {tier.highlight && (
                <div style={styles.popularBadge}>Most Popular</div>
              )}
              <div style={styles.tierHeader}>
                <h2 style={{
                  ...styles.tierName,
                  ...(tier.highlight ? styles.tierNameHighlight : {}),
                }}>
                  {tier.name}
                </h2>
                <div style={styles.tierPriceRow}>
                  <span style={{
                    ...styles.tierPrice,
                    ...(tier.highlight ? styles.tierPriceHighlight : {}),
                  }}>
                    {tier.priceLabel}
                  </span>
                  {tier.period && <span style={styles.tierPeriod}>/{tier.period}</span>}
                </div>
                <p style={{
                  ...styles.tierDesc,
                  ...(tier.highlight ? styles.tierDescHighlight : {}),
                }}>
                  {tier.description}
                </p>
              </div>

              <a
                href={tier.ctaHref}
                style={{
                  ...styles.ctaBtn,
                  ...(tier.ctaStyle === 'primary' ? styles.ctaBtnPrimary : styles.ctaBtnOutline),
                  ...(tier.highlight && tier.ctaStyle === 'outline' ? styles.ctaBtnOutlineLight : {}),
                }}
              >
                {tier.cta}
              </a>

              <ul style={styles.featureList}>
                {tier.features.map((f) => (
                  <li key={f} style={{
                    ...styles.featureItem,
                    ...(tier.highlight ? styles.featureItemHighlight : {}),
                  }}>
                    <span style={{
                      ...styles.featureCheck,
                      ...(tier.highlight ? styles.featureCheckHighlight : {}),
                    }}>
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {tier.note && (
                <p style={styles.tierNote}>{tier.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section style={styles.waitlistSection} id="waitlist">
        <div style={styles.waitlistInner}>
          <h2 style={styles.waitlistTitle}>
            Be first when Pro launches.
          </h2>
          <p style={styles.waitlistSub}>
            Paid plans are coming soon. Join the waitlist and we will let you know the moment they go live.
          </p>
          {submitted ? (
            <div style={styles.waitlistSuccess}>
              You are on the list. We will be in touch.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} style={styles.waitlistForm}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.waitlistInput}
              />
              <button
                type="submit"
                style={styles.waitlistBtn}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </form>
          )}
          <p style={styles.waitlistMicro}>No spam. No commitment. Unsubscribe any time.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Common questions</h2>
        <div style={styles.faqGrid}>
          {[
            {
              q: 'What counts as a transcript?',
              a: 'Each conversation you paste or record counts as one transcript. Transcripts are capped at 100,000 words per conversation.',
            },
            {
              q: 'Is my data private?',
              a: 'Yes. The original transcript is deleted immediately after extraction. Only the structured insights are stored, in a database only your account can read.',
            },
            {
              q: 'Which AI tools does NDLedger work with?',
              a: 'Any AI tool you can copy text from: ChatGPT, Claude, Gemini, Grok, Perplexity, and more. You can also record audio directly in the browser.',
            },
            {
              q: 'When are paid plans launching?',
              a: 'Soon. Join the waitlist above and you will be the first to know.',
            },
          ].map((item) => (
            <div key={item.q} style={styles.faqItem}>
              <h3 style={styles.faqQ}>{item.q}</h3>
              <p style={styles.faqA}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          NDLedger is a product of AREASPEC PTY LTD &copy; {new Date().getFullYear()}.
          {' '}<a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
          {' · '}<a href="/terms" style={styles.footerLink}>Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

const colors = {
  navy: '#1E3A5F',
  navyLight: '#2a4d78',
  teal: '#0D9488',
  tealDark: '#0b7d72',
  white: '#FFFFFF',
  offWhite: '#F8FAFC',
  softGreen: '#86EFAC',
  grey: '#6b7280',
  greyLight: '#e5e7eb',
  text: '#1E3A5F',
};

const styles = {
  page: {
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    background: colors.white,
    color: colors.text,
    minHeight: '100vh',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: `1px solid ${colors.greyLight}`,
    background: colors.white,
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  navIconImg: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  navName: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  navND: {
    color: colors.navy,
  },
  navLedger: {
    color: colors.teal,
  },
  navSignIn: {
    fontSize: 14,
    color: colors.grey,
    textDecoration: 'none',
  },
  hero: {
    textAlign: 'center',
    padding: '72px 24px 48px',
    maxWidth: 640,
    margin: '0 auto',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: colors.teal,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.15,
    color: colors.navy,
    marginBottom: 16,
    letterSpacing: '-0.02em',
  },
  heroSub: {
    fontSize: 18,
    color: colors.grey,
    lineHeight: 1.6,
  },
  tiersSection: {
    padding: '48px 24px 72px',
    maxWidth: 1080,
    margin: '0 auto',
  },
  tiersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
    alignItems: 'start',
  },
  tierCard: {
    background: colors.white,
    border: `1.5px solid ${colors.greyLight}`,
    borderRadius: 16,
    padding: '32px 28px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  tierCardHighlight: {
    background: colors.navy,
    border: `1.5px solid ${colors.navy}`,
    boxShadow: '0 8px 32px rgba(26,47,78,0.18)',
  },
  popularBadge: {
    position: 'absolute',
    top: -13,
    left: '50%',
    transform: 'translateX(-50%)',
    background: colors.teal,
    color: colors.white,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '4px 14px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
  },
  tierHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  tierName: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: colors.grey,
    margin: 0,
  },
  tierNameHighlight: {
    color: 'rgba(255,255,255,0.6)',
  },
  tierPriceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
  },
  tierPrice: {
    fontSize: 40,
    fontWeight: 700,
    color: colors.navy,
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  tierPriceHighlight: {
    color: colors.white,
  },
  tierPeriod: {
    fontSize: 14,
    color: colors.grey,
  },
  tierDesc: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 1.6,
    margin: 0,
  },
  tierDescHighlight: {
    color: 'rgba(255,255,255,0.7)',
  },
  ctaBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '12px 20px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  ctaBtnPrimary: {
    background: colors.teal,
    color: colors.white,
    border: 'none',
  },
  ctaBtnOutline: {
    background: 'transparent',
    color: colors.navy,
    border: `1.5px solid ${colors.greyLight}`,
  },
  ctaBtnOutlineLight: {
    color: colors.white,
    border: '1.5px solid rgba(255,255,255,0.3)',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  featureItem: {
    fontSize: 14,
    color: colors.text,
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    lineHeight: 1.5,
  },
  featureItemHighlight: {
    color: 'rgba(255,255,255,0.85)',
  },
  featureCheck: {
    color: colors.teal,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
  featureCheckHighlight: {
    color: colors.teal,
  },
  tierNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
  },
  waitlistSection: {
    background: colors.offWhite,
    padding: '72px 24px',
  },
  waitlistInner: {
    maxWidth: 520,
    margin: '0 auto',
    textAlign: 'center',
  },
  waitlistTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 12,
    letterSpacing: '-0.02em',
  },
  waitlistSub: {
    fontSize: 16,
    color: colors.grey,
    lineHeight: 1.6,
    marginBottom: 28,
  },
  waitlistForm: {
    display: 'flex',
    gap: 10,
    maxWidth: 420,
    margin: '0 auto 12px',
  },
  waitlistInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 8,
    border: `1.5px solid ${colors.greyLight}`,
    fontSize: 15,
    color: colors.text,
    outline: 'none',
    background: colors.white,
  },
  waitlistBtn: {
    padding: '12px 20px',
    borderRadius: 8,
    background: colors.teal,
    color: colors.white,
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  waitlistSuccess: {
    padding: '16px 24px',
    background: colors.white,
    border: `1.5px solid ${colors.teal}`,
    borderRadius: 8,
    color: colors.teal,
    fontWeight: 600,
    fontSize: 15,
    maxWidth: 420,
    margin: '0 auto 12px',
  },
  waitlistMicro: {
    fontSize: 12,
    color: colors.grey,
    margin: 0,
  },
  faqSection: {
    padding: '72px 24px',
    maxWidth: 880,
    margin: '0 auto',
  },
  faqTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 36,
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 32,
  },
  faqItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  faqQ: {
    fontSize: 15,
    fontWeight: 600,
    color: colors.navy,
    margin: 0,
  },
  faqA: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 1.6,
    margin: 0,
  },
  footer: {
    borderTop: `1px solid ${colors.greyLight}`,
    padding: '24px 32px',
    textAlign: 'center',
    background: colors.navy,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
  },
  footerLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'underline',
  },
};
