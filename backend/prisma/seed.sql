-- ============================================
-- CineCircle Seed Data
-- ============================================
-- NOTE: Movies are NOT seeded here - use `npm run import:tmdb` to populate movies
-- This seed handles: users, profiles, events, posts, reactions, comments, follows

-- Clear existing data (in order due to foreign keys)
TRUNCATE TABLE "public"."PostReaction" CASCADE;
TRUNCATE TABLE "public"."CommentLike" CASCADE;
TRUNCATE TABLE "public"."Comment" CASCADE;
TRUNCATE TABLE "public"."Rating" CASCADE;
TRUNCATE TABLE "public"."Post" CASCADE;
TRUNCATE TABLE "public"."event_rsvp" CASCADE;
TRUNCATE TABLE "public"."UserFollow" CASCADE;
TRUNCATE TABLE "public"."UserProfile" CASCADE;
TRUNCATE TABLE "public"."local_event" CASCADE;
-- Don't truncate movies - they're imported via TMDB script

-- ============================================
-- Auth Users (Supabase auth.users table)
-- ============================================
INSERT INTO "auth"."users" (
  "id", 
  "instance_id", 
  "aud", 
  "role", 
  "email", 
  "encrypted_password",
  "email_confirmed_at",
  "created_at",
  "updated_at",
  "is_sso_user"
) VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'charlie@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'diana@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evan@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'fiona@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'george@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hannah@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'isaac@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'julia@cinecircle.com', '$2a$10$test', NOW(), NOW(), NOW(), false)
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- User Profiles
-- ============================================
INSERT INTO "public"."UserProfile" (
  "userId",
  "username",
  "onboardingCompleted",
  "primaryLanguage",
  "secondaryLanguage",
  "profilePicture",
  "country",
  "city",
  "favoriteGenres",
  "favoriteMovies",
  "privateAccount",
  "spoiler",
  "bio",
  "eventsSaved",
  "eventsAttended",
  "createdAt",
  "updatedAt",
  "bookmarkedToWatch",
  "bookmarkedWatched"
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice_movie_fan', true, 'English', ARRAY['Hindi'], NULL, 'USA', 'New York', ARRAY['Drama', 'Thriller'], ARRAY['10757', '85985'], false, false, 'Bollywood enthusiast 🎬', ARRAY['e1111111-1111-1111-1111-111111111111'], ARRAY['e5555555-5555-5555-5555-555555555555'], NOW(), NOW(), ARRAY['533991'], ARRAY['10757', '338065']),
  ('22222222-2222-2222-2222-222222222222', 'bob_cineaste', true, 'English', ARRAY['French'], NULL, 'USA', 'Los Angeles', ARRAY['Action', 'Comedy'], ARRAY['85985', '46622'], false, false, 'Film critic & blogger', ARRAY['e2222222-2222-2222-2222-222222222222'], ARRAY['e1111111-1111-1111-1111-111111111111'], NOW(), NOW(), ARRAY['570910'], ARRAY['85985', '46622']),
  ('33333333-3333-3333-3333-333333333333', 'charlie_critic', true, 'English', ARRAY[]::text[], NULL, 'Canada', 'Toronto', ARRAY['Comedy', 'Romance'], ARRAY['336211', '10757'], false, false, 'Movie marathoner 🍿', ARRAY['e3333333-3333-3333-3333-333333333333'], ARRAY['e1111111-1111-1111-1111-111111111111'], NOW(), NOW(), ARRAY['581361'], ARRAY['336211', '10757']),
  ('44444444-4444-4444-4444-444444444444', 'diana_director', true, 'English', ARRAY['Italian'], NULL, 'Italy', 'Rome', ARRAY['Drama', 'Biography'], ARRAY['570910', '581361'], false, false, 'Aspiring filmmaker', ARRAY['e4444444-4444-4444-4444-444444444444'], ARRAY['e3333333-3333-3333-3333-333333333333'], NOW(), NOW(), ARRAY['10757'], ARRAY['570910', '581361']),
  ('55555555-5555-5555-5555-555555555555', 'evan_enthusiast', true, 'English', ARRAY['Japanese'], NULL, 'USA', 'San Francisco', ARRAY['Animation', 'Fantasy'], ARRAY['533991', '338065'], false, false, 'Horror movie junkie 👻', ARRAY['e1111111-1111-1111-1111-111111111111'], ARRAY['e5555555-5555-5555-5555-555555555555'], NOW(), NOW(), ARRAY['85985'], ARRAY['533991', '338065']),
  ('66666666-6666-6666-6666-666666666666', 'fiona_film_buff', true, 'English', ARRAY['German'], NULL, 'Germany', 'Berlin', ARRAY['Horror', 'Mystery'], ARRAY['581361', '570910'], false, false, 'International cinema lover', ARRAY['e3333333-3333-3333-3333-333333333333'], ARRAY['e1111111-1111-1111-1111-111111111111'], NOW(), NOW(), ARRAY['336211'], ARRAY['581361', '570910']),
  ('77777777-7777-7777-7777-777777777777', 'george_genre_fan', true, 'English', ARRAY[]::text[], NULL, 'USA', 'Chicago', ARRAY['Western', 'Crime'], ARRAY['46622', '85985'], false, false, 'Classic cinema fan', ARRAY['e2222222-2222-2222-2222-222222222222'], ARRAY['e3333333-3333-3333-3333-333333333333'], NOW(), NOW(), ARRAY['10757'], ARRAY['46622', '85985']),
  ('88888888-8888-8888-8888-888888888888', 'hannah_hollywood', true, 'English', ARRAY['Korean'], NULL, 'South Korea', 'Seoul', ARRAY['Drama', 'Thriller'], ARRAY['338065', '533991'], false, false, 'K-drama & Bollywood fusion', ARRAY['e2222222-2222-2222-2222-222222222222'], ARRAY['e4444444-4444-4444-4444-444444444444'], NOW(), NOW(), ARRAY['570910'], ARRAY['338065', '533991']),
  ('99999999-9999-9999-9999-999999999999', 'isaac_indie', true, 'English', ARRAY[]::text[], NULL, 'UK', 'London', ARRAY['Independent', 'Documentary'], ARRAY['581361', '336211'], false, false, 'Indie film advocate', ARRAY['e2222222-2222-2222-2222-222222222222'], ARRAY['e4444444-4444-4444-4444-444444444444'], NOW(), NOW(), ARRAY['533991'], ARRAY['581361', '336211']),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'julia_junkie', true, 'English', ARRAY['Portuguese'], NULL, 'Brazil', 'São Paulo', ARRAY['Drama', 'Romance'], ARRAY['10757', '336211'], false, false, 'Romantic at heart ❤️', ARRAY['e2222222-2222-2222-2222-222222222222'], ARRAY['e4444444-4444-4444-4444-444444444444'], NOW(), NOW(), ARRAY['338065'], ARRAY['10757', '336211'])
