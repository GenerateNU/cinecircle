# CineCircle - Project Handoff Document

## Project Overview

**CineCircle** is a community-oriented mobile application designed for Indian cinema fans to discover, discuss, and celebrate movies across Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), Sandalwood (Kannada), and Bollywood (Hindi). The platform creates a centralized social hub for reviews, ratings, newsfeeds, and discussion threads, bringing together scattered conversations from Reddit, Letterboxd, and Instagram into one cohesive, engaging, and culturally-rooted experience.

**Developed by Generate:**
- **Project Lead:** Kaamil Thobani
- **Technical Leads:** Alison Ryan, Dylan Anctil
- **Design Lead:** Katherine Zhang

**Tech Stack:**
- **Frontend:** React Native (Expo) with TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (JWT-based)
- **File Storage:** AWS S3
- **Development:** Docker + Docker Compose
- **Movie Data:** The Movie Database (TMDB) API

---

## Features Implemented

### Core Features

#### 1. **User Authentication & Profiles**
- Supabase-based authentication (email/password, OAuth)
- User profile management (username, bio, profile picture, display name)
- Onboarding flow for new users
- Language preferences (primary and secondary languages)
- Privacy settings (private accounts, spoiler warnings)
- Favorite genres and movies tracking

#### 2. **Movie Discovery & Information**
- Integration with TMDB API for movie data
- Movie search functionality (by title, language, genre)
- Movie details (title, description, ratings, release year, director)
- Local ratings vs. IMDB ratings
- Movie posters and images
- Language filtering (Telugu, Tamil, Malayalam, Kannada, Hindi)

#### 3. **Social Features**
- **Posts:** Create short-form and long-form posts about movies
  - Image uploads (multiple images per post)
  - Spoiler tags
  - Custom tags
  - Reposting functionality
- **Comments:** Nested comment threads on posts
- **Reactions:** Four reaction types (SPICY, STAR_STUDDED, THOUGHT_PROVOKING, BLOCKBUSTER)
- **Comment Likes:** Like individual comments
- **User Following:** Follow/unfollow other users
- **Activity Feed:** Personalized feed of posts from followed users

#### 4. **Ratings & Reviews**
- Star ratings (1-5 stars) for movies
- Written reviews with tags
- Rating aggregation and vote counts
- Personal rating history

#### 5. **Local Events**
- Create and discover local cinema events
- Event details (title, time, description, genre, cost, occasion)
- Location-based events (latitude/longitude)
- RSVP system (attending/interested/not attending)
- Event images
- Saved events and attended events tracking

#### 6. **Bookmarks & Watchlists**
- "To Watch" bookmarks
- "Watched" bookmarks
- Personal movie lists

#### 7. **Translation Service**
- OpenAI-powered translation for user-generated content
- Support for multiple South Indian languages

#### 8. **Search**
- Unified search across movies, users, and posts
- Filter by content type
- Language-specific search

### Technical Features

#### 9. **Auto-Generated Type System**
- Backend types automatically generated to frontend
- OpenAPI 3.0 specification generation
- Type-safe API contracts
- Eliminates manual type duplication

#### 10. **Docker Development Environment**
- Containerized backend with hot reload
- Local PostgreSQL database
- Production sync capability (optional)
- Consistent development environment

#### 11. **Database Sync System**
- Sync production schema and data to local development
- One-command database replication
- Prisma-based schema management

#### 12. **Image Upload System**
- AWS S3 integration with organized folder structure
- Base64 image upload support
- Multiple image uploads per post
- Profile picture uploads
- Event image uploads

#### 13. **Testing Infrastructure**
- Jest test suite
- Unit tests for services
- API integration tests
- Test coverage reporting

#### 14. **API Documentation**
- Scalar API documentation (auto-generated)
- Available at `/api/docs` when backend is running

---

## Differences from Original Charter

The original charter outlined a vision for CineCircle as a fan-first, celebration-driven platform for Indian cinema. Here's how the implementation compares to the charter's vision:

### Fully Implemented Charter Features

**1. Regional Language Support**
- Charter specified: Telugu, Tamil, Malayalam, Kannada, and Hindi tabs
- Implementation: Language filtering and preferences for all five languages 
- Users can set primary and secondary language preferences

**2. Personalized Newsfeed ("CineFeed")**
- Charter specified: Reviews, ratings, and trending updates
- Implementation: Activity feed with posts from followed users, ratings, and reviews
- Chronological feed of content from user's network

**3. Ratings & Reviews**
- Charter specified: User ratings and reviews
- Implementation: Star ratings (1-5), written reviews with tags, vote counts
- Dual rating system (local community + IMDB)

