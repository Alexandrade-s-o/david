# Le Petit Anglais — System Architecture

## 1. Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS        │
│  Framer Motion · Zustand · React Hook Form · Zod            │
│  Stripe.js · Agora RTC SDK                                  │
└─────────────────────────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS API ROUTES                      │
│  /api/agora/token      → Generate Agora RTC token           │
│  /api/stripe/checkout  → Create Stripe checkout session     │
│  /api/stripe/webhook   → Handle subscription lifecycle      │
│  /api/admin/*          → Admin panel operations             │
└─────────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│  Firebase Auth   │      │         Firestore DB             │
│  · Email/Pass    │      │  · users           (profiles)    │
│  · Google OAuth  │      │  · courses         (content)     │
└──────────────────┘      │  · lessonProgress  (tracking)    │
                          │  · vocabCards      (spaced rep)  │
                          │  · liveClasses     (scheduling)  │
                          │  · rankings        (leaderboard) │
                          └──────────────────────────────────┘
         │                          │
         ▼                          ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│  Firebase        │      │          Agora RTC               │
│  Storage         │      │  · HD video/audio (1-on-1)       │
│  · audio files   │      │  · Group classes (multi-user)    │
│  · images        │      │  · Screen sharing                │
│  · course media  │      │  · Real-time chat overlay        │
└──────────────────┘      └──────────────────────────────────┘
                                     │
                                     ▼
                          ┌──────────────────────────────────┐
                          │           Stripe                  │
                          │  · Subscriptions (4 tiers)        │
                          │  · Webhooks (lifecycle)           │
                          │  · Customer portal                │
                          └──────────────────────────────────┘
```

---

## 2. Folder Structure

```
le-petit-anglais/
├── public/
│   ├── images/           # static illustrations
│   ├── planets/          # planet SVG illustrations
│   ├── audio/            # vocab audio files
│   └── icons/            # badges, trophy icons
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, providers)
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (app)/                    # Authenticated route group
│   │   │   ├── layout.tsx            # App shell (nav, auth guard)
│   │   │   ├── dashboard/page.tsx    # Student dashboard
│   │   │   │
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # Course catalog
│   │   │   │   └── [courseId]/
│   │   │   │       ├── page.tsx      # Course detail
│   │   │   │       └── lessons/
│   │   │   │           └── [lessonId]/page.tsx  # Lesson player
│   │   │   │
│   │   │   ├── vocab-review/         # Spaced repetition flashcards
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── classes/              # Live class browser
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── classroom/            # Active video classroom
│   │   │   │   └── [sessionId]/page.tsx
│   │   │   │
│   │   │   ├── leaderboard/page.tsx  # Weekly ranking
│   │   │   ├── profile/page.tsx      # User profile editor
│   │   │   └── settings/page.tsx     # Preferences
│   │   │
│   │   ├── checkout/page.tsx         # Stripe checkout
│   │   │
│   │   ├── admin/                    # Admin panel (role-guarded)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Overview metrics
│   │   │   ├── users/page.tsx        # User management
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # Course list
│   │   │   │   └── [courseId]/
│   │   │   │       └── editor/page.tsx  # Lesson builder
│   │   │   └── classes/page.tsx      # Class scheduling
│   │   │
│   │   └── api/
│   │       ├── agora/token/route.ts  # Agora token generation
│   │       ├── stripe/
│   │       │   ├── checkout/route.ts
│   │       │   └── webhook/route.ts
│   │       └── admin/
│   │           └── users/route.ts
│   │
│   ├── components/
│   │   ├── ui/                       # Primitive reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx         # Route protection HOC
│   │   │
│   │   ├── lesson/
│   │   │   ├── ContentBlock.tsx      # Renders lesson blocks
│   │   │   ├── exercises/
│   │   │   │   ├── MultipleChoice.tsx
│   │   │   │   ├── FillBlank.tsx
│   │   │   │   ├── DragDrop.tsx
│   │   │   │   ├── Matching.tsx
│   │   │   │   └── SpeakingPrompt.tsx
│   │   │   └── VocabCard.tsx
│   │   │
│   │   ├── classroom/
│   │   │   ├── VideoTile.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ControlBar.tsx
│   │   │   └── NetworkIndicator.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── PlanetMap.tsx
│   │       ├── StatCard.tsx
│   │       ├── CourseCard.tsx
│   │       └── ClassCard.tsx
│   │
│   ├── lib/
│   │   ├── firebase.ts               # Firebase init + query helpers
│   │   ├── firebase-admin.ts         # Server-side admin SDK
│   │   ├── agora.ts                  # Agora RTC helpers
│   │   ├── stripe.ts                 # Stripe client
│   │   └── utils.ts                  # clsx, cn, formatters
│   │
│   ├── store/
│   │   ├── useAuthStore.ts           # Global auth + profile state
│   │   └── useLessonStore.ts         # Active lesson state
│   │
│   ├── hooks/
│   │   ├── useAgoraClient.ts         # Agora connection lifecycle
│   │   └── useVocabReview.ts         # SM-2 review queue
│   │
│   └── types/
│       └── index.ts                  # All TypeScript types
│
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Firestore Database Design

### Collection: `users/{uid}`
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string | null",
  "role": "student | teacher | admin",
  "subscription": "free | explorer | astronaut | universe",
  "subscriptionExpiresAt": "Timestamp | null",
  "stripeCustomerId": "string | null",
  "xp": 1240,
  "level": 8,
  "currentPlanet": "planet-fox",
  "streak": 14,
  "lastActivityAt": "Timestamp",
  "badges": ["first-lesson", "streak-7"],
  "enrolledCourses": ["course-id-1"],
  "completedLessons": ["lesson-id-1", "lesson-id-2"],
  "prefersDarkMode": false,
  "notificationsEnabled": true,
  "timezone": "America/New_York",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### Subcollection: `users/{uid}/notifications/{notifId}`
```json
{
  "type": "lesson_reminder | new_badge | class_starting | ...",
  "title": "string",
  "body": "string",
  "isRead": false,
  "link": "/dashboard",
  "createdAt": "Timestamp"
}
```

### Collection: `courses/{courseId}`
```json
{
  "slug": "planet-rose-a1",
  "title": "Planet Rose: First Words",
  "description": "string",
  "coverImage": "/planets/planet-rose.svg",
  "planet": { "slug": "planet-rose", "cefrLevel": "A1", ... },
  "cefrLevel": "A1",
  "totalLessons": 12,
  "totalXP": 600,
  "estimatedHours": 8,
  "isPremium": false,
  "isPublished": true,
  "tags": ["beginner", "vocabulary"],
  "enrolledCount": 3200,
  "rating": 4.9,
  "createdBy": "teacher-uid",
  "order": 1,
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### Subcollection: `courses/{courseId}/lessons/{lessonId}`
```json
{
  "title": "Greetings & Introductions",
  "type": "vocabulary | grammar | listening | speaking | story | review",
  "order": 1,
  "xpReward": 50,
  "estimatedMinutes": 10,
  "isPublished": true,
  "content": {
    "introduction": "string",
    "blocks": [ { "id": "b1", "type": "vocabulary_card", "data": {...}, "order": 1 } ],
    "exercises": [ { "id": "ex1", "type": "multiple_choice", "data": {...}, ... } ]
  }
}
```

### Collection: `lessonProgress/{userId_lessonId}`
```json
{
  "userId": "string",
  "lessonId": "string",
  "courseId": "string",
  "status": "not_started | in_progress | completed",
  "score": 85,
  "xpEarned": 45,
  "attempts": 1,
  "timeSpentSeconds": 420,
  "completedAt": "Timestamp | null",
  "exerciseResults": [
    { "exerciseId": "ex1", "isCorrect": true, "userAnswer": "Hello", "timeSpentSeconds": 8 }
  ]
}
```

### Collection: `vocabCards/{cardId}`
```json
{
  "userId": "string",
  "word": "Hello",
  "translation": "Hola",
  "audioUrl": "/audio/hello.mp3",
  "exampleSentence": "Hello! My name is Sophie.",
  "easeFactor": 2.5,
  "interval": 3,
  "repetitions": 2,
  "nextReviewAt": "Timestamp",
  "lastReviewedAt": "Timestamp | null",
  "courseId": "string",
  "lessonId": "string"
}
```

### Collection: `liveClasses/{classId}`
```json
{
  "title": "Travel Vocabulary Workshop",
  "teacherId": "teacher-uid",
  "teacherName": "Ms. Emma Wells",
  "type": "one_on_one | group",
  "status": "scheduled | live | completed | cancelled",
  "maxStudents": 8,
  "enrolledStudents": ["uid1", "uid2"],
  "scheduledAt": "Timestamp",
  "durationMinutes": 60,
  "agoraChannelName": "class-abc123",
  "cefrLevel": "A2",
  "isPremium": true,
  "price": 0
}
```

### Subcollection: `liveClasses/{classId}/messages/{messageId}`
```json
{
  "userId": "string",
  "userName": "Sophie Martin",
  "message": "Hello everyone!",
  "type": "text | correction | system",
  "sentAt": "Timestamp"
}
```

### Collection: `rankings/{weeklyDocId}`
```json
{
  "userId": "string",
  "displayName": "Sophie Martin",
  "photoURL": "string | null",
  "weeklyXP": 320,
  "totalXP": 1240,
  "currentPlanet": "planet-fox",
  "weekStart": "Timestamp"
}
```

---

## 4. User Flow

```
VISITOR
  │
  ▼
Landing Page
  ├─→ Register (email or Google) → Dashboard
  └─→ Login → Dashboard

DASHBOARD
  ├─→ Continue Course → Lesson Player
  │     ├─→ Content Blocks (story, vocab, grammar)
  │     ├─→ Exercises (MCQ, fill blank, drag-drop)
  │     └─→ Completion Screen (+XP, badges)
  │
  ├─→ Planet Map → Select Planet → Course List → Enroll
  │
  ├─→ Live Classes → Browse → Join/Book
  │     └─→ Classroom (Agora) → Video + Chat + Screen Share
  │
  ├─→ Vocab Review → Flashcard Queue (SM-2)
  │
  ├─→ Leaderboard → Weekly Rankings
  │
  └─→ Profile → Upgrade Plan → Stripe Checkout
        └─→ Webhook → Firestore subscription update
```

---

## 5. Wireframes (Text Description)

### Landing Page
```
┌─ HERO ──────────────────────────────────────────────────────────┐
│  [Starfield BG]  Stars + floating planets                        │
│  "Learn English Among the Stars"                                 │
│  [CTA: Start for Free]  [Watch Demo]                            │
│  Social proof: 8,400+ students · ★★★★★ 4.9                     │
└─────────────────────────────────────────────────────────────────┘
┌─ HOW IT WORKS ──────────────────────────────────────────────────┐
│  Step 1: Choose planet  Step 2: Story  Step 3: Play  Step 4: Speak│
└─────────────────────────────────────────────────────────────────┘
┌─ PLANET MAP ────────────────────────────────────────────────────┐
│  🌹 A1  →  🦊 A2  →  👑 B1  →  🕯️ B2  →  🗺️ C1  →  ⭐ C2     │
└─────────────────────────────────────────────────────────────────┘
┌─ PRICING ───────────────────────────────────────────────────────┐
│  Free · Explorer $14.99 · Astronaut $29.99 · Universe $59.99    │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard
```
┌─ TOP NAV ────────────────────────────────────────────────────── ┐
│  ⭐ Le Petit Anglais         [Bell 🔔]  [Avatar]                 │
├─ WELCOME ────────────────────────────────────────────────────── ┤
│  Good morning, Sophie!  🦊   [Streak: 14🔥]  [XP: 1,240 ⭐]    │
│  Level 8 ▓▓▓▓▓▓▓░░░ Lvl 9                                      │
├─ STATS ─────────────────────────────────────────────────────── ┤
│  [34 lessons] [3 badges] [#12 rank] [320 XP this week]          │
├─ PLANET MAP ─────────────────────────────────────────────────── ┤
│  🌹✓──🦊★──👑🔒──🕯️🔒──🗺️🔒──⭐🔒                              │
├─ COURSES ────────────────────────────────────────────────── LIVE │
│  [Planet Rose 75%▓] [Planet Fox 30%▓] [Planet King 0%]  [Class] │
└─────────────────────────────────────────────────────────────────┘
```

### Lesson Player
```
┌─ TOP BAR ────────────────────────────────────────────────────── ┐
│  ← Back   [Progress bar ▓▓▓▓▓░░░░░]   [+45 XP ⭐]              │
├─ CONTENT ────────────────────────────────────────────────────── ┤
│                                                                  │
│  ┌─ VOCAB CARD (flippable) ─────────────────────────────────┐  │
│  │           Hello          [🔊]                             │  │
│  │         /həˈloʊ/                                          │  │
│  │        [ tap to flip ]                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│            [Continue →]                                          │
├─ EXERCISE ─────────────────────────────────────────────────────┤
│  Which is the correct greeting?                                  │
│  ┌──────────┐  ┌──────────┐                                     │
│  │  Hola    │  │  Hello ✓ │  ← green highlight on correct       │
│  └──────────┘  └──────────┘                                     │
│  ┌──────────┐  ┌──────────┐                                     │
│  │ Bonjour  │  │  Ciao    │                                     │
│  └──────────┘  └──────────┘                                     │
│  [Check answer]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Classroom (Video Call)
```
┌─ HEADER ─────────────────────────────── ● Live · 👥 3 in room ─┐
│                                                                  │
│  ┌─ REMOTE VIDEO (teacher) ──────────┐  ┌─ CHAT ────────────┐  │
│  │  HD Video Feed                    │  │  [chat messages]  │  │
│  │  ★ Ms. Emma Wells                 │  │                   │  │
│  └──────────────────────────────────┘  │                   │  │
│  ┌─ LOCAL VIDEO ─────────────────────┐  │  [type message ➤] │  │
│  │  Your camera feed                  │  └───────────────────┘  │
│  │  You                               │                         │
│  └──────────────────────────────────┘                          │
│                                                                  │
├─ CONTROLS ──────────────────────────────────────────────────── ┤
│     [🎤 Mic]  [📷 Camera]  [🖥 Share]  [💬 Chat]  │  [📞 Leave]│
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Monetization Strategy

### Subscription Tiers
| Plan        | Price/mo | Live 1-on-1 | Key Hook                  |
|-------------|----------|-------------|---------------------------|
| Free        | $0       | 0           | 3 lessons/month           |
| Explorer    | $14.99   | 0           | All A1-B1 + group classes |
| Astronaut   | $29.99   | 8/month     | + AI partner + cert       |
| Universe    | $59.99   | Unlimited   | Dedicated teacher         |

### Revenue Drivers
1. **Annual discount (33%)** — reduces churn, improves LTV
2. **Per-class purchases** — $9.99/class for non-subscribers
3. **Certificate of completion** — $19.99 per level (branded, shareable)
4. **Teacher marketplace** — 20% commission on teacher earnings
5. **Corporate/B2B** — team licenses for companies

### Key Metrics to Track
- **MRR** (Monthly Recurring Revenue)
- **Churn rate** (target < 5%/month)
- **DAU/MAU ratio** (streak feature drives this)
- **Conversion rate** Free → Explorer (target 8-12%)
- **NPS** (Net Promoter Score from lessons)

### Retention Mechanics Built In
- Daily streaks (loss aversion)
- Planet unlock system (progress anchoring)
- Weekly leaderboard resets (competitive urgency)
- Scheduled live classes (commitment device)
- Spaced repetition reminders (re-engagement emails/push)

---

## 7. Scalability Architecture

### Firebase Firestore
- Collections indexed properly for common queries
- Security rules: users can only read/write their own data
- Lesson content is read-heavy → cache in Next.js (ISR)

### Caching Strategy (Next.js)
```typescript
// Courses page: re-validate every 10 minutes
export const revalidate = 600;

// Lesson content: static generation at build time
export async function generateStaticParams() { ... }
```

### CDN for Media
- Audio files → Firebase Storage (CDN-backed)
- Images → Next.js Image optimization + CDN
- Video recordings → Firebase Storage or external CDN

### Horizontal Scaling
- Agora handles video infrastructure (no server management)
- Firebase/Firestore scales automatically
- Next.js deploys serverlessly on Vercel (zero-config scaling)
- Stripe manages payment infrastructure

### When You Outgrow Firebase
- Move to PostgreSQL (Supabase or PlanetScale) at ~50k MAU
- Extract lesson content service as separate microservice
- Add Redis for session/leaderboard caching
- Consider dedicated media processing pipeline for speaking exercises
