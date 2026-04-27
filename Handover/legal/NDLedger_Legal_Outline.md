# NDLedger — Privacy Policy & Terms of Service Outline
**For lawyer review before launch**

---

## PART 1: PRIVACY POLICY OUTLINE

### 1. What Data We Collect

| Data Type | Purpose |
|-----------|---------|
| Email address | Authentication and account identification |
| Conversation transcripts | User-uploaded content for processing |
| Extracted insights, topics, decisions, tasks, commitments | Generated from transcripts |
| Conversation timestamps | User-provided dates for organisation |
| Voice recordings | Processed locally via browser Speech API — audio is NOT stored |

### 2. How We Use Your Data

- To provide the NDLedger service
- To extract and organise insights from your transcripts using AI
- To authenticate your account
- To improve the service (aggregated, anonymised usage data only — if applicable)

### 3. How Data Is Stored

- **Location:** Supabase servers in Sydney, Australia
- **Encryption:** Data encrypted in transit (TLS) and at rest
- **Access:** Only accessible by the user who created it (Row Level Security enforced)
- **Backups:** [Specify Supabase backup policy]

### 4. Third-Party Services

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Supabase | Database and authentication | All user data (stored) |
| Vercel | Web hosting | Request logs, IP addresses |
| Anthropic Claude | AI extraction processing | Transcript content (processed, not stored by Anthropic per their policy) |

**Note:** Review Anthropic's data retention policy and include relevant details.

### 5. Data Retention

- Data is retained until the user deletes it
- Users can delete individual transcripts (cascades to related topics/insights)
- Users can delete their entire account and all associated data
- Upon account deletion, data is permanently removed from our systems

### 6. User Rights

| Right | How to Exercise |
|-------|-----------------|
| Access your data | View via the NDLedger app |
| Delete your data | Delete transcripts individually or delete entire account via Settings |
| Export your data | [Future feature — or state "not currently available"] |
| Correct your data | Edit transcripts and insights via the app |

### 7. Cookies

- **Session cookies:** Used for authentication only
- **Tracking cookies:** None
- **Advertising cookies:** None
- **Third-party cookies:** None

**Note:** If you add analytics later (e.g., Google Analytics), update this section and add a cookie consent banner.

### 8. Children's Privacy

- NDLedger is not intended for users under the age of 18
- We do not knowingly collect data from children
- If we become aware of data collected from a child, we will delete it promptly

### 9. Australian Privacy Act Compliance

- NDLedger complies with the Australian Privacy Principles (APPs) under the Privacy Act 1988
- Data is stored in Australia (Sydney region)
- Users have the right to access and correct their personal information
- Complaints can be made to the Office of the Australian Information Commissioner (OAIC)

### 10. International Users

- If you are located outside Australia, your data will be transferred to and stored in Australia
- By using NDLedger, you consent to this transfer
- [If targeting EU users later, add GDPR section]

### 11. Security

- We implement industry-standard security measures
- Data encrypted in transit and at rest
- Row Level Security ensures users can only access their own data
- Regular security reviews [if applicable]

### 12. Contact Us

For privacy-related questions or requests:

- **Email:** [your email]
- **Address:** [your business address — required for Australian businesses]

### 13. Changes to This Policy

- We may update this Privacy Policy from time to time
- Users will be notified of material changes via email or in-app notification
- Continued use after changes constitutes acceptance

---

## PART 2: TERMS OF SERVICE OUTLINE

### 1. Acceptance of Terms

- By using NDLedger, you agree to these Terms
- If you don't agree, don't use the service
- You must be 18 or older to use NDLedger

### 2. Description of Service

NDLedger is an AI-powered knowledge library that:
- Allows users to upload AI conversation transcripts
- Automatically extracts decisions, commitments, insights, tasks, and pivots
- Organises extracted information into searchable topics and categories
- Provides visualisation via mind maps

### 3. User Accounts

- You must provide accurate information when creating an account
- You are responsible for maintaining the security of your account
- You are responsible for all activity under your account
- Notify us immediately of any unauthorised access

### 4. Acceptable Use

**You agree NOT to:**
- Upload illegal, harmful, or offensive content
- Upload content that infringes others' intellectual property
- Attempt to gain unauthorised access to the service or other users' data
- Use the service to harm, harass, or defraud others
- Use automated systems to access the service without permission
- Reverse engineer or attempt to extract source code

### 5. User Content

- You retain ownership of all content you upload
- You grant NDLedger a licence to process, store, and display your content to provide the service
- You are solely responsible for the content you upload
- We do not monitor or review user content except as required by law

### 6. AI Processing

- Your transcripts are processed by AI (Anthropic Claude) to extract insights
- AI extraction may not be 100% accurate
- You should review extracted insights for accuracy
- NDLedger is not responsible for decisions made based on AI-extracted information

### 7. Intellectual Property

- NDLedger and its original content, features, and functionality are owned by Hobbes Group Pty Ltd
- The NDLedger name, logo, and branding are trademarks of Hobbes Group Pty Ltd
- You may not use our branding without permission

### 8. Payment and Subscriptions

[If applicable — for future paid tiers]
- Pricing and payment terms
- Subscription renewal and cancellation
- Refund policy

### 9. Service Availability

- We aim to provide reliable service but do not guarantee 100% uptime
- We may modify, suspend, or discontinue the service at any time
- We will provide reasonable notice of significant changes

### 10. Limitation of Liability

To the maximum extent permitted by law:
- NDLedger is provided "as is" without warranties
- We are not liable for indirect, incidental, or consequential damages
- Our total liability is limited to the amount you paid us in the past 12 months (or $100 if no payments)
- We are not responsible for data loss — users should maintain their own backups

### 11. Indemnification

You agree to indemnify and hold harmless Hobbes Group Pty Ltd from any claims arising from:
- Your use of the service
- Your violation of these Terms
- Your violation of any third-party rights

### 12. Termination

- You may terminate your account at any time via Settings → Delete Account
- We may terminate or suspend your account for violation of these Terms
- Upon termination, your data will be deleted

### 13. Governing Law

- These Terms are governed by the laws of Queensland, Australia
- Disputes will be resolved in the courts of Queensland, Australia

### 14. Severability

- If any provision is found unenforceable, the remaining provisions remain in effect

### 15. Entire Agreement

- These Terms constitute the entire agreement between you and NDLedger
- They supersede any prior agreements

### 16. Contact

For questions about these Terms:
- **Email:** [your email]
- **Address:** [your business address]

### 17. Changes to Terms

- We may update these Terms from time to time
- Material changes will be notified via email or in-app
- Continued use after changes constitutes acceptance

---

## NEXT STEPS

1. **Use a template generator** (Termly, iubenda, or GetTerms) to create formal legal documents based on this outline
2. **Customise** with your specific business details (ABN, address, email)
3. **Lawyer review** — have a lawyer review before publishing
4. **Add to app** — create /privacy and /terms pages, link from footer and signup flow
5. **Checkbox at signup** — "I agree to the Terms of Service and Privacy Policy"

---

## PLACEHOLDER INFORMATION TO FILL IN

- [ ] Business email for legal contact
- [ ] Business address (required for Australian businesses)
- [ ] ABN (Australian Business Number)
- [ ] Specific Supabase backup/retention details
- [ ] Anthropic data processing agreement reference
- [ ] Pricing/subscription terms (if applicable)

---

*This document is an outline only — not legal advice. Have a qualified lawyer review your final Privacy Policy and Terms of Service before launch.*