**4. Friends & Social Features**
- Charter specified: Friends-only feeds and customizable profiles
- Implementation: Follow system, user profiles with bios, profile pictures, privacy settings
- Private account options

**5. Cultural Authenticity**
- Charter specified: Reactions like "Claps," "Star Power," "Encore," and "Masala"
- Implementation: Four reaction types: SPICY, STAR_STUDDED, THOUGHT_PROVOKING, BLOCKBUSTER
- Custom reactions that reflect cinema fan culture

### Partially Implemented / Modified Features

**1. Forum-Style Discussion Threads**
- Charter specified: Forum threads with moderation
- Implementation: Post-based discussions with nested comments (modified approach)
- Difference: Uses a social media post model rather than traditional forums
- Rationale: More engaging and familiar UX for mobile users

**2. News & Updates Integration**
- Charter specified: Curated industry news, trailers, box office updates
- Implementation: Not implemented 
- Difference: Focus on user-generated content only
- Rationale: Scope prioritized social features; news integration would require content curation team

**3. Music Integration**
- Charter specified: Music features (mentioned in charter)
- Implementation: Not implemented 
- Rationale: Prioritized core social and discovery features first

**4. Gamification (Achievements, Challenges, Leaderboards)**
- Charter specified: Achievements, challenges, leaderboards
- Implementation: Not implemented 
- Rationale: MVP focused on core social features; gamification is V2 feature

**5. Content Moderation**
- Charter specified: Moderation to reduce spam and hate speech
- Implementation: Basic structure in place, but no active moderation tools
- Difference: No automated moderation, reporting system, or admin tools
- Rationale: Requires additional infrastructure; planned for post-launch

### Additional Features Beyond Charter

**1. Local Events System**
- Not in charter: Full event discovery and RSVP system
- Implementation: Create events, RSVP (attending/interested), location-based discovery
- Rationale: Extends community engagement beyond digital discussions

**2. Bookmarks & Watchlists**
- Not in charter: "To Watch" and "Watched" bookmarks
- Implementation: Personal movie lists for tracking viewing
- Rationale: Common user need for movie discovery apps

**3. Auto-Generated Type System**
- Not in charter: Automated backend-to-frontend type generation
- Implementation: OpenAPI-based type generation pipeline
- Rationale: Technical excellence and maintainability

**4. Docker Development Environment**
- Not in charter: Containerized development with production sync
- Implementation: Full Docker setup with hot reload and database sync
- Rationale: Team consistency and onboarding efficiency

**5. Translation Service**
- Not in charter: AI-powered translation
- Implementation: OpenAI integration for translating user content
- Rationale: Supports cross-language community engagement

**6. Reposting**
- Not in charter: Repost functionality
- Implementation: Users can repost others' content (like Twitter/X)
- Rationale: Amplifies content discovery and engagement

### Charter vs. Implementation

| Charter Feature | Status | Notes |
|----------------|--------|-------|
| Regional language tabs | Implemented | All 5 languages supported |
| Personalized feed | Implemented | Activity feed from followed users |
| Ratings & reviews | Implemented | Star ratings + written reviews |
| Friends/social features | Implemented | Follow system + profiles |
| Cultural reactions | Implemented | 4 custom reaction types |
| Forum discussions | Modified | Post-based instead of forum threads |
| News integration | Not implemented | User content only |
| Music features | Not implemented | Scope prioritization |
| Gamification | Not implemented |  |
| Content moderation | Partial | Structure only, no active tools |
| Local events | Bonus feature | Full RSVP system |
| Bookmarks/watchlists | Bonus feature | Personal movie tracking |
| Translation | Bonus feature | AI-powered |

### Key Architectural Decisions

**Database Choice: Supabase (PostgreSQL)**
- Provides authentication and database capabilities
- Multi-schema approach (`auth` + `public`)
- Scalable and production-ready

**Image Storage: AWS S3**
- Organized folder structure (posts/, profiles/, movies/, events/)
- Base64 upload support for React Native
- Scalable and cost-effective

**Movie Data: TMDB API**
- Comprehensive movie information
- Dual rating system (community/CineCircle + IMDB)
- Regular data updates

**Development: Docker-First**
- Consistent development environment
- Production database sync capability

---

## Critical Implementation Details

### 1. Authentication Flow
- **JWT tokens** issued by Supabase
- Token verification happens in `backend/src/middleware/auth.ts`
- Frontend stores tokens via Supabase client
- User ID extracted from JWT and attached to requests

