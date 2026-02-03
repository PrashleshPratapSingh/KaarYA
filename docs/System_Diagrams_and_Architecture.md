**SYSTEM DIAGRAMS & ARCHITECTURE**


# **1. High-Level System Architecture**
The following diagram shows the complete system architecture from client applications to backend services and external integrations.

|**CLIENT LAYER**|||
| :-: | :- | :- |
|React Native Mobile App (iOS & Android)|Next.js Web Application|Admin Dashboard|
|↓ HTTPS / WSS|||
|**EDGE & GATEWAY LAYER**|||
|Convex Edge Runtime • Request Routing • Authentication • Rate Limiting • WebSocket Gateway|||
|↓|||
|**APPLICATION SERVICES LAYER**|||
|Auth Service User Service Gig Service|Order Service Payment Service Chat Service|Notification Service Portfolio Service Badge Service|
|↓|||
|**DATA & STORAGE LAYER**|||
|Convex Database (Document Store)|Supabase Storage (Files & Media)|Redis Cache (Sessions & Temp)|
|↓|||
|**EXTERNAL INTEGRATIONS**|||
|Razorpay/PayU (Payments)|Twilio (SMS OTP)|FCM (Push Notifications)|


# **2. Complete User Journey Data Flow**
## **2.1 Registration to First Gig Completion**

|**Step**|**User Action**|**System Processing**|**Data Created/Updated**|
| :-: | :-: | :-: | :-: |
|1|Downloads app, enters phone number|Auth Service generates OTP → Twilio SMS|OTP record (5 min expiry)|
|2|Enters OTP|Verify OTP → Create session token|User record, Session token|
|3|Completes profile (name, email, college)|User Service creates profile → Sends verification email|User.name, User.email, User.university|
|4|Selects role & skills|User Service updates profile|User.roles, UserSkills junction records|
|5|Clicks email verification link|User Service verifies token|User.emailVerified = true|
|6|Browses gig feed|Gig Service queries open gigs → Recommendation engine|Feed viewed (analytics)|
|7|Views gig detail, clicks Apply|Gig Service loads gig + client info|Gig view count ++|
|8|Submits application with proposal|Gig Service creates application → Notifies client|Application record, Notification sent|
|9|Client reviews & accepts application|Order Service creates order → Payment Service creates Razorpay order|Order (escrow='awaiting'), RazorpayOrder|
|10|Client completes payment via UPI|Razorpay webhook → Payment Service verifies → Updates escrow|Order.escrowState='funded', Payment record|
|11|Doer and Client chat|Chat Service via WebSocket → Real-time message delivery|Message records|
|12|Doer uploads deliverables|Files → Supabase Storage → Order Service updates status|Order.deliverables[], Order.status='submitted'|
|13|Client approves work|Order Service triggers payout → Payment Service transfers funds|Order.status='completed', User.walletBalance++|
|14|Both parties rate each other|Review Service creates reviews → Updates user ratings|Review records, User.rating recalculated|
|15|System checks badge criteria|Badge Service evaluates → Awards badges|UserBadge records, User.badges[]|


# **3. Entity Relationship Diagram**
The database follows a normalized relational structure with the following key relationships:

|**Entity**|**Relationships**|**Cardinality**|
| :-: | :-: | :-: |
|User|→ UserSkills (skills) → Gigs (as client) → Applications (as doer) → Orders (as client/doer) → Messages → Reviews (as reviewer/reviewee) → Badges|1:N 1:N 1:N 1:N 1:N 1:N N:M|
|Gig|← User (client) → Applications → Order|N:1 1:N 1:1|
|Application|← Gig ← User (doer) → Order (if accepted)|N:1 1:1 1:1|
|Order|← Gig ← User (client) ← User (doer) → Messages → Reviews → Payments|1:1 N:1 N:1 1:N 1:2 1:N|
|Message|← Order ← User (sender)|N:1 N:1|
|Review|← Order ← User (reviewer) ← User (reviewee)|N:1 N:1 N:1|
|Payment|← Order ← User (payer/receiver)|N:1 N:1|
|Badge|→ Users (via junction table)|N:M|


# **4. Deployment Architecture**
## **4.1 Production Environment**

|**PRODUCTION DEPLOYMENT**||
| :-: | :- |
|**Component**|**Infrastructure**|
|Mobile App|• iOS: App Store • Android: Google Play Store • OTA Updates: Expo EAS|
|Web App|• Vercel Edge Network • CDN: Vercel Edge • SSL: Auto-managed|
|Backend (Convex)|• Convex Cloud (Multi-region) • Auto-scaling • WebSocket support|
|File Storage|• Supabase Storage • CDN-backed • Global replication|
|Monitoring|• Sentry (Error tracking) • Mixpanel (Analytics) • Convex Dashboard (Logs)|
|CI/CD|• GitHub Actions • Automated testing • Deploy previews|

## **4.2 Security Architecture**

|**Layer**|**Security Measures**|
| :-: | :-: |
|Transport|• TLS 1.3 encryption • Certificate pinning (mobile) • WSS for WebSockets|
|Authentication|• JWT tokens (30-day expiry) • Phone OTP verification • Email verification • Student ID verification|
|Authorization|• Role-based access control • Resource ownership checks • API rate limiting|
|Data|• Encryption at rest • PII data masking • GDPR compliance • Regular backups|
|Payments|• PCI-DSS compliant (Razorpay) • No card data storage • Escrow protection • Transaction signing|
|Application|• Input validation • SQL injection prevention • XSS protection • CSRF tokens|


# **5. Scalability & Performance**

|**Aspect**|**Strategy**|**Target Metrics**|
| :-: | :-: | :-: |
|Database|• Convex auto-scaling • Query optimization • Indexed fields|< 50ms read < 100ms write|
|API|• Edge caching • Response compression • Connection pooling|< 200ms p95 1000 req/sec|
|Real-time|• WebSocket connection pooling • Message batching • Presence optimization|< 100ms delivery 10k concurrent|
|Storage|• CDN distribution • Image optimization • Lazy loading|< 1s image load|
|Search|• Algolia/Elasticsearch • Faceted search • Typo tolerance|< 50ms search|


# **6. Disaster Recovery & Business Continuity**

|**Scenario**|**Impact**|**Recovery**|**RTO/RPO**|
| :-: | :-: | :-: | :-: |
|Database Failure|Service outage|Automatic failover to replica|RTO: 5 min RPO: 0|
|Region Outage|Partial unavailability|Multi-region routing|RTO: 15 min RPO: 1 min|
|Payment Gateway Down|Can't process payments|Queue orders, retry logic|RTO: Manual RPO: N/A|
|Data Corruption|Invalid data state|Point-in-time restore|RTO: 1 hour RPO: 1 hour|
|Security Breach|Compromised data|Incident response plan, user notification|RTO: 24 hours RPO: N/A|


# **7. Monitoring & Alerting**

|**Metric**|**Tool**|**Threshold**|**Alert Channel**|
| :-: | :-: | :-: | :-: |
|API Error Rate|Sentry|> 1% in 5 min|Slack + PagerDuty|
|Response Time p95|Convex Dashboard|> 500ms|Slack|
|Database CPU|Convex Metrics|> 80%|Email|
|Failed Payments|Custom metric|> 5 in 10 min|Slack + SMS|
|Fraud Detection|Custom rules|Suspicious pattern|Slack + Manual review|
|User Churn|Mixpanel|> 20% weekly|Email (weekly report)|

