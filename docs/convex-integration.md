# Convex Integration Guide for My Work Dashboard

This document provides step-by-step instructions for integrating Convex real-time subscriptions into the My Work Dashboard.

## 📋 Overview

The My Work Dashboard currently uses mock data for development. This guide will help you replace mock data with Convex real-time queries and mutations to enable instant synchronization between Next.js (Web) and Expo (Mobile) apps.

## 🚀 Setup Instructions

### Step 1: Install Convex SDK

```bash
npm install convex
```

### Step 2: Initialize Convex

```bash
npx convex dev
```

This will:
- Create a `convex/` directory in your project root
- Generate authentication credentials
- Set up the Convex development server

### Step 3: Configure Environment Variables

Create a `.env.local` file (or update existing):

```env
CONVEX_URL=https://your-project.convex.cloud
```

### Step 4: Wrap Your App with ConvexProvider

**For Expo (Mobile)**: Update `app/_layout.tsx`

```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      {/* Your existing app structure */}
    </ConvexProvider>
  );
}
```

**For Next.js (Web)**: Update `pages/_app.tsx` or `app/layout.tsx`

```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function App({ Component, pageProps }) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}
```

## 📊 Schema Definition

Create `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  wallets: defineTable({
    userId: v.id("users"),
    totalBalance: v.number(),
    pendingFunds: v.number(),
    availableFunds: v.number(),
  }).index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("credit"), v.literal("debit")),
    amount: v.number(),
    description: v.string(),
    date: v.string(),
    gigId: v.optional(v.id("gigs")),
  }).index("by_user", ["userId"]),

  gigs: defineTable({
    userId: v.id("users"),
    clientId: v.id("users"),
    title: v.string(),
    clientName: v.string(),
    clientAvatar: v.optional(v.string()),
    amount: v.number(),
    deadline: v.string(),
    progress: v.number(),
    unreadMessages: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("pending")
    ),
    completedDate: v.optional(v.string()),
    vibeBadges: v.optional(v.array(v.string())),
    workSnippet: v.optional(v.string()),
    rating: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["userId", "status"]),
});
```

## 🔍 Query Definitions

Create `convex/wallet.ts`:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getWalletData = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);

    return {
      totalBalance: wallet?.totalBalance ?? 0,
      pendingFunds: wallet?.pendingFunds ?? 0,
      availableFunds: wallet?.availableFunds ?? 0,
      transactions: transactions.map((t) => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date,
        gigId: t.gigId,
      })),
    };
  },
});
```

Create `convex/gigs.ts`:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getActiveGigs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gigs")
      .withIndex("by_status", (q) =>
        q.eq("userId", args.userId).eq("status", "active")
      )
      .collect();
  },
});

export const getCompletedGigs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gigs")
      .withIndex("by_status", (q) =>
        q.eq("userId", args.userId).eq("status", "completed")
      )
      .order("desc")
      .collect();
  },
});
```

## 🔄 Real-time Sync: Replacing Mock Data

Update `app/(tabs)/my-work.tsx`:

**Before (with mock data):**
```typescript
import { mockWalletData, mockActiveGigs, mockCompletedGigs } from '../../lib/mock/mywork-data';

const walletData = mockWalletData;
const activeGigs = mockActiveGigs;
const completedGigs = mockCompletedGigs;
```

**After (with Convex):**
```typescript
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Assuming you have user authentication working
const userId = useCurrentUserId(); // Your auth hook

const walletData = useQuery(api.wallet.getWalletData, { userId });
const activeGigs = useQuery(api.gigs.getActiveGigs, { userId });
const completedGigs = useQuery(api.gigs.getCompletedGigs, { userId });

// Handle loading state
if (!walletData || !activeGigs || !completedGigs) {
  return <LoadingScreen />;
}
```

## ✍️ Mutation Examples

### Uploading Deliverables

