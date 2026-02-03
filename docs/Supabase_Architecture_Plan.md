# KaarYA Supabase Architecture Plan

This document outlines the complete backend architecture for the KaarYA platform using **Supabase**. It covers database schema, authentication strategy, storage, security (RLS), and edge functions.

---

## **1. Authentication Strategy**

### **Recommendation: Native Supabase Auth**
While Clerk is a powerful auth provider, **Supabase Auth** is recommended for KaarYA for the following reasons:
1.  **Seamless RLS Integration**: Supabase's Row Level Security (RLS) policies work out-of-the-box with `auth.uid()`. Using Clerk requires generating custom JWTs and syncing them, which adds complexity and latency.
2.  **Single Source of Truth**: User data and authentication logic adhere to the same database transaction guarantees.
3.  **Cost Efficiency**: Free tier includes 50,000 monthly active users (MAU), which is generous for scaling.

### **User Identity Flow**
1.  **Sign Up/Login**: OTP via Phone (`+91`) using Supabase Auth.
2.  **Unique ID**: Every user gets a unique `UUID` in the `auth.users` system table.
3.  **Public Profile**: A trigger automatically creates a corresponding record in the `public.users` table for application-specific data (name, university, bio).

---

## **2. Database Schema**

### **2.1 Entity Relationship Diagram (Conceptual)**

*   `users` (1) ↔ (N) `gigs` (Client posting gigs)
*   `users` (1) ↔ (N) `applications` (Doer applying for gigs)
*   `gigs` (1) ↔ (N) `applications`
*   `gigs` (1) ↔ (1) `orders` (Active contract)
*   `orders` (1) ↔ (N) `messages` (Chat)

### **2.2 Tables Definitions**

#### **1. public.users**
*Extends `auth.users` to store profile data.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, FK -> `auth.users.id` | The exact same ID as the auth user. |
| `phone` | `text` | Unique | Synced from auth metadata. |
| `name` | `text` | | Full name. |
| `role` | `text` | check ('client', 'doer') | Primary active role. |
| `university` | `text` | | |
| `avatar_url` | `text` | | URL from Storage. |
| `wallet_balance`| `bigint`| Default 0 | Stored in lowest currency unit (paise). |
| `created_at` | `timestamptz` | Default `now()` | |

#### **2. public.gigs**
*Postings created by clients.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default `gen_random_uuid()` | |
| `client_id` | `uuid` | FK -> `public.users.id` | Who posted the gig. |
| `title` | `text` | | |
| `description` | `text` | | |
| `status` | `text` | Default 'open' | 'open', 'in_progress', 'completed'. |
| `budget_min` | `bigint` | | Minimum budget in paise. |
| `budget_max` | `bigint` | | Maximum budget in paise. |
| `skills` | `text[]` | | Array of tags. |
| `location_type`| `text` | | 'remote', 'on-campus'. |

#### **3. public.applications**
*Doers applying to gigs.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | |
| `gig_id` | `uuid` | FK -> `gigs.id` | |
| `applicant_id` | `uuid` | FK -> `users.id` | |
| `pitch` | `text` | | Why they are a good fit. |
| `bid_amount` | `bigint` | | Proposed price. |
| `status` | `text` | Default 'pending' | 'pending', 'accepted', 'rejected'. |

#### **4. public.orders**
*Confirmed contracts between Client and Doer.*

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | |
| `gig_id` | `uuid` | FK -> `gigs.id` | |
| `client_id` | `uuid` | FK -> `users.id` | |
| `doer_id` | `uuid` | FK -> `users.id` | |
| `escrow_status`| `text` | | 'funded', 'released', 'disputed'. |
| `amount` | `bigint` | | Final agreed amount. |

---

## **3. Row Level Security (RLS) Policies**

RLS is the firewall of your database. It ensures users can only access data they are authorized to see.

### **Users Table**
*   **Select**: Public (Anyone can view profiles, needed for browsing gigs/doers).
*   **Update**: Users can update their **own** profile only.
    *   `auth.uid() = id`

### **Gigs Table**
*   **Select**: Public (Anyone can see open gigs).
*   **Insert**: Authenticated users.
*   **Update/Delete**: Only the `client_id` (owner) can modify.
    *   `auth.uid() = client_id`

### **Applications Table**
*   **Select**:
    *   The Applicant (`auth.uid() = applicant_id`)
    *   The Gig Owner (via join gig `client_id`)
*   **Insert**: Authenticated users (Doers).

---

## **4. Data Storage Structure**

Supabase Storage handles files. You will need 3 distinct buckets:

### **Bucket 1: `avatars`**
*   **Privacy**: Public
*   **Purpose**: User profile pictures.
*   **Policy**:
    *   Read: Anyone.
    *   Write: Authenticated users can upload to their own folder `uid/*`.

### **Bucket 2: `gig-attachments`**
*   **Privacy**: Private (Authenticated)
*   **Purpose**: Design briefs, requirement docs attached to Gigs.
*   **Policy**:
    *   Read: Anyone (if gig is public) or restricted to applicants.
    *   Write: Only Gig creator.

### **Bucket 3: `secure-documents`**
*   **Privacy**: Private (Strict)
*   **Purpose**: Student IDs, Verification documents.
*   **Policy**:
    *   Read: Only the User (`uid` match) and Admin Service Role.
    *   Write: Only the User.

---

## **5. Logic & Automation (Edge Functions)**

Do not run heavy logic on the client. Use **Supabase Edge Functions** (Deno/Node).

1.  **`payment-webhook`**:
    *   Listens for Razorpay/Stripe webhooks.
    *   Verifies signature securely.
    *   Updates `public.orders` status to 'funded'.
    *   *Security Note*: Never update payment status directly from the client!

2.  **`send-notification`**:
    *   Triggered by database webhooks (e.g., when a new row is added to `applications`).
    *   Sends Push Notification (Expo Push API) to the Gig owner.

---

## **6. Implementation Guide**

### **Step 1: User Sign-Up Code (Client Side)**
```typescript
import { supabase } from '@/lib/supabase'

// 1. Send OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+919999999999',
})

// 2. Verify OTP
const { session, error } = await supabase.auth.verifyOtp({
  phone: '+919999999999',
  token: '123456',
  type: 'sms',
})
```

### **Step 2: Auto-Create Profile (SQL Trigger)**
Run this in Supabase SQL Editor once to ensure every new auth user has a public profile:
```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, phone, name)
  values (new.id, new.phone, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### **Step 3: Fetching Data**
To get a user's gigs:
```typescript
const { data: gigs } = await supabase
  .from('gigs')
  .select('*')
  .eq('client_id', supabase.auth.user().id)
```

---

## **Summary of "How it Connects"**

1.  **Button Click**: User clicks "Post Gig".
2.  **Auth Check**: App checks `session` (from Supabase Auth).
3.  **Data Submission**:
    *   Text data sent to `public.gigs` via specific API (`supabase.from('gigs').insert`).
    *   Files uploaded to `gig-attachments` bucket.
4.  **Security**: Database refuses the insert if the user isn't logged in (RLS).
5.  **Confirmation**: Realtime subscription updates the UI list of gigs instantly.
