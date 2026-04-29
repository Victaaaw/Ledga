# Product Marketing Context

*Last updated: 2026-04-29*

## Product Overview
**One-liner:** Transform scattered AI conversations into an organised, searchable knowledge library.
**What it does:** NDLedger takes AI conversation transcripts (pasted text or recorded audio) and uses Claude to automatically extract discrete topics, decisions, commitments, tasks, insights, and pivots. The original transcript is deleted after extraction — only the structured, searchable insights are kept. Users browse their library by category, search across all insights, and explore connections in an interactive mind map.
**Product category:** AI productivity / knowledge management ("second brain for AI power users")
**Product type:** SaaS (web app)
**Business model:** Currently free. Paid tier on roadmap. <!-- TODO: confirm pricing plans when defined -->

## Target Audience
**Target users:** Solo founders, neurodivergent entrepreneurs (ADHD/autism), and knowledge workers who heavily use AI for thinking, planning, and ideation.
**Decision-makers:** The user is the buyer — no enterprise sales motion.
**Primary use case:** Turning AI chat sessions into a searchable, persistent knowledge library so insights don't get lost.
**Jobs to be done:**
- "Stop losing the good ideas I get when I'm thinking out loud with AI"
- "Build a searchable record of my past decisions and commitments"
- "See patterns and connections across months of AI-assisted work"
**Use cases:**
- Founder reviewing all past product decisions before a strategy meeting
- ADHD entrepreneur who thinks best in conversation, needs structure after the fact
- Knowledge worker who uses ChatGPT/Claude daily and wants to retain outputs across platforms

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Solo founder | Execution speed, staying on top of decisions | AI conversations are ephemeral; insights disappear | Every decision and commitment is captured and searchable |
| Neurodivergent entrepreneur | Externalising working memory | Hard to re-read long transcripts; loses threads | Structured extraction does the synthesis for them |
| AI power user / knowledge worker | Getting ROI on their AI usage | No persistent layer across tools and sessions | Platform-agnostic — works with any AI transcript |

## Problems & Pain Points
**Core problem:** People who heavily use AI as a thinking partner have no persistent, searchable record of what they figured out. Insights are buried in long transcripts or lost when browser tabs close.
**Why alternatives fall short:**
- ChatGPT/Claude history: searchable only by date, not by topic or insight type; can't be queried semantically
- Notion/Obsidian manual notes: requires discipline to write up — most people don't do it consistently
- Generic note-taking apps: no extraction layer; you still have to do the synthesis yourself
**What it costs them:** Hours re-reading old chats, re-making decisions already made, losing the "aha moments" from productive AI sessions.
**Emotional tension:** Frustration of knowing you said something useful in an AI chat and being unable to find it; guilt of not "doing something" with valuable AI conversations.

## Competitive Landscape
**Direct:** No close direct competitors identified at launch. <!-- TODO: check for new entrants in AI knowledge extraction -->
**Secondary:** Mem.ai, Reflect, Notion AI — store notes but require manual input; no transcript-to-insights extraction.
**Indirect:** Staying in the AI tool's native history (ChatGPT, Claude.ai) — free but not structured, not cross-platform, not searchable by insight type.

## Differentiation
**Key differentiators:**
- Privacy-first: transcript deleted after extraction; only insights are stored
- Platform-agnostic: works with any AI tool's transcript (copy-paste or voice)
- Automatic categorisation into six business-relevant categories — no tagging required
- Interactive mind map showing connections across topics and insights
- Voice recording with Whisper transcription built in
**How we do it differently:** We extract meaning, not text. You don't store transcripts — you store structured, labelled insights with the context stripped out.
**Why that's better:** Faster to review, cheaper to store, and privacy-respecting. You get the signal without the noise.
**Why customers choose us:** There's nothing else that does this specific thing. We own a unique slice of the AI productivity space.

## Objections
| Objection | Response |
|-----------|----------|
| "I don't want to paste my private conversations into another tool" | Transcripts are deleted after extraction. Only the structured insights are stored. Row-level database security means only you can read your data. |
| "I already use Notion / Obsidian" | Those require you to write notes manually. NDLedger does the extraction for you — no extra effort. |
| "What if the AI misses something?" | You can always re-upload. And extraction improves — this is a surface you can curate, not a one-shot archive. |

**Anti-persona:** People who primarily use AI for one-off coding tasks or quick lookups — not thinking partners. If you don't have ongoing strategic conversations with AI, you don't have the pain we solve.

## Switching Dynamics
**Push:** "I keep having the same conversations with Claude because I don't remember what I decided last month" / "My ChatGPT history is useless — I can't find anything"
**Pull:** Structured library, zero effort extraction, privacy guarantee, mind map visualisation
**Habit:** Most people's "system" is just scrolling back through their AI chat history — it requires no setup
**Anxiety:** "What if the extraction misses important nuance?" / "Is it worth the effort to start uploading?" <!-- TODO: address activation friction in onboarding -->

## Customer Language
**How they describe the problem:**
- "[verbatim — to be populated from first user interviews]" <!-- TODO: collect after first 10 users -->
**How they describe us:**
- "[verbatim — to be populated from first user interviews]" <!-- TODO: collect after first 10 users -->
**Words to use:** extract, organise, searchable, library, knowledge, insights, decisions, second brain, AI conversations, transcripts
**Words to avoid:** "AI-powered" (overused), "revolutionary," "game-changing," "streamline," "leverage"
**Glossary:**
| Term | Meaning |
|------|---------|
| Insight | A single extracted unit: decision, commitment, task, idea, or pivot |
| Topic | A cluster of related insights, auto-named by the extraction engine |
| Category | One of six auto-assigned business contexts (Business & Monetisation, Go to Market, Legal & Compliance, Personal & Ideas, Product & Features, Technical) |
| Extraction | The process of Claude reading a transcript and producing structured insights |
| Mind Map | Interactive visual graph showing relationships between topics and insights |

## Brand Voice
**Tone:** Direct, calm, quietly confident. Not hype-y. Talks to smart, busy people like they're smart and busy.
**Style:** Conversational but precise. Short sentences. No corporate speak.
**Personality:** Practical, privacy-aware, founder-empathetic, slightly neurodivergent-friendly (clear structure, no fluff)

## Proof Points
**Metrics:** <!-- TODO: populate once users start generating data -->
**Customers:** <!-- TODO: populate after first paying users -->
**Testimonials:** <!-- TODO: collect after first 10 users -->
**Value themes:**
| Theme | Proof |
|-------|-------|
| Privacy-first | Transcripts deleted post-extraction; row-level Postgres security; no model training on user data |
| Zero effort | Upload → extract → browse; no tagging, no manual note-taking |
| Any AI, any platform | Works with ChatGPT, Claude, Gemini, Grok, Perplexity — anything you can copy-paste |

## Goals
**Business goal:** Get first 100 active users and validate the core extraction → library loop before building paid tier.
**Conversion action:** Sign up and complete first extraction.
**Current metrics:** Launched April 27, 2026. Pre-user. <!-- TODO: add first-week signup numbers -->

## Additional Context
**Live URL:** https://www.ndledger.com
**Operating entity:** AREASPEC PTY LTD (Australian company) operating NDLedger
**Legal:** Privacy Policy and Terms of Service live as of April 27, 2026; pending lawyer review after Whisper migration
**Neurodivergent angle:** Founder (Robert) is a neurodivergent entrepreneur. The product was built partly to solve his own problem. This is an authentic story worth telling in marketing — not a gimmick.