ON CONFLICT ("userId") DO NOTHING;

-- ============================================
-- Local Events
-- ============================================
INSERT INTO "public"."local_event" (
  "id",
  "title",
  "time",
  "description",
  "genre",
  "cost",
  "occasion",
  "languages",
  "lat",
  "lon",
  "imageUrl"
) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Bollywood Film Festival 2025', NOW() + INTERVAL '30 days', 'Annual celebration of Indian cinema featuring classic and new releases', 'Drama', 15.00, 'Festival', ARRAY['Hindi', 'English'], 40.7128, -74.0060, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'),
  ('e2222222-2222-2222-2222-222222222222', 'Indie Film Night', NOW() + INTERVAL '7 days', 'Showcase of independent filmmakers from around the world', 'Independent', 10.00, 'Screening', ARRAY['English', 'Hindi'], 34.0522, -118.2437, 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800'),
  ('e3333333-3333-3333-3333-333333333333', 'Horror Movie Marathon', NOW() + INTERVAL '14 days', 'All-night horror classics including Stree and international hits', 'Horror', 20.00, 'Marathon', ARRAY['Hindi', 'English'], 41.8781, -87.6298, 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800'),
  ('e4444444-4444-4444-4444-444444444444', 'World Cinema Series', NOW() + INTERVAL '21 days', 'International cinema from Bollywood to Hollywood', 'Drama', 12.00, 'Series', ARRAY['Hindi', 'English', 'Korean'], 37.7749, -122.4194, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800'),
  ('e5555555-5555-5555-5555-555555555555', 'Comedy Night at the Park', NOW() + INTERVAL '5 days', 'Free outdoor comedy film screening featuring Khatta Meetha', 'Comedy', 0.00, 'Community', ARRAY['Hindi', 'English'], 40.7589, -73.9851, 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Event RSVPs
-- ============================================
INSERT INTO "public"."event_rsvp" (
  "id",
  "eventId",
  "userId",
  "status",
  "createdAt",
  "updatedAt"
) VALUES
  -- Bollywood Film Festival
  ('a1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'yes', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('a1111112-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'yes', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('a1111113-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'maybe', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('a1111114-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'yes', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('a1111115-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'yes', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('a1111116-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'yes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  -- Indie Film Night
  ('a2222221-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'yes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('a2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 'yes', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('a2222223-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'yes', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  ('a2222224-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'maybe', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
  -- Horror Movie Marathon
  ('a3333331-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'yes', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
  ('a3333332-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'no', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('a3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'yes', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours'),
  ('a3333334-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'yes', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
  ('a3333335-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'yes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  -- World Cinema Series
  ('a4444441-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'yes', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  ('a4444442-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'yes', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
  ('a4444443-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'yes', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
  -- Comedy Night at the Park
  ('a5555551-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'yes', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
  ('a5555552-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'yes', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  ('a5555553-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'yes', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  ('a5555554-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'maybe', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Posts (Using TMDB Movie IDs)
-- Movie IDs used:
--   10757  = Kabhi Khushi Kabhie Gham (K3G)
--   85985  = Ek Tha Tiger
--   338065 = Dil Dhadakne Do
--   533991 = Stree
--   336211 = Tanu Weds Manu Returns
--   581361 = Badla
--   570910 = Thackeray
--   46622  = Khatta Meetha
-- ============================================
INSERT INTO "public"."Post" (
  "id",
  "userId",
  "movieId",
  "content",
  "type",
  "stars",
  "spoiler",
  "tags",
  "createdAt",
  "imageUrls",
  "repostedPostId"
) VALUES
  -- SHORT posts (casual thoughts)
  ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '10757', 'K3G is the ultimate family drama. Never gets old! 🎬', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '2 days', '{}', NULL),
  ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '85985', 'Ek Tha Tiger is peak Salman Khan action 🐯', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '1 day', '{}', NULL),
  ('p3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '338065', 'Dil Dhadakne Do - the family dynamics are so relatable!', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '3 hours', '{}', NULL),
  ('p4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '533991', 'Stree is genuinely scary AND funny. Perfect horror-comedy 👻', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '5 hours', '{}', NULL),
  ('p5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '336211', 'Tanu Weds Manu Returns is even better than the first!', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '4 hours', '{}', NULL),
  ('p6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '581361', 'Badla has the best twist ending in recent Bollywood thrillers 🤯', 'SHORT', NULL, true, '{}', NOW() - INTERVAL '6 hours', '{}', NULL),
  ('p7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '570910', 'Thackeray - powerful biopic, Nawazuddin killed it!', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '8 hours', '{}', NULL),
  ('p8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '46622', 'Khatta Meetha is underrated Akshay Kumar comedy gold 😂', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '10 hours', '{}', NULL),
  
  -- LONG posts (reviews with ratings)
  ('p9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', '10757', 'Kabhi Khushi Kabhie Gham is Karan Johar''s magnum opus. The way he weaves together family values, love, and sacrifice is masterful. SRK, Amitabh, Kajol - everyone is at their peak. The music by Jatin-Lalit and Sandesh Shandilya is timeless. This film defined a generation of NRI cinema.', 'LONG', 10, false, ARRAY['family', 'drama', 'classic'], NOW() - INTERVAL '3 days', '{}', NULL),
  ('paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '85985', 'Ek Tha Tiger brought a new level of action to Bollywood. Salman Khan as a RAW agent was convincing, and Katrina Kaif matched his energy. The locations, the stunts, the music - everything came together perfectly. Tiger became an iconic franchise for a reason.', 'LONG', 9, false, ARRAY['action', 'spy', 'thriller'], NOW() - INTERVAL '4 days', '{}', NULL),
  ('pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '338065', 'Dil Dhadakne Do is Zoya Akhtar''s most underrated film. The ensemble cast delivers perfectly - Anil Kapoor, Priyanka Chopra, Ranveer Singh, Anushka Sharma. The way it explores Indian upper-class family dynamics on a cruise is both entertaining and thought-provoking.', 'LONG', 9, false, ARRAY['family', 'drama', 'comedy'], NOW() - INTERVAL '5 days', '{}', NULL),
  ('pcccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '533991', 'Stree revolutionized the horror-comedy genre in Bollywood. Rajkummar Rao and Shraddha Kapoor are excellent, but Pankaj Tripathi steals every scene. The "O Stree Kal Aana" folklore element adds authentic desi horror vibes. Genuinely creepy AND hilarious!', 'LONG', 10, false, ARRAY['horror', 'comedy', 'folklore'], NOW() - INTERVAL '6 days', '{}', NULL),
  ('pdddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', '336211', 'Tanu Weds Manu Returns proves sequels can be better than originals. Kangana Ranaut playing dual roles is phenomenal - both Tanu and Datto are memorable. R. Madhavan''s comic timing is impeccable. The chemistry, the dialogues, the music - chef''s kiss!', 'LONG', 10, false, ARRAY['comedy', 'romance', 'sequel'], NOW() - INTERVAL '7 days', '{}', NULL),
  ('peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', '581361', 'Badla is a tightly-wound thriller that keeps you guessing. Amitabh Bachchan and Taapsee Pannu engage in a battle of wits that''s riveting from start to finish. Sujoy Ghosh knows how to craft a mystery. The ending revelation is genuinely surprising.', 'LONG', 9, true, ARRAY['thriller', 'mystery', 'suspense'], NOW() - INTERVAL '8 days', '{}', NULL),
  ('pffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', '570910', 'Thackeray is Nawazuddin Siddiqui''s tour de force. He completely transforms into Bal Thackeray - the mannerisms, the speech, the presence. Whether you agree with the politics or not, the performance is undeniably powerful. A bold biopic.', 'LONG', 8, false, ARRAY['biopic', 'political', 'drama'], NOW() - INTERVAL '9 days', '{}', NULL),
  ('pgggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', '46622', 'Khatta Meetha is Priyadarshan at his comedic best. Akshay Kumar as the hapless contractor dealing with corruption is hilarious. The supporting cast including Johnny Lever adds layers of comedy. Pure entertainer with a social message!', 'LONG', 8, false, ARRAY['comedy', 'satire', 'entertainment'], NOW() - INTERVAL '10 days', '{}', NULL),
  
  -- Posts with images
  ('phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', '10757', 'My K3G poster collection! 📸', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '12 hours', ARRAY['https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'], NULL),
  ('piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', '533991', 'Stree screening setup for tonight! 👻🎬', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '2 hours', ARRAY['https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800'], NULL),
  ('pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', '338065', 'The cruise scenes in DDD are gorgeous 🚢', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '14 hours', ARRAY['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'], NULL),
  
  -- Reposts
  ('pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10757', 'This! K3G forever ❤️', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '1 day', '{}', 'p1111111-1111-1111-1111-111111111111'),
  ('plllllll-llll-llll-llll-llllllllllll', '11111111-1111-1111-1111-111111111111', '533991', 'Sharing this excellent Stree review!', 'SHORT', NULL, false, '{}', NOW() - INTERVAL '5 days', '{}', 'pcccccc-cccc-cccc-cccc-cccccccccccc')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Post Reactions
-- ============================================
INSERT INTO "public"."PostReaction" (
  "id",
  "postId",
  "userId",
  "reactionType",
  "createdAt"
) VALUES
  -- K3G post reactions
  ('l0000001-0001-0001-0001-000000000001', 'p1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000002', 'p1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000003', 'p1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000004', 'p1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000005', 'p1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '1 day'),
  
  -- Ek Tha Tiger reactions
  ('l0000002-0002-0002-0002-000000000001', 'p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '20 hours'),
  ('l0000002-0002-0002-0002-000000000002', 'p2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '20 hours'),
  ('l0000002-0002-0002-0002-000000000003', 'p2222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '20 hours'),
  
  -- Stree post reactions (popular)
  ('l0000004-0004-0004-0004-000000000001', 'p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '4 hours'),
  ('l0000004-0004-0004-0004-000000000002', 'p4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l0000004-0004-0004-0004-000000000003', 'p4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'BLOCKBUSTER', NOW() - INTERVAL '4 hours'),
  ('l0000004-0004-0004-0004-000000000004', 'p4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '4 hours'),
  ('l0000004-0004-0004-0004-000000000005', 'p4444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l0000004-0004-0004-0004-000000000006', 'p4444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '4 hours'),
  ('l0000004-0004-0004-0004-000000000007', 'p4444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'SPICY', NOW() - INTERVAL '4 hours'),
  
  -- Badla spoiler post reactions
  ('l0000006-0006-0006-0006-000000000001', 'p6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '5 hours'),
  ('l0000006-0006-0006-0006-000000000002', 'p6666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 hours'),
  
  -- LONG review reactions (K3G review - very popular)
  ('l0000009-0009-0009-0009-000000000001', 'p9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'THOUGHT_PROVOKING', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000002', 'p9999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000003', 'p9999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'BLOCKBUSTER', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000004', 'p9999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000005', 'p9999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', 'STAR_STUDDED', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000006', 'p9999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000007', 'p9999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', 'THOUGHT_PROVOKING', NOW() - INTERVAL '2 days'),
  ('l0000009-0009-0009-0009-000000000008', 'p9999999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888888', 'STAR_STUDDED', NOW() - INTERVAL '2 days'),
  
  -- Stree review reactions
  ('l000000c-000c-000c-000c-000000000001', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000002', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000003', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000004', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000005', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000006', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000007', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'SPICY', NOW() - INTERVAL '5 days'),
  ('l000000c-000c-000c-000c-000000000008', 'pcccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '5 days'),
  
  -- Picture post reactions
  ('l000000h-000h-000h-000h-000000000001', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-111111111111', 'STAR_STUDDED', NOW() - INTERVAL '11 hours'),
  ('l000000h-000h-000h-000h-000000000002', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '11 hours'),
  ('l000000h-000h-000h-000h-000000000003', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '11 hours'),
  
  ('l000000i-000i-000i-000i-000000000001', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '1 hour'),
  ('l000000i-000i-000i-000i-000000000002', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '1 hour'),
  ('l000000i-000i-000i-000i-000000000003', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '1 hour'),
  ('l000000i-000i-000i-000i-000000000004', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '77777777-7777-7777-7777-777777777777', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 hour')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- User Follows
-- ============================================
INSERT INTO "public"."UserFollow" (
  "id",
  "followerId",
  "followingId"
) VALUES
  ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('f3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('f4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
  ('f5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('f6666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555'),
  ('f7777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222'),
  ('f8888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666'),
  ('f9999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777'),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888'),
  ('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999'),
  ('fcccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('fdddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('feeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888'),
  ('fffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Comments
-- ============================================
INSERT INTO "public"."Comment" (
  "id",
  "userId",
  "postId",
  "content",
  "createdAt"
) VALUES
  -- Comments on K3G post
  ('c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', 'SRK and Amitabh''s confrontation scenes are legendary!', NOW() - INTERVAL '1 day'),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', 'The Bole Chudiyan song is still iconic 💃', NOW() - INTERVAL '1 day'),
  ('c3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p1111111-1111-1111-1111-111111111111', 'This movie made me cry every time 😭', NOW() - INTERVAL '20 hours'),
  
  -- Comments on Ek Tha Tiger post
  ('c4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'p2222222-2222-2222-2222-222222222222', 'The Dublin fight scene is insane!', NOW() - INTERVAL '20 hours'),
  ('c5555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'p2222222-2222-2222-2222-222222222222', 'Katrina was amazing in this!', NOW() - INTERVAL '18 hours'),
  
  -- Comments on Dil Dhadakne Do post
  ('c6666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'p3333333-3333-3333-3333-333333333333', 'The dog narrating the story is genius 🐕', NOW() - INTERVAL '2 hours'),
  ('c7777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', 'p3333333-3333-3333-3333-333333333333', 'Ranveer and Priyanka chemistry is fire!', NOW() - INTERVAL '2 hours'),
  
  -- Comments on Stree post
  ('c8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 'O Stree Kal Aana! 👻', NOW() - INTERVAL '4 hours'),
  ('c9999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'p4444444-4444-4444-4444-444444444444', 'Pankaj Tripathi as Rudra Bhaiya is perfect casting', NOW() - INTERVAL '3 hours'),
  ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'p4444444-4444-4444-4444-444444444444', 'Can''t wait for Stree 2!', NOW() - INTERVAL '3 hours'),
  
  -- Comments on Tanu Weds Manu Returns
  ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'p5555555-5555-5555-5555-555555555555', 'Kangana playing Datto is hilarious!', NOW() - INTERVAL '3 hours'),
  ('ccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'p5555555-5555-5555-5555-555555555555', 'The Haryanvi accent is on point', NOW() - INTERVAL '3 hours'),
  
  -- Comments on Badla post (spoiler discussion)
  ('cdddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'p6666666-6666-6666-6666-666666666666', 'That final reveal blew my mind!', NOW() - INTERVAL '5 hours'),
  
  -- Comments on LONG K3G review
  ('ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'p9999999-9999-9999-9999-999999999999', 'Great analysis! K3G defined an era', NOW() - INTERVAL '2 days'),
  ('cfffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'p9999999-9999-9999-9999-999999999999', 'The music still gives me goosebumps', NOW() - INTERVAL '2 days'),
  ('cgggggg-gggg-gggg-gggg-gggggggggggg', '33333333-3333-3333-3333-333333333333', 'p9999999-9999-9999-9999-999999999999', 'Kareena''s Poo is iconic forever 💅', NOW() - INTERVAL '2 days'),
  ('chhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '44444444-4444-4444-4444-444444444444', 'p9999999-9999-9999-9999-999999999999', 'NRI cinema at its finest', NOW() - INTERVAL '2 days'),
  
  -- Comments on Stree review
  ('ciiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '11111111-1111-1111-1111-111111111111', 'pcccccc-cccc-cccc-cccc-cccccccccccc', 'Perfect review! Captures why this film works so well', NOW() - INTERVAL '5 days'),
  ('cjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '55555555-5555-5555-5555-555555555555', 'pcccccc-cccc-cccc-cccc-cccccccccccc', 'The folklore element makes it uniquely Indian horror', NOW() - INTERVAL '5 days'),
  ('ckkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '77777777-7777-7777-7777-777777777777', 'pcccccc-cccc-cccc-cccc-cccccccccccc', 'Rajkummar Rao is a national treasure', NOW() - INTERVAL '4 days'),
  
  -- Comments on picture posts
  ('clllllll-llll-llll-llll-llllllllllll', '88888888-8888-8888-8888-888888888888', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Amazing collection! Where did you get these?', NOW() - INTERVAL '11 hours'),
  ('cmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '99999999-9999-9999-9999-999999999999', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'These are gorgeous! 😍', NOW() - INTERVAL '10 hours'),
  
  ('cnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '11111111-1111-1111-1111-111111111111', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Can I come over?! 👻🍿', NOW() - INTERVAL '1 hour'),
  ('cooooooo-oooo-oooo-oooo-oooooooooooo', '33333333-3333-3333-3333-333333333333', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Perfect setup for a horror night!', NOW() - INTERVAL '1 hour'),
  
  ('cpppppp-pppp-pppp-pppp-pppppppppppp', '22222222-2222-2222-2222-222222222222', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'The cinematography in DDD is chef''s kiss', NOW() - INTERVAL '13 hours'),
  ('cqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '55555555-5555-5555-5555-555555555555', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'I want to go on that cruise!', NOW() - INTERVAL '12 hours')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Seed data inserted successfully! Run npm run import:tmdb to populate movies.' as message;
