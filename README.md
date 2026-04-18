# SwingForGood

A full-stack subscription-based platform that combines performance tracking, reward draws, and charitable contributions — built as part of a Full-Stack Development assignment.

---

## Live Demo

Live App:https://golf-swing-six.vercel.app/
GitHub Repo: https://github.com/shoryataneja/GolfSwing

---

## Project Overview

SwingForGood is designed to deliver an engaging and modern experience where users can:

* Track their golf performance
* Participate in monthly reward draws
* Contribute to charities through subscriptions

The platform focuses on clean UI/UX, scalable architecture, and real-world product behavior.

---

## Features

### Authentication

* User signup and login
* Secure session handling
* Role-based access (User / Admin)

---

### Subscription System

* Monthly and yearly plans
* Subscription status tracking
* Access control for premium features

---

### Score Management

* Users can enter golf scores (1–45)
* Only last 5 scores are stored
* Automatic replacement of oldest score
* No duplicate entries for the same date
* Scores displayed in reverse chronological order

---

### Draw and Reward System

* Monthly draw generation
* Random number-based draw logic
* Match-based reward tiers:

  * 5 matches → Jackpot (rollover supported)
  * 4 matches → Tier 2
  * 3 matches → Tier 3
* Draw simulation support

---

### Prize Pool Logic

* Subscription-based prize pool
* Distribution:

  * 40% → Jackpot (rollover)
  * 35% → 4-match winners
  * 25% → 3-match winners
* Equal distribution among winners

---

### Charity Integration

* Users select a charity
* Minimum 10% contribution
* Customizable contribution percentage
* Charity listing and selection

---

### User Dashboard

* Subscription status overview
* Score entry and history
* Charity selection
* Draw participation summary
* Winnings and payout tracking

---

### Admin Panel

* User management
* Subscription control
* Draw execution and publishing
* Charity management
* Winner verification and payout tracking

---

### Winner Verification

* Users upload proof of scores
* Admin approval and rejection system
* Payment status tracking

---

## Tech Stack

* Frontend: Next.js (App Router), Tailwind CSS
* Backend: Next.js API Routes
* Database: Supabase (PostgreSQL)
* State Management: Zustand
* Deployment: Vercel

---

## Project Structure

```bash
src/
 ├── app/
 │   ├── api/          # Backend routes
 │   ├── (auth)/       # Auth pages
 │   ├── dashboard/    # User dashboard
 │   ├── admin/        # Admin panel
 │
 ├── components/       # Reusable UI components
 ├── services/         # Business logic
 ├── lib/              # Utilities (db, auth)
 ├── hooks/            # Custom hooks
 ├── types/            # Type definitions
 └── middleware.js     # Route protection
```

---

## Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

---

## Deployment

* Hosted on Vercel
* Environment variables configured in Vercel dashboard
* Optimized for production build

---

## Testing Checklist

* User signup and login
* Subscription flow
* Score entry (5-score logic)
* Draw execution and results
* Charity selection
* Dashboard functionality
* Admin controls
* Responsive design

---

## Highlights

* Clean and scalable architecture
* Separation of concerns (API / Services / UI)
* Real-world product design approach
* Fully functional full-stack implementation

---

## Author

Shorya Taneja

---

## Note

This project was built as part of a selection assignment and aims to demonstrate full-stack development skills, system design, and product thinking.
