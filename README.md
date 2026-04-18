# GolfSwing

A subscription-based golf performance tracking platform with monthly prize draws and charity contributions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Auth**: JWT via `jose` + Supabase Auth
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── api/              # Backend API routes (Next.js route handlers)
│   ├── (auth)/           # Login & signup pages
│   ├── dashboard/        # User dashboard pages
│   ├── admin/            # Admin panel pages
│   ├── layout.js         # Root layout
│   └── page.js           # Landing page
├── components/ui/        # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # DB client, auth helpers, shared utilities
├── services/             # Business logic (no logic in route handlers)
├── types/                # JSDoc type definitions and constants
└── middleware.js         # Route protection
```

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd golfswing
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `JWT_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### 3. Run the database schema

Go to **Supabase → SQL Editor → New query**, paste the full SQL from the schema section below, and click **Run**.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment on Vercel

1. Push your code to GitHub (`.env.local` is gitignored — never committed)
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In **Environment Variables**, add all 5 variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain (e.g. `https://golfswing.vercel.app`)
5. Click **Deploy**

---

## Plans & Pricing

| Plan    | Price    |
|---------|----------|
| Monthly | ₹299/mo  |
| Yearly  | ₹2,999/yr |

## Prize Pool Split

| Tier    | Match | Pool Share |
|---------|-------|------------|
| Jackpot | 5/5   | 40%        |
| Tier 2  | 4/5   | 35%        |
| Tier 3  | 3/5   | 25%        |

50% of monthly subscription revenue goes into the prize pool. Jackpot rolls over if no 5-match winner.

---

## Database Schema

Run this in **Supabase → SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  charity_id    UUID,
  charity_pct   NUMERIC(5,2) DEFAULT 10 CHECK (charity_pct >= 10 AND charity_pct <= 100),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.charities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  logo_url    TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users
  ADD CONSTRAINT fk_users_charity
  FOREIGN KEY (charity_id) REFERENCES public.charities(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan        TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
  amount      NUMERIC(10,2) NOT NULL,
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score       INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date  DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

CREATE TABLE IF NOT EXISTS public.draws (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month       TEXT NOT NULL,
  numbers          INTEGER[] NOT NULL,
  status           TEXT NOT NULL DEFAULT 'simulated' CHECK (status IN ('simulated', 'published')),
  prize_pool       NUMERIC(10,2) DEFAULT 0,
  jackpot_amount   NUMERIC(10,2) DEFAULT 0,
  tier2_amount     NUMERIC(10,2) DEFAULT 0,
  tier3_amount     NUMERIC(10,2) DEFAULT 0,
  jackpot_rollover NUMERIC(10,2) DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  published_at     TIMESTAMPTZ,
  UNIQUE(draw_month)
);

CREATE TABLE IF NOT EXISTS public.winners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id         UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier            INTEGER NOT NULL CHECK (tier IN (3, 4, 5)),
  matched_numbers INTEGER[] NOT NULL,
  prize_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  proof_url       TEXT,
  verification    TEXT NOT NULL DEFAULT 'pending' CHECK (verification IN ('pending', 'approved', 'rejected')),
  payment_status  TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.donations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  charity_id  UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  amount      NUMERIC(10,2) NOT NULL,
  month       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.charities (name, description) VALUES
  ('Cancer Research UK', 'Funding life-saving cancer research and clinical trials across the UK.'),
  ('British Heart Foundation', 'Fighting heart and circulatory diseases through research and education.'),
  ('Macmillan Cancer Support', 'Providing medical, emotional, and financial support to people with cancer.'),
  ('Age UK', 'Improving later life for older people through support and advocacy.'),
  ('Mind', 'Providing advice and support to empower anyone experiencing a mental health problem.')
ON CONFLICT DO NOTHING;

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own"        ON public.users         FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"        ON public.users         FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "subs_select_own"         ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scores_select_own"       ON public.scores        FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scores_insert_own"       ON public.scores        FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scores_delete_own"       ON public.scores        FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "draws_select_published"  ON public.draws         FOR SELECT USING (status = 'published');
CREATE POLICY "winners_select_own"      ON public.winners       FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "charities_select_active" ON public.charities     FOR SELECT USING (active = TRUE);
CREATE POLICY "donations_select_own"    ON public.donations     FOR SELECT USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
```

---

## Making a User an Admin

After signing up, run this in **Supabase → SQL Editor**:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```