Create `convex/gigs.ts` (add to existing file):

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateGigProgress = mutation({
  args: {
    gigId: v.id("gigs"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gigId, {
      progress: args.progress,
    });
  },
});

export const uploadDeliverable = mutation({
  args: {
    gigId: v.id("gigs"),
    fileUrl: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Store deliverable info
    // Update gig progress
    // Send notification to client
    // Return success
  },
});
```

Usage in `DeliverableUploadButton.tsx`:

```typescript
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function DeliverableUploadButton({ gigId }) {
  const uploadDeliverable = useMutation(api.gigs.uploadDeliverable);

  const handleUpload = async (fileUrl: string, fileName: string) => {
    await uploadDeliverable({ gigId, fileUrl, fileName });
  };

  // ... rest of component
}
```

### Processing Payments

Create `convex/payments.ts`:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const processPayment = mutation({
  args: {
    gigId: v.id("gigs"),
    amount: v.number(),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Update recipient's wallet
    const recipientWallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.toUserId))
      .first();

    if (recipientWallet) {
      await ctx.db.patch(recipientWallet._id, {
        pendingFunds: recipientWallet.pendingFunds + args.amount,
        totalBalance: recipientWallet.totalBalance + args.amount,
      });
    }

    // 2. Create transaction record
    await ctx.db.insert("transactions", {
      userId: args.toUserId,
      type: "credit",
      amount: args.amount,
      description: `Payment received for gig`,
      date: new Date().toISOString(),
      gigId: args.gigId,
    });

    // 3. Update gig status
    await ctx.db.patch(args.gigId, {
      status: "completed",
      completedDate: new Date().toISOString(),
    });

    return { success: true };
  },
});
```

## 🌐 Next.js (Web) Integration

The beauty of Convex is that **the exact same queries work on both platforms**!

In your Next.js components:

```typescript
'use client';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export function MyWorkDashboard() {
  const userId = useCurrentUserId();
  const walletData = useQuery(api.wallet.getWalletData, { userId });
  
  // Same component, same data, synchronized in real-time!
  return <StashCard balance={walletData?.totalBalance} />;
}
```

## 🔔 Real-time Updates

Convex automatically handles real-time synchronization:

1. **Client pays on Web** → Web UI updates immediately
2. **Convex mutation executes** → Updates database
3. **Mobile app subscriptions** → Automatically receive updates
4. **Mobile UI updates** → Shows new balance instantly

All without any polling or manual refresh logic!

## 🧪 Testing Real-time Sync

1. Open your app on **mobile** (Expo Go)
2. Open your app on **web browser**
3. Make a payment/update on web
4. Watch mobile app update in real-time (within ~100ms)

## 📝 Best Practices

1. **Use `useQuery` for reads**: Automatically subscribes to changes
2. **Use `useMutation` for writes**: Optimistic updates supported
3. **Handle loading states**: Queries return `undefined` while loading
4. **Add error boundaries**: Gracefully handle network issues
5. **Implement optimistic updates**: For instant UI feedback

## 🔐 Authentication Integration

If using Clerk (recommended):

```typescript
import { useUser } from '@clerk/clerk-expo'; // or '@clerk/nextjs' for web

export default function MyWorkScreen() {
  const { user } = useUser();
  
  // Convert Clerk user to Convex user ID
  const convexUserId = useConvexUserId(user?.id);
  
  const walletData = useQuery(api.wallet.getWalletData, { 
    userId: convexUserId 
  });
  
  // ...
}
```

## 🎯 Next Steps

1. ✅ Install Convex SDK
2. ✅ Define schema
3. ✅ Create queries and mutations
4. ✅ Replace mock data with `useQuery`
5. ✅ Test real-time sync
6. ✅ Deploy to production

## 📚 Additional Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex with React Native](https://docs.convex.dev/client/react/react-native)
- [Convex with Next.js](https://docs.convex.dev/client/react/nextjs)
- [Real-time Subscriptions](https://docs.convex.dev/client/react/useQuery)
