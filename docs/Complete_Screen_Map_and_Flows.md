**COMPLETE SCREEN MAP & USER FLOWS**


# **1. Authentication & Onboarding Flow (10 Screens)**

|**#**|**Screen**|**Elements**|**Actions → Next Screen**|
| :- | :- | :- | :- |
|1\.1|Splash Screen|App logo, Loading animation, Version|Auto → Onboarding (new) OR Home (logged in)|
|1\.2|Onboarding Carousel|3 slides: Features, Trust, Portfolio | Skip | Next | Get Started|Skip → Login | Get Started → Login|
|1\.3|Phone Login|Phone input (+91), Continue button, Terms checkbox|Continue → OTP Screen|
|1\.4|OTP Verification|6-digit OTP input, Verify, Resend timer, Edit number|Verify → Profile Setup (new) OR Home (existing)|
|1\.5|Profile Setup - Basic|Name, Email, College dropdown (searchable), Next|Next → Profile Setup - Role|
|1\.6|Profile Setup - Role|Doer card, Client card, Both option, Skip for now|Select Doer → Skills | Select Client → Home | Both → Skills|
|1\.7|Profile Setup - Skills|Category chips (Design, Code, Content, etc.), Multi-select, Add custom, Complete|Complete → Email Verification|
|1\.8|Email Verification Prompt|Message about verification, Open Email app, Skip|Open Email → Email app | Skip → Home|
|1\.9|Email Verification Success|Success message, Verified badge preview, Continue|Continue → Home|
|1\.10|Welcome Tutorial|Interactive tooltips on Home screen, Skip, Got it|Complete → Home (normal mode)|


# **2. Main Navigation (Bottom Tab Bar - 4 Screens)**

|**#**|**Screen**|**Elements**|**Actions → Next Screen**|
| :- | :- | :- | :- |
|2\.1|Home/Gig Feed|Search bar, Filter chips, Post Gig FAB, Gig cards (title, budget, client avatar, deadline), Pull to refresh|Tap Gig → Gig Detail | Search → Search Results | Filter → Filter Sheet | FAB → Post Gig Flow|
|2\.2|My Work|Tabs (Active/Past), Order cards (status, partner, amount, deadline), Empty state|Tap Order → Order Detail|
|2\.3|Messages|Chat list, Unread badges, Search, Last message preview, Time|Tap Chat → Chat Screen|
|2\.4|Profile|Avatar, Name, Bio, Stats (Gigs, Earnings, Rating), Skills chips, Badges, Portfolio button, Settings icon, Edit profile|Edit → Edit Profile | Portfolio → Portfolio | Settings → Settings | Badge → Badge Detail|


# **3. Gig Discovery & Application (8 Screens)**

|**#**|**Screen**|**Elements**|**Actions**|
| :- | :- | :- | :- |
|3\.1|Search Results|Search query, Result count, Gig cards, Sort (Relevant/Recent/Budget), No results state|Tap Gig → Detail | Back → Home|
|3\.2|Filter Sheet|Category multi-select, Budget slider, Deadline (Anytime/This week/This month), Difficulty, Apply/Clear|Apply → Updated feed | Clear → Reset|
|3\.3|Gig Detail|Title, Description, Budget, Deadline, Category/Skills tags, Attachments, Client card (avatar, name, rating, gigs posted), Apply button, Share, Report|Apply → Application Form | Client → Client Profile | Attachment → View/Download | Share → Share sheet | Report → Report Form|
|3\.4|Client Profile (Public View)|Avatar, Name, Bio, Joined date, Stats (Gigs posted, Avg rating, Response time), Active gigs, Reviews, Message button|Message → Chat | Gig → Gig Detail | Back → Previous|
|3\.5|Application Form|Cover letter textarea, Bid amount, Estimated days, Attach portfolio (links/files), Submit, Save draft|Submit → Confirmation | Save → My Applications (draft)|
|3\.6|Application Confirmation|Success animation, Message, View application, Browse more gigs|View → Application Detail | Browse → Home|
|3\.7|My Applications|Tabs (Pending/Accepted/Rejected), Application cards (gig, status, bid, date), Filter|Tap → Application Detail|
|3\.8|Application Detail|Gig info, Your proposal, Status, Client feedback (if any), Withdraw button (if pending)|Withdraw → Confirmation | Gig → Gig Detail|


# **4. Post Gig Flow - Client (7 Screens)**

