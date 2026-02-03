**API ENDPOINTS & DATABASE SCHEMA**


# **1. Complete Database Schema**
## **1.1 Users Table**

|**Field**|**Type**|**Constraints**|**Description**|
| :- | :- | :- | :- |
|id|Id<'users'>|PK, Auto|Unique user identifier|
|phone|string|Unique, Required|Format: +91XXXXXXXXXX|
|email|string|Unique, Required|College/personal email|
|name|string|Required|Full name|
|avatarUrl|string?|Optional|Profile picture URL|
|bio|string?|Max 500 chars|User biography|
|university|string|Required|University/college name|
|course|string|Required|Degree/program|
|year|number|1-5|Year of study|
|graduationYear|number|Required|Expected graduation|
|phoneVerified|boolean|Default: false|Phone verification status|
|emailVerified|boolean|Default: false|Email verification status|
|idVerified|boolean|Default: false|ID verification status|
|idDocumentUrl|string?|Optional|Uploaded student ID|
|roles|array<string>|At least 1|['doer', 'client']|
|rating|number|0-5, Default: 0|Average rating|
|totalEarnings|number|Default: 0|Total earned (paise)|
|completedGigs|number|Default: 0|Completed gig count|
|trustScore|number|0-100, Default: 50|Platform trust score|
|badges|array<Id>|Default: []|Earned badge IDs|
|bankAccountId|string?|Optional|Linked bank account|
|walletBalance|number|Default: 0|Available balance (paise)|
|pendingBalance|number|Default: 0|In escrow (paise)|
|createdAt|number|Auto-set|Registration timestamp|
|lastActiveAt|number|Auto-updated|Last activity timestamp|


# **2. Complete API Specification**
## **2.1 Authentication Endpoints**
### **POST /api/auth/send-otp**
Send OTP to phone number for login/registration.

|**Request Body**|**Response**|
| :- | :- |
|{ "phone": "+91XXXXXXXXXX" }|{ "success": true, "message": "OTP sent", "expiresIn": 300 }|

### **POST /api/auth/verify-otp**

|**Request**|**Response**|
| :- | :- |
|{ "phone": "+91XXX", "otp": "123456" }|{ "token": "jwt\_token", "user": {...}, "isNewUser": false }|


## **2.2 Gigs Endpoints (Complete CRUD)**

|**Endpoint**|**Method**|**Purpose**|**Auth**|
| :- | :- | :- | :- |
|/api/gigs|GET|List/search gigs|Optional|
|/api/gigs/:id|GET|Get gig details|Optional|
|/api/gigs|POST|Create new gig|Required|
|/api/gigs/:id|PATCH|Update gig|Required (owner)|
|/api/gigs/:id|DELETE|Delete gig|Required (owner)|
|/api/gigs/:id/close|POST|Close gig to applications|Required (owner)|
|/api/gigs/:id/reopen|POST|Reopen closed gig|Required (owner)|
|/api/gigs/:id/boost|POST|Boost gig (paid feature)|Required (owner)|
|/api/gigs/my-gigs|GET|Get user's posted gigs|Required|
|/api/gigs/recommended|GET|Get personalized recommendations|Required|

### **GET /api/gigs - Query Parameters**

|**Parameter**|**Type**|**Description**|**Example**|
| :- | :- | :- | :- |
|category|string|Filter by category|design|
|skills|string[]|Required skills|photoshop,illustrator|
|budgetMin|number|Minimum budget (paise)|50000|
|budgetMax|number|Maximum budget (paise)|500000|
|deadline|string|Filter by deadline|this\_week|
|status|string|Gig status|open|
|sortBy|string|Sort field|createdAt|
|sortOrder|string|asc/desc|desc|
|page|number|Page number|1|
|limit|number|Items per page|20|
|search|string|Full-text search|logo design|


# **3. Payment & Escrow System**
## **3.1 Payment Flow Sequence**

|**Step**|**Actor**|**Action**|**API Call**|
| :- | :- | :- | :- |
|1|Client|Accepts application|POST /api/applications/:id/accept|
|2|Backend|Creates order with escrow\_state='awaiting\_payment'|Creates order record in DB|
|3|Backend|Creates Razorpay order|POST https://api.razorpay.com/v1/orders|
|4|Client App|Opens Razorpay checkout SDK|Client-side SDK initialization|
|5|Client|Completes payment via UPI/Card|Payment through Razorpay|
|6|Razorpay|Sends webhook to backend|POST /api/webhooks/payment|
|7|Backend|Verifies signature & updates order|Update escrow\_state='funded'|
|8|Backend|Sends notifications to both parties|FCM push notifications|
|9|Doer|Completes work & submits|POST /api/orders/:id/submit|
|10|Client|Approves work|POST /api/orders/:id/approve|
|11|Backend|Calculates fees & initiates payout|Razorpay Transfer API or payout|
|12|Backend|Updates wallet & creates transaction record|Update user.walletBalance|


