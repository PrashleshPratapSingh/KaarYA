<p align="center">
  <img src="./assets/images/icon.png" alt="KaarYa Logo" width="120" height="120" />
</p>

<h1 align="center">KaarYA — Student Marketplace</h1>

<p align="center">
  <strong>India's first student-only gig marketplace.</strong><br/>
  Students hire students for micro-gigs · Build real portfolios · Earn while you learn
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/NativeWind-4.2-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-green?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## 🎯 What is KaarYA?

**KaarYA** (from Hindi — *"work" / कार्य*) is a **closed, high-trust gig marketplace** exclusively for Indian students aged 15–24. It lets students:

- **Post micro-gigs** — design, development, content writing, video editing, marketing & more
- **Apply & earn** — browse gigs, submit proposals, deliver work, get paid
- **Build portfolios** — every completed gig becomes a verifiable portfolio entry
- **Connect** — real-time messaging with voice notes, attachments & gig-context chat

> **Target:** 100,000+ students in Year 1 · ₹10 Cr+ GMV · ₹500–₹5,000 avg gig value

---

## ✨ Features

| Area | What's Built |
|------|-------------|
| **🏠 Home Feed** | Tinder-style swipeable gig deck, category filters, featured & compact card layouts |
| **📝 Post Gig** | 6-step guided flow — Category → Details → Budget → Attachments → Review → Success |
| **💼 My Work** | Active/Past gig tabs, wallet & earnings overview, deliverable tracking |
| **💬 Messaging** | Real-time chat with text, voice recording (waveform UI), file attachments, gig-context header |
| **👤 Profile** | Brutalist-styled profile with stats, skills, badges, portfolio grid, settings |
| **🎓 Onboarding** | Animated carousel → Role selection → Skill picker → Community selection |
| **🔔 Notifications** | Bell icon with unread badges, real-time updates |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [React Native](https://reactnative.dev/) (Expo SDK 54) |
| **Navigation** | [Expo Router](https://docs.expo.dev/routing/introduction/) v6 (file-based, typed routes) |
| **Styling** | [NativeWind](https://www.nativewind.dev/) v4 + TailwindCSS 3.3 |
| **Animations** | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) v4 + Gesture Handler v2 |
| **Fonts** | Space Grotesk · Inter · DM Sans · Archivo Black · Merriweather (via Expo Google Fonts) |
| **Media** | Expo AV (audio), Expo Image Picker, Expo Document Picker |
| **Backend (Planned)** | Supabase (Auth + DB + Storage) / Convex (real-time sync) |
| **Payments (Planned)** | Razorpay (UPI, Cards, Net Banking, Wallets) |
| **Notifications (Planned)** | Firebase Cloud Messaging (FCM) |

---

## 🎨 Design Language

KaarYA uses a **brutalist design system** with a bold, Gen-Z aesthetic:

| Token | Value |
|-------|-------|
| **Primary** | `#FFE500` (KaarYa Yellow) |
| **Secondary** | `#000000` (Bold Black) |
| **Surface** | `#FFFFFF` |
| **Borders** | 2–4px solid black |
| **Border Radius** | Sharp corners to large rounded (8–30px) |
| **Typography** | 900/800/700 weight · Hero 56px · Title 32px |
| **Messaging** | Cream `#F5F3E8` bg · Yellow sender · Purple `#5B5FFF` actions |

---

## 📁 Project Structure

```
KaarYA/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── index.tsx             # Home — Gig feed & swipe deck
│   │   ├── my-work.tsx           # My Work — Active gigs & wallet
│   │   ├── messages.tsx          # Messages — Chat list & conversations
│   │   ├── post.tsx              # Post Gig — Entry point
│   │   └── profile.tsx           # Profile — Stats, badges, settings
│   ├── onboarding/               # Onboarding flow (4 screens)
│   ├── post-gig/                 # Post gig multi-step flow (7 screens)
│   ├── chat/                     # Individual chat screen
│   └── context/                  # App-level context providers
├── components/                   # Reusable UI components
│   ├── home/                     # GigCard, SwipeDeck, FilterChips, etc.
│   ├── messaging/                # ChatHeader, MessageBubble, AudioRecorder
│   ├── my-work/                  # Wallet, GigList, DeliverableUpload
│   ├── post-gig/                 # Step components for gig creation
│   ├── navigation/               # Custom tab bar
│   └── ui/                       # Shared UI primitives
├── constants/
│   └── Colors.ts                 # Brand colors & theme tokens
├── lib/
│   ├── fonts.ts                  # Font loading config
│   ├── utils.ts                  # Utility functions
│   ├── mock/                     # Mock data for development
│   └── types/                    # Shared TypeScript types
├── assets/
│   ├── images/                   # App icons, splash, graphics
│   ├── fonts/                    # Custom font files
│   └── lottie/                   # Lottie animation files (9 animations)
├── docs/                         # Architecture & planning documents
├── types/                        # Global type definitions
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your phone (iOS / Android)

### Installation

```bash
# Clone the repository
git clone https://github.com/PrashleshPratapSingh/KaarYA.git
cd KaarYA

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# Launch on specific platform
npm run android     # Android emulator / Expo Go
npm run ios         # iOS simulator / Expo Go
npm run web         # Web browser
```

> **Tip:** Press `i` for iOS, `a` for Android, `w` for web after running `npm start`.

---

## 📱 Screen Map

### Core Tabs
| Tab | Screen | Description |
|-----|--------|-------------|
| 🏠 | Home | Gig discovery with swipeable cards, category filters, search |
| 💼 | My Work | Active gigs, completed history, wallet balance, transactions |
| 💬 | Messages | Chat inbox with unread badges, real-time messaging |
| ✏️ | Post | Quick access to multi-step gig posting |
| 👤 | Profile | User stats, skills, portfolio, badges, settings |

### Flows
| Flow | Steps | Description |
|------|-------|-------------|
| **Onboarding** | 4 screens | Splash → Story → Skills → Community |
| **Post Gig** | 7 screens | Category → Details → Budget → Attachments → Review → Success |
| **Chat** | 1 screen | Full messaging with voice, text, attachments |

---

## 🧪 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Launch on Android |
| `npm run ios` | Launch on iOS |
| `npm run web` | Launch on web |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run build` | Export for all platforms |
| `npm run web:build` | Build web for deployment |
| `npm run web:deploy` | Deploy to Netlify (test URL) |
| `npm run web:deploy:prod` | Deploy to Netlify (production) |

### Native Builds (EAS)

```bash
npm install -g eas-cli
eas login
eas build:configure

npm run native:build:all       # Build for iOS + Android
npm run native:build:ios       # Build for iOS only
npm run native:build:android   # Build for Android only
```

---

## 🗺️ Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 0** — Foundation | ✅ Complete | Project setup, design system, component library |
| **Phase 1** — MVP Core | 🔄 In Progress | Auth, gig CRUD, orders, payments, basic notifications |
| **Phase 2** — Enhanced | ⏳ Planned | Real-time chat (WebSocket), verification, portfolio, gamification |
| **Phase 3** — Polish | ⏳ Planned | Testing, performance, beta, app store submissions |

---

## 📖 Documentation

Detailed docs are available in the [`docs/`](./docs) directory:

| Document | Description |
|----------|-------------|
| [System Architecture](./docs/System_Architecture_Document.md) | High-level architecture overview |
| [Screen Map & Flows](./docs/Complete_Screen_Map_and_Flows.md) | All 70+ screens mapped with user flows |
| [API & Database](./docs/API_and_Database_Complete.md) | Full API specification & DB schema |
| [Supabase Architecture](./docs/Supabase_Architecture_Plan.md) | Backend architecture with Supabase |
| [Convex Integration](./docs/convex-integration.md) | Real-time sync integration guide |
| [Implementation Roadmap](./docs/Implementation_Roadmap_and_Plan.md) | Phase-wise development plan |
| [Messaging Guide](./docs/MESSAGING.md) | Messaging feature documentation |
| [UI Redesign](./docs/UI_REDESIGN.md) | Design iteration notes |
| [Theme System](./docs/theme.md) | Complete theme & color specification |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with 💛 for Indian students</strong><br/>
  <sub>KaarYA — <em>because every student's work matters.</em></sub>
</p>