### 2. Database Type Transformations
**Important:** Prisma database types don't always match API types. Controllers must transform data:

```typescript
// Example from backend/src/controllers/tmdb.ts
export function mapMovieDbToApi(dbMovie: Prisma.movieGetPayload<{}>): Movie {
  return {
    movieId: dbMovie.movieId,
    title: dbMovie.title,
    imdbRating: dbMovie.imdbRating != null ? Number(dbMovie.imdbRating) : null,
    languages: dbMovie.languages ? (dbMovie.languages as string[]) : null,
    // ... more transformations
  };
}
```

### 3. Type Generation Workflow
When you modify backend types:
1. Edit `backend/src/types/models.ts` or `apiTypes.ts`
2. Run `npm run backend:types` from project root
3. Frontend types automatically update in `frontend/types/api-generated.ts`
4. No manual copying required!

### 4. Image Upload Flow
1. Frontend converts image to base64
2. Sends to backend with `{ base64, name, fileType }`
3. Backend uploads to S3 using `sendFilesToS3()`
4. Returns public S3 URL
5. URL stored in database

### 5. Database Schema Sync
- **Local development** uses PostgreSQL in Docker
- **Production sync** (optional) copies schema + data from Supabase
- Controlled by `SYNC_FROM_PRODUCTION` env variable
- Sync happens automatically on container startup if enabled

### 6. Feed Algorithm
The feed is currently a simple chronological feed of posts from followed users. Located in `backend/src/controllers/feed.ts`.

### 7. TMDB Integration
- Movie data fetched from TMDB API
- Cached in local database (`movie` table)
- Import script available: `npm run import:tmdb` (inside container)
- TMDB IDs stored for reference

---

## Third-Party Services & API Keys

### Required Services

#### 1. **Supabase** (Database & Auth)
- **Service:** https://supabase.com
- **What it provides:** PostgreSQL database, authentication, real-time subscriptions
- **Keys needed:**
  - `SUPABASE_URL` - Your project URL
  - `SUPABASE_ANON_KEY` - Public anonymous key
  - `SUPABASE_JWT_SECRET` - JWT signing secret
  - `SUPABASE_SERVICE_ROLE_KEY` - Admin key (backend only)
  - `DATABASE_URL` - Connection string (pooler)
  - `DIRECT_URL` - Direct connection string

#### 2. **AWS S3** (File Storage)
- **Service:** https://aws.amazon.com/s3/
- **What it provides:** Image and file storage
- **Keys needed:**
  - `AWS_ACCESS_KEY_ID` - IAM user access key
  - `AWS_SECRET_ACCESS_KEY` - IAM user secret key
  - `AWS_REGION` - S3 bucket region (e.g., `us-east-1`)
  - `AWS_BUCKET_NAME` - Your S3 bucket name

#### 3. **The Movie Database (TMDB)** (Movie Data)
- **Service:** https://www.themoviedb.org/settings/api
- **What it provides:** Movie information, posters, ratings
- **Keys needed:**
  - `TMDB_API_TOKEN` - API Read Access Token (v4 auth)

#### 4. **OpenAI** (Translation - Optional)
- **Service:** https://platform.openai.com/api-keys
- **What it provides:** AI-powered translation
- **Keys needed:**
  - `OPENAI_API_KEY` - API key

#### 5. **WhatsApp Cloud API** (Optional - Not fully implemented)
- **Service:** https://developers.facebook.com/docs/whatsapp
- **What it provides:** WhatsApp notifications (future feature)
- **Keys needed:**
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `SYSTEM_USER_TOKEN`

### Environment Variables Template

See `.env.example` files created below for complete reference.

---

## Database Configuration

### Setting Up Your Own Supabase Database

#### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Choose a region close to your users
4. Save your database password

#### Step 2: Get Connection Strings
From your Supabase dashboard:
1. Go to **Settings** → **Database**
2. Copy the **Connection Pooling** URL (this is your `DATABASE_URL`)
3. Copy the **Direct Connection** URL (this is your `DIRECT_URL`)
4. Format: `postgresql://postgres.[project-ref]:[password]@[host]:[port]/postgres`

#### Step 3: Get Auth Keys
From your Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy `URL` → This is your `SUPABASE_URL`
3. Copy `anon public` key → This is your `SUPABASE_ANON_KEY`
4. Copy `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Settings** → **API** → **JWT Settings**
6. Copy `JWT Secret` → This is your `SUPABASE_JWT_SECRET`

#### Step 4: Apply Database Schema
From your project root:

```bash
# Start the backend container
npm run backend:start

# Get into the container shell
npm run backend:shell

