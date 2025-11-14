# Akorify - Şarkı Sözleri ve Gitar Akorları Platformu

A modern, SEO-optimized web application for lyrics and guitar chords built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Server-Side Rendering (SSR)** for optimal SEO
- **Incremental Static Regeneration (ISR)** for song pages
- **Google AdSense** ready with placeholder components
- **Mobile-first** responsive design
- **Admin panel** for managing songs
- **Search functionality** with pagination
- **Type-safe** with TypeScript and Zod validation
- **Production-ready** code structure

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (or MySQL)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/akorify?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google AdSense (optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=""

# Node Environment
NODE_ENV="development"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create a migration (for production)
npm run db:migrate
```

### 4. Import ChordPro Files (Optional)

If you have ChordPro format files (`.pro`, `.chordpro`, or `.txt`):

```bash
# Place your ChordPro files in the chordpro-files/ directory
# Then run the import script:
npm run import:chordpro

# Or specify a custom directory:
node scripts/import-chordpro.js /path/to/your/chordpro/files
```

**ChordPro Format Example:**
```
{title: Şarkı Adı}
{artist: Sanatçı Adı}

{start_of_verse}
[Am] Şarkı sözleri buraya
[F] Akorlar köşeli parantez içinde
{end_of_verse}
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
akorify/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── page.tsx           # Homepage
│   │   ├── songs/             # Songs listing & detail pages
│   │   └── admin/             # Admin panel
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdSlot.tsx         # Google AdSense component
│   │   ├── SongCard.tsx
│   │   ├── NewSongForm.tsx
│   │   └── EditSongForm.tsx
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma singleton
│   │   └── utils.ts           # Helper functions
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── middleware.ts          # Request logging
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

## 🎯 Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Database
- **TailwindCSS** - Utility-first CSS
- **Zod** - Schema validation
- **SWR** - Data fetching (client-side)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create database migration
- `npm run db:studio` - Open Prisma Studio
- `npm run import:chordpro` - Import ChordPro format files

## 🔍 SEO Features

- Dynamic metadata per song page
- Open Graph tags
- Twitter Card support
- Structured data (JSON-LD)
- Canonical URLs
- Sitemap-ready structure

## 📊 Database Schema

### Song Model
- `id` - Unique identifier
- `title` - Song title
- `slug` - URL-friendly identifier
- `artist` - Artist name
- `content` - Lyrics and chords (text)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### User Model
- `id` - Unique identifier
- `email` - User email (unique)
- `passwordHash` - Hashed password
- `role` - User role (ADMIN | USER)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🎨 Styling

The project uses TailwindCSS with a custom configuration optimized for:
- Mobile-first responsive design
- Lyrics typography (serif fonts, optimal line-height)
- Dark/light mode support (via CSS variables)
- Accessible color contrast

## 🔐 Admin Panel

Access the admin panel at `/admin` to:
- View all songs
- Add new songs
- Edit existing songs

**Note:** Authentication is not implemented in this initial version. You should add authentication before deploying to production.

## 📈 Performance Optimizations

- **ISR (Incremental Static Regeneration)** - Song pages revalidate daily
- **Server Components** - Default rendering strategy
- **Database Indexing** - Optimized queries on slug, artist, and createdAt
- **Caching** - Strategic revalidation intervals

## 🚨 Production Checklist

Before deploying to production:

1. ✅ Set up proper authentication for admin panel
2. ✅ Configure Google AdSense client ID
3. ✅ Set up Google Search Console verification
4. ✅ Configure production database
5. ✅ Set up environment variables in hosting platform
6. ✅ Enable HTTPS
7. ✅ Set up error monitoring (e.g., Sentry)
8. ✅ Configure CDN for static assets
9. ✅ Set up backup strategy for database
10. ✅ Test all admin functionality

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