|**#**|**Screen**|**Elements**|**Actions**|
| :- | :- | :- | :- |
|4\.1|Post Gig - Category|Category grid (Design, Development, Writing, Video, Marketing, etc.), Next|Select → Post Gig - Details|
|4\.2|Post Gig - Details|Title (max 100 chars), Description (rich text, max 2000), Skills needed (multi-select), Next, Save draft|Next → Budget & Timeline | Save → My Gigs (draft)|
|4\.3|Post Gig - Budget & Timeline|Budget type (Fixed/Hourly/Milestone), Min amount, Max amount, Deadline picker, Next|Next → Attachments|
|4\.4|Post Gig - Attachments|Upload area (drag & drop or browse), File list with remove, Max 10 files, Next|Next → Review|
|4\.5|Post Gig - Review|All details summary, Edit buttons per section, Post gig button, Preview|Edit → Respective screen | Post → Success OR Payment (if featured)|
|4\.6|Post Success|Success animation, Gig is live, View gig, Post another|View → Gig Detail | Post another → Category screen|
|4\.7|My Posted Gigs|Tabs (Active/Closed), Gig cards (applicants count, views, status), Actions menu (Edit/Close/Delete)|Tap → Application Inbox | Edit → Edit gig | Close → Confirm|


# **5. Application Review - Client (5 Screens)**

|**#**|**Screen**|**Elements**|**Actions**|
| :- | :- | :- | :- |
|5\.1|Application Inbox|Gig title, Applicant cards (avatar, name, rating, bid, proposal preview), Sort (Recent/Lowest bid/Highest rating), Accept/Reject buttons|Tap card → Application Detail | Accept → Hire Confirmation | Reject → Confirm|
|5\.2|Applicant Detail|Full proposal, Doer profile, Portfolio links, Past work, Rating/reviews, Message, Accept/Reject|Message → Chat | Profile → Doer Profile | Accept → Hire Confirmation|
|5\.3|Doer Profile (Public View)|Avatar, Name, Bio, Skills, Rating, Completed gigs, Earnings (optional), Portfolio grid, Reviews, Message/Hire buttons|Portfolio → Portfolio item | Message → Chat | Hire → Application or Direct hire|
|5\.4|Hire Confirmation|Doer summary, Agreed amount, Platform fee breakdown, Total, Terms checkbox, Proceed to payment|Proceed → Payment Gateway | Back → Cancel|
|5\.5|Payment Gateway (Razorpay SDK)|Amount, Payment options (UPI/Card/Net Banking/Wallet), Pay now|Pay → Processing → Success OR Failure|


# **6. Order Management (10 Screens)**

|**#**|**Screen**|**Elements**|**Actions**|
| :- | :- | :- | :- |
|6\.1|Order Detail|Order ID, Status badge, Timeline (Funded/Started/Submitted/Completed), Gig details, Partner card, Amount, Deliverables section, Chat button, Action buttons (context-dependent)|Chat → Chat | Submit work (doer) → Upload Deliverables | Approve (client) → Approve Confirmation | Request revision → Revision Form | Dispute → Dispute Form|
|6\.2|Upload Deliverables|File upload area, Description textarea, Submit work button, Guidelines|Submit → Confirmation | Back → Order Detail|
|6\.3|Submission Confirmation|Success message, Client will review, OK|OK → Order Detail (status: submitted)|
|6\.4|Review Deliverables|Submitted files (preview/download), Description, Approve/Request revision buttons|Download → File viewer | Approve → Rate doer | Revision → Revision Form|
|6\.5|Request Revision|Feedback textarea, Specific points, Submit|Submit → Order Detail (status: revision\_requested)|
|6\.6|Approve Confirmation|Approve work?, Payment will be released, Yes/No|Yes → Processing → Rate & Review | No → Back|
|6\.7|Auto-Release Notification|Payment auto-released after 7 days, Rate doer now|Rate → Rate & Review | Later → Order Detail|
|6\.8|Dispute Form|Issue type dropdown, Description, Evidence upload, Submit dispute|Submit → Dispute submitted screen|
|6\.9|Dispute Submitted|Ticket ID, Status, Expected resolution time, Upload more evidence, Admin messages|Back → Order Detail (status: disputed)|
|6\.10|Order Completion|Completed badge, Final amount, Download invoice, Rate if not rated, Report issue|Rate → Rate & Review | Invoice → PDF download|