# Push the Prisma schema to your Supabase database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

This will create all tables, relationships, and enums in your Supabase database.

#### Step 5: (Optional) Seed Initial Data
If you have seed data:

```bash
# Inside container shell
npm run db:seed
```

### Database Schema Overview

The database uses two schemas:
- **`auth` schema:** Managed by Supabase (users, sessions, tokens, etc.)
- **`public` schema:** Your application data (posts, movies, events, etc.)

**Key tables in `public` schema:**
- `UserProfile` - User profiles and preferences
- `Post` - User posts about movies
- `Comment` - Comments on posts
- `Rating` - Movie ratings
- `movie` - Movie information (from TMDB)
- `local_event` - Local cinema events
- `event_rsvp` - Event attendance
- `UserFollow` - Follow relationships
- `PostReaction` - Reactions to posts
- `CommentLike` - Likes on comments

### Viewing Your Database
- **Prisma Studio:** Run `npx prisma studio` inside container (opens at http://localhost:5555)
- **Supabase Dashboard:** Use the Table Editor in your Supabase project

---

## Setup Instructions

### Prerequisites
- **Docker Desktop** installed and running
- **Node.js** 18+ (for root-level scripts)
- **Git**

### Initial Setup

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd cinecircle
```

#### 2. Install Root Dependencies
```bash
npm install
```

#### 3. Create Environment Files

Create `.env` in project root:
```bash
# Copy from .env.example
cp .env.example .env
```

Create `backend/.env`:
```bash
# Copy from backend/.env.example
cp backend/.env.example backend/.env
```

Create `frontend/.env`:
```bash
# Copy from frontend/.env.example
cp frontend/.env.example frontend/.env
```

#### 4. Configure Environment Variables
Edit the `.env` files with your actual API keys and credentials (see `.env.example` files for reference).

**Critical variables to set:**
- All Supabase credentials
- AWS S3 credentials
- TMDB API token

#### 5. Start Backend
```bash
npm run backend:start
```

This will:
- Start PostgreSQL container
- Start backend API container
- Apply database schema (if first run)
- Start API server at http://localhost:3001

**Verify backend is running:**
```bash
curl http://localhost:3001/api/ping
# Should return: {"message":"pong"}
```

#### 6. Install Frontend Dependencies
```bash
npm run frontend:install
```

#### 7. Start Frontend
```bash
npm run frontend:start
```

This starts Expo dev server. You can then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

### Development Workflow

#### Backend Development
```bash
# View logs
npm run backend:logs

# Get into container shell
npm run backend:shell

# Run tests
npm run backend:test

# Generate frontend types after backend changes
npm run backend:types

# Stop backend
npm run backend:stop

# Full cleanup (removes volumes)
npm run backend:clean
```

#### Frontend Development
```bash
# Start dev server
npm run frontend:start

# Run on iOS
npm run frontend:ios

# Run on Android
npm run frontend:android

# Clean rebuild
npm run frontend:clean
```

#### Database Operations
```bash
# Get into container shell first
npm run backend:shell

# Inside container:
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx prisma generate        # Regenerate client
npm run db:sync            # Re-sync from production (if configured)
```

### Common Issues & Solutions

#### Issue: Backend won't start
- **Solution:** Check Docker Desktop is running
- **Solution:** Check port 3001 isn't already in use
- **Solution:** Run `npm run backend:clean` and try again

#### Issue: Database connection errors
- **Solution:** Verify `DATABASE_URL` and `DIRECT_URL` are correct
- **Solution:** Check Supabase project is running
- **Solution:** Ensure database password is URL-encoded (use `%23` for `#`, etc.)

#### Issue: Frontend can't connect to backend
- **Solution:** Check `API_BASE_URL` in `frontend/.env`
- **Solution:** For physical devices, use your computer's local IP (not `localhost`)
- **Solution:** Ensure backend is running (`curl http://localhost:3001/api/ping`)

#### Issue: Type errors in frontend
- **Solution:** Run `npm run backend:types` to regenerate types
- **Solution:** Restart TypeScript server in your IDE

#### Issue: Images not uploading
- **Solution:** Verify AWS credentials are correct
- **Solution:** Check S3 bucket exists and has correct permissions
- **Solution:** Ensure bucket policy allows public read access for uploaded images

---

## Contact Information


### Generate Team

**Project Lead**
- Kaamil Thobani - thobani.k@northeastern.edu

**Technical Leads**
- Alison Ryan
- Dylan Anctil - anctil.d@northeastern.edu

**Design Lead**
- Katherine Zhang - zhang.kath@northeastern.edu