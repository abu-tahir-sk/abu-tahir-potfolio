# Abu Tahir Sk — Full-Stack Developer Portfolio CMS

A modern, production-grade, dynamic Developer Portfolio and Content Management System (CMS) built for **Abu Tahir Sk**.

Built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, **PostgreSQL (Neon)**, **Prisma ORM**, and **Jose JWT Authentication**.

---

## 🌟 Features

### 🖥️ Public Portfolio
- **Modern Dark Aesthetic**: Deep space colors (`#0B0B14`, `#101322`, `#15182A`), vibrant violet (`#6C63FF`) & sky blue (`#38BDF8`) accents, subtle glow effects, and responsive cards.
- **Hero Section**: Monogram `{AT}` brand identity, real profile photo support with fallback avatar, availability badge, technology tags, and quick CTAs.
- **Featured Projects Showcase**: Real projects highlighted directly from PostgreSQL with **DocuFlow** (Document & Invoice Management System) as the flagship featured project.
- **Interactive Projects Explorer (`/projects`)**: Real-time client-side search, category filtering (Full Stack, Frontend, Web App), technology tags, and responsive cards.
- **Dynamic Project Details (`/projects/[slug]`)**: Rich markdown-styled descriptions, live demo & GitHub repository links, key feature breakdown, screenshot galleries, and related projects.
- **Skills Grid (`/about` & `/`):** Grouped by category (Frontend, Backend, Database, Tools) without arbitrary percentage meters.
- **Career & Education Timeline**: Work experience, independent projects, and education history backed by PostgreSQL.
- **Resume Manager (`/resume`)**: In-browser document overview, PDF download with fallback, and admin upload controls.
- **Contact Form (`/contact`)**: Form validation with Zod, in-memory IP rate limiting (3 submissions per 10 minutes), spam honeypot, and direct PostgreSQL database persistence.
- **SEO & Social Metadata**: Dynamic OpenGraph tags, JSON-LD structured data, canonical URLs, automated `robots.txt`, and XML `sitemap.xml`.
- **Accessibility & Responsiveness**: Mobile drawer menu, visible focus outlines, ARIA attributes, semantic HTML5, and responsive viewports (320px to 4K).

### 🛠️ Admin Content Management System (`/admin`)
- **Secure Authentication**: Server-side password verification with `bcryptjs`, signed JWT tokens via `jose`, stored in `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
- **Rate-Limited Login**: In-memory IP protection against brute-force attacks (5 attempts per 15 minutes).
- **Dashboard Overview (`/admin`)**: Real-time database metrics (total projects, published vs drafts, featured count, unread contact messages) and quick links.
- **Project CMS (`/admin/projects`)**: Complete CRUD operations, slug auto-generation, draft vs. published state toggle, featured toggle, screenshot manager, and category tags.
- **Skills CMS (`/admin/skills`)**: Create, reorder, update category, and toggle visibility.
- **Experience & Education CMS (`/admin/experience` & `/admin/education`)**: Manage roles, companies, degrees, dates, and achievements.
- **Contact Inquiries Inbox (`/admin/messages`)**: Read, search, mark read/unread, and delete incoming visitor messages.
- **Profile & Resume Settings (`/admin/profile`, `/admin/resume`, `/admin/settings`)**: Update bio, availability status, social links, resume URL, and global SEO metadata.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS 4, Lucide Icons, Custom CSS glow & glassmorphism |
| **Database & ORM** | PostgreSQL (Neon Serverless), Prisma ORM 6.4 |
| **Authentication** | Jose JWT, BcryptJS password hashing, Next.js Middleware |
| **Validation** | Zod v3 |
| **Storage** | Cloudinary CDN (with built-in local filesystem fallback in `/public/uploads/`) |
| **Email** | Resend API (optional notification delivery) |
| **Deployment** | Vercel |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** >= 18.18.0 (LTS recommended)
- **npm** or **pnpm**
- **PostgreSQL Database** (e.g., [Neon.tech](https://neon.tech), Supabase, or a local PostgreSQL instance)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure the environment variables in `.env`:
```env
# Database Connection (PostgreSQL - Neon, Supabase, or Local PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Authentication Secret (Generate with: openssl rand -hex 32)
AUTH_SECRET="your-32-byte-hex-secret-here"

# Initial Admin Bootstrap Credentials (Used during prisma seed)
ADMIN_EMAIL="abutahir2626@gmail.com"
ADMIN_INITIAL_PASSWORD="YourSecurePassword123!"

