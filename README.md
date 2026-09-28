# Ahmed Hamada — Premium Personal Portfolio & Complete CMS

A production-ready, fully dynamic, database-backed personal portfolio and content management system designed specifically for **Ahmed Hamada**, Data Analyst, BI Developer, and Technical Instructor.

---

## 🌟 Key Highlights & Architecture

- **Independent Personal Brand**: Typographic wordmark and monogram for Ahmed Hamada using the approved royal navy color palette (`#0B2D5B`, `#2563EB`, `#60A5FA`, `#0F172A`, `#E5E7EB`, `#FFFFFF`).
- **Complete Admin Dashboard (`/admin`)**: Manage every section, project, skill, service, timeline milestone, certificate, navigation item, and theme appearance in real time without editing source code.
- **Bilingual Support**: Instant toggle between **English (LTR)** and **Arabic (RTL)** with native Cairo and Inter typography and separate bilingual database fields.
- **Detailed Analytical Case Studies**: Dedicated project detail pages (`/projects/[slug]`) featuring problem statements, methodology, key findings, strategic business recommendations, and interactive screenshot galleries.
- **Centralized Media Library**: Upload, preview, copy URLs, and organize images and documents across projects and sections.
- **Database-Driven**: Powered by **Prisma ORM** with zero-config local SQLite and seamless production PostgreSQL / Supabase / Neon support.
- **Secure Authentication**: Protected admin routes with JWT session tokens and HttpOnly secure cookies.
- **Contact Message Inbox**: Public contact form with rate-limiting, spam honeypot trap, and full admin inbox management (read/unread, starring, deletion).

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+ (Tested on Node v24)
- **npm** or **pnpm** / **yarn**

### 2. Installation & Setup
```bash
# Clone or open directory
cd "e:\Ahmed Hamada"

# Install dependencies
npm install

# Push database schema & generate Prisma client
npx prisma db push

# Seed verified initial content and admin account
node scripts/seed.mjs

# Start the development server
npm run dev
```

Visit the website at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Administrator Access

- **Admin Login URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Email**: `admin@ahmedhamada.dev`
- **Default Password**: `AdminPassword123!`

*(You can update your email, name, and password anytime under `/admin/account`)*

---

## ⚙️ Environment Variables

Create or update `.env` in the root directory:

```env
# Database (SQLite default for local, PostgreSQL for production)
DATABASE_URL="file:./dev.db"
# Production PostgreSQL example:
# DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Admin Initial Seed Credentials
ADMIN_EMAIL="admin@ahmedhamada.dev"
ADMIN_PASSWORD="AdminPassword123!"
JWT_SECRET="your_custom_secure_jwt_secret_key_2026"

# Public App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional S3 / Cloudflare R2 Storage (if configured)
S3_ENDPOINT=""
S3_BUCKET=""
S3_REGION="auto"
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_PUBLIC_DOMAIN=""
```

---

## 📁 Project Structure

```
├── public/                 # Static assets, uploads, icons
│   ├── favicon.svg         # Personal monogram favicon
│   └── uploads/            # Centralized uploads storage
├── prisma/
│   └── schema.prisma       # Prisma ORM relational database schema
├── scripts/
│   └── seed.mjs            # Seeder with Ahmed Hamada's verified profile
├── src/
│   ├── app/
│   │   ├── api/            # Secure REST APIs (Auth, Admin CRUD, Contact)
│   │   ├── admin/          # Full Admin Dashboard portal
│   │   ├── projects/[slug] # Dynamic project case study pages
│   │   ├── globals.css     # Global Tailwind styles & CSS variables
│   │   ├── layout.tsx      # Root layout with fonts & providers
│   │   └── page.tsx        # Public portfolio home page
│   ├── components/         # Modular UI & Client components
│   └── lib/                # Prisma client, Auth JWT helpers, utils & translations
```

---

## 🚢 Production Deployment

1. **Deploy on Vercel / Railway / Render**:
   - Link your Git repository.
   - Set the `DATABASE_URL` (e.g. Neon, Supabase, or AWS RDS PostgreSQL).
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"` if deploying to Postgres.
   - Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET`.
   - Run build command: `npm run build`.