## **3.2 Payment & Wallet Endpoints**

|**Endpoint**|**Method**|**Purpose**|
| :- | :- | :- |
|/api/payments/create-order|POST|Create Razorpay order for escrow|
|/api/payments/verify|POST|Verify payment signature|
|/api/webhooks/payment|POST|Razorpay webhook handler|
|/api/wallet/balance|GET|Get wallet balance|
|/api/wallet/transactions|GET|List wallet transactions|
|/api/wallet/withdraw|POST|Withdraw to bank account|
|/api/bank-accounts|POST|Add bank account|
|/api/bank-accounts|GET|List bank accounts|
|/api/bank-accounts/:id|DELETE|Remove bank account|
|/api/bank-accounts/:id/verify|POST|Verify bank account (penny drop)|


# **4. Complete Data Models (TypeScript)**
## **4.1 Core Types**
// User Model interface User {   id: string;   phone: string;   email: string;   name: string;   avatarUrl?: string;   bio?: string;   university: string;   course: string;   year: number;   graduationYear: number;   phoneVerified: boolean;   emailVerified: boolean;   idVerified: boolean;   idDocumentUrl?: string;   roles: ('doer' | 'client')[];   rating: number;   totalEarnings: number;   completedGigs: number;   trustScore: number;   badges: string[];   bankAccountId?: string;   walletBalance: number;   pendingBalance: number;   createdAt: number;   lastActiveAt: number; }  // Gig Model interface Gig {   id: string;   clientId: string;   title: string;   description: string;   category: GigCategory;   skills: string[];   budgetType: 'fixed' | 'hourly' | 'milestone';   budgetMin: number;   budgetMax: number;   deadline: number;   attachments: Attachment[];   status: 'open' | 'in\_progress' | 'completed' | 'cancelled';   applicationsCount: number;   viewsCount: number;   isBoosted: boolean;   createdAt: number;   updatedAt: number; }  // Order Model interface Order {   id: string;   gigId: string;   clientId: string;   doerId: string;   amount: number;   platformFee: number;   doerPayout: number;   escrowState: 'awaiting\_payment' | 'funded' | 'released' | 'refunded';   paymentGatewayOrderId?: string;   paymentGatewayPaymentId?: string;   status: 'pending\_payment' | 'in\_progress' | 'submitted' | 'approved' | 'completed' | 'disputed' | 'cancelled';   deliverables?: Deliverable[];   revisionRequests?: RevisionRequest[];   createdAt: number;   startedAt?: number;   submittedAt?: number;   completedAt?: number; }


# **5. Real-Time Events & WebSocket API**
## **5.1 WebSocket Connection**
Endpoint: wss://api.yourplatform.com/ws

Authentication: JWT token in connection params or first message

## **5.2 Events**

|**Event**|**Direction**|**Data**|**Purpose**|
| :- | :- | :- | :- |
|AUTHENTICATE|Client → Server|{ "token": "jwt" }|Authenticate WebSocket connection|
|AUTHENTICATED|Server → Client|{ "userId": "..." }|Confirm authentication|
|SUBSCRIBE\_CHAT|Client → Server|{ "orderId": "..." }|Subscribe to order chat|
|CHAT\_MESSAGE|Bidirectional|{ "orderId": "...", "text": "...", "attachments": [] }|Send/receive chat message|
|MESSAGE\_READ|Client → Server|{ "messageId": "..." }|Mark message as read|
|TYPING\_START|Client → Server|{ "orderId": "..." }|User started typing|
|TYPING\_STOP|Client → Server|{ "orderId": "..." }|User stopped typing|
|ORDER\_UPDATE|Server → Client|{ "orderId": "...", "status": "...", ... }|Order status changed|
|NEW\_APPLICATION|Server → Client|{ "gigId": "...", "applicationId": "..." }|New application received|
|NOTIFICATION|Server → Client|{ "type": "...", "title": "...", "body": "..." }|Real-time notification|