# Public Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# (Optional) Cloudinary Configuration for Image Uploads
# If left empty, uploads are saved locally to public/uploads/
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# (Optional) Resend API Key for Email Notifications
RESEND_API_KEY=""
CONTACT_EMAIL_NOTIFICATION="abutahir2626@gmail.com"
```

### 4. Database Setup & Seeding
Push the schema to your PostgreSQL database and run the seed script:
```bash
# Push Prisma schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed initial admin user, SiteSettings, DocuFlow project, skills, and timeline
npm run seed
```

> **Default Seed Admin Credentials**:
> - Email: `abutahir2626@gmail.com`
> - Password: `AdminPassword123!` (or the value set in `ADMIN_INITIAL_PASSWORD`)

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin CMS.

---

## 📁 Project Architecture

```
potfolio/
├── prisma/
│   ├── schema.prisma          # PostgreSQL models (AdminUser, Project, Skill, etc.)
│   └── seed.ts                # Database seeder with DocuFlow and profile data
├── public/
│   ├── images/                # Static assets, DocuFlow screenshots & diagrams
│   ├── resume/                # Real resume PDF assets
│   └── uploads/               # Local filesystem fallback for media uploads
├── src/
│   ├── actions/               # Server Actions (Projects, Skills, Experience, Settings)
│   ├── app/
│   │   ├── (public)/          # Public routes: /, /projects, /about, /resume, /contact
│   │   ├── admin/             # Protected CMS routes: /admin, /admin/projects, etc.
│   │   ├── api/
│   │   │   ├── auth/          # Login, Logout, Session endpoints
│   │   │   ├── contact/       # Contact form submission API with rate-limiting
│   │   │   └── uploads/       # Cloudinary / Local upload API handler
│   │   ├── globals.css        # Tailwind design tokens, dark theme colors, animations
│   │   ├── layout.tsx         # Root layout with fonts, metadata, and theme provider
│   │   ├── not-found.tsx      # Accessible custom 404 page
│   │   ├── robots.ts          # Automated SEO robots.txt generator
│   │   └── sitemap.ts         # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── admin/             # CMS UI (AdminSidebar, AdminHeader, modals)
│   │   ├── layout/            # Navbar, Footer, ThemeToggle
│   │   ├── portfolio/         # HeroSection, FeaturedProjects, SkillsSection, Timeline
│   │   └── ui/                # Custom Icons, Cards, Badges, Modals
│   ├── lib/
│   │   ├── auth.ts            # Jose JWT signing, session extraction, requireAuth()
│   │   ├── cloudinary.ts      # Cloudinary upload SDK wrapper
│   │   ├── db.ts              # Global Prisma Client instance
│   │   ├── rate-limit.ts      # In-memory IP rate limiter
│   │   └── validations.ts     # Zod schemas for all forms & mutations
│   └── middleware.ts          # Edge middleware protecting /admin routes
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔒 Security Architecture

1. **Server-Side Authorization**:
   - Every mutation in `src/actions/*` and `src/app/api/*` invokes `requireAuth()` which verifies the signed JWT token on the server before executing database operations.
   - Client-side navigation guards in `middleware.ts` redirect unauthenticated visitors to `/admin/login?from=/admin`.

2. **Password Security**:
   - Passwords are encrypted using `bcryptjs` with salt rounds = 12.
   - Plaintext passwords are never logged or stored in the database.

3. **Protection Against Abuse**:
   - In-memory rate limiting applied to `/api/auth/login` (5 attempts per 15 minutes) and `/api/contact` (3 submissions per 10 minutes).
   - Honeypot anti-spam field in the contact form to reject automated scrapers.
   - Input sanitization and strict schema enforcement with Zod.

---

## 🚢 Deployment to Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete full-stack portfolio CMS"
git push origin main
```

### Step 2: Import Project on Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New Project** and select your GitHub repository.
3. In **Build & Development Settings**, keep default Next.js settings:
   - Build Command: `next build` (or `npm run build`)
   - Output Directory: `.next`

### Step 3: Configure Environment Variables
Add the following environment variables in Vercel Project Settings:
- `DATABASE_URL`: Your managed PostgreSQL connection string (e.g. Neon pooler URL).
- `AUTH_SECRET`: A secure 32-byte secret string (`openssl rand -hex 32`).
- `NEXT_PUBLIC_SITE_URL`: Your custom production domain (e.g. `https://abutahir.dev`).
- `ADMIN_EMAIL`: Your administrator email.
- `ADMIN_INITIAL_PASSWORD`: Secure initial password.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: (Optional for cloud media hosting).
- `RESEND_API_KEY`: (Optional for email notifications).

### Step 4: Run Database Migration on Deploy
In Vercel Build Command, configure:
```bash
prisma generate && next build
```
Or run `npx prisma db push` from your local terminal targeting the production `DATABASE_URL`.

---

## 🧪 Testing & Verification

Run the automated test suite and type checking:

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run Next.js production build test
npm run build

# Run Route & Integration Tests
node scratch/test-routes.mjs

# Run Database Mutation Tests
node scratch/test-crud.mjs
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
