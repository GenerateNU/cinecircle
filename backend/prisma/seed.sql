-- Clear existing data (optional)
TRUNCATE TABLE "public"."PostReaction" CASCADE;
TRUNCATE TABLE "public"."Comment" CASCADE;
TRUNCATE TABLE "public"."Rating" CASCADE;
TRUNCATE TABLE "public"."Post" CASCADE;
TRUNCATE TABLE "public"."UserFollow" CASCADE;
TRUNCATE TABLE "public"."UserProfile" CASCADE;
TRUNCATE TABLE "public"."movie" CASCADE;
TRUNCATE TABLE "public"."local_event" CASCADE;

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

-- Insert UserProfiles
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
  "createdAt",
  "updatedAt"
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice_movie_fan', true, 'English', ARRAY['Spanish'], NULL, 'USA', 'New York', ARRAY['Drama', 'Thriller'], ARRAY['tt0111161', 'tt0068646'], NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'bob_cineaste', true, 'English', ARRAY['French'], NULL, 'USA', 'Los Angeles', ARRAY['Action', 'Sci-Fi'], ARRAY['tt0468569', 'tt0137523'], NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'charlie_critic', true, 'English', ARRAY[]::text[], NULL, 'Canada', 'Toronto', ARRAY['Comedy', 'Romance'], ARRAY['tt0109830', 'tt1375666'], NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'diana_director', true, 'English', ARRAY['Italian'], NULL, 'Italy', 'Rome', ARRAY['Drama', 'Biography'], ARRAY['tt0073486', 'tt0099685'], NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'evan_enthusiast', true, 'English', ARRAY['Japanese'], NULL, 'USA', 'San Francisco', ARRAY['Animation', 'Fantasy'], ARRAY['tt0245429', 'tt1853728'], NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'fiona_film_buff', true, 'English', ARRAY['German'], NULL, 'Germany', 'Berlin', ARRAY['Horror', 'Mystery'], ARRAY['tt0816692', 'tt0110912'], NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'george_genre_fan', true, 'English', ARRAY[]::text[], NULL, 'USA', 'Chicago', ARRAY['Western', 'Crime'], ARRAY['tt0076759', 'tt0050083'], NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'hannah_hollywood', true, 'English', ARRAY['Korean'], NULL, 'South Korea', 'Seoul', ARRAY['Drama', 'Thriller'], ARRAY['tt6751668', 'tt0167260'], NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'isaac_indie', true, 'English', ARRAY[]::text[], NULL, 'UK', 'London', ARRAY['Independent', 'Documentary'], ARRAY['tt0114369', 'tt0120737'], NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'julia_junkie', true, 'English', ARRAY['Portuguese'], NULL, 'Brazil', 'São Paulo', ARRAY['Drama', 'Romance'], ARRAY['tt0133093', 'tt0088763'], NOW(), NOW())
ON CONFLICT ("userId") DO NOTHING;

-- ============================================
-- Movies
-- ============================================
INSERT INTO "public"."movie" (
  "movieId",
  "title",
  "description",
  "localRating",
  "imdbRating",
  "languages",
  "numRatings",
  "imageUrl",
  "releaseYear",
  "director"
) VALUES
  ('tt0111161', 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years.', '9.2', 9300000, '["English"]', '120', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1994, 'Frank Darabont'),
  ('tt0068646', 'The Godfather', 'The aging patriarch of an organized crime dynasty transfers control.', '9.1', 9200000, '["English", "Italian"]', '98', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1972, 'Francis Ford Coppola'),
  ('tt0468569', 'The Dark Knight', 'Batman must accept one of the greatest psychological tests.', '8.9', 9000000, '["English"]', '145', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2008, 'Christopher Nolan'),
  ('tt0137523', 'Fight Club', 'An insomniac office worker forms an underground fight club.', '8.7', 8800000, '["English"]', '89', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1999, 'David Fincher'),
  ('tt0109830', 'Forrest Gump', 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.', '8.8', 8800000, '["English"]', '103', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1994, 'Robert Zemeckis'),
  ('tt1375666', 'Inception', 'A thief who steals corporate secrets through dream-sharing technology.', '8.7', 8800000, '["English", "French", "Japanese"]', '156', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2010, 'Christopher Nolan'),
  ('tt0073486', 'One Flew Over the Cuckoo''s Nest', 'A criminal pleads insanity and is admitted to a mental institution.', '8.6', 8700000, '["English"]', '67', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1975, 'Miloš Forman'),
  ('tt0099685', 'Goodfellas', 'The story of Henry Hill and his life in the mob.', '8.6', 8700000, '["English", "Italian"]', '78', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1990, 'Martin Scorsese'),
  ('tt0245429', 'Spirited Away', 'A young girl enters a world ruled by gods and witches.', '8.5', 8600000, '["Japanese"]', '92', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2001, 'Hayao Miyazaki'),
  ('tt1853728', 'Django Unchained', 'With the help of a German bounty hunter, a freed slave seeks revenge.', '8.4', 8500000, '["English"]', '85', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2012, 'Quentin Tarantino'),
  ('tt0816692', 'Interstellar', 'A team of explorers travel through a wormhole in space.', '8.6', 8700000, '["English"]', '134', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2014, 'Christopher Nolan'),
  ('tt0110912', 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine.', '8.8', 8900000, '["English"]', '156', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1994, 'Quentin Tarantino'),
  ('tt0076759', 'Star Wars', 'Luke Skywalker joins forces to save Princess Leia.', '8.5', 8600000, '["English"]', '167', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1977, 'George Lucas'),
  ('tt0050083', '12 Angry Men', 'A jury holdout attempts to prevent a miscarriage of justice.', '8.9', 9000000, '["English"]', '54', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1957, 'Sidney Lumet'),
  ('tt6751668', 'Parasite', 'Greed and class discrimination threaten the symbiotic relationship.', '8.5', 8600000, '["Korean"]', '98', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2019, 'Bong Joon-ho'),
  ('tt0167260', 'The Lord of the Rings: The Return of the King', 'Gandalf and Aragorn lead the World of Men against Sauron.', '8.9', 9000000, '["English"]', '189', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2003, 'Peter Jackson'),
  ('tt0114369', 'Se7en', 'Two detectives hunt a serial killer who uses the seven deadly sins.', '8.6', 8600000, '["English"]', '76', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1995, 'David Fincher'),
  ('tt0120737', 'The Lord of the Rings: The Fellowship of the Ring', 'A meek Hobbit sets out to destroy the One Ring.', '8.8', 8800000, '["English"]', '145', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 2001, 'Peter Jackson'),
  ('tt0133093', 'The Matrix', 'A computer hacker learns about the true nature of his reality.', '8.7', 8700000, '["English"]', '167', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1999, 'Lana Wachowski'),
  ('tt0088763', 'Back to the Future', 'Marty McFly is accidentally sent 30 years into the past.', '8.5', 8500000, '["English"]', '123', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg', 1985, 'Robert Zemeckis')
ON CONFLICT ("movieId") DO NOTHING;

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
  "lon"
) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Summer Film Festival 2024', NOW() + INTERVAL '30 days', 'Annual outdoor cinema featuring classic films', 'Drama', 15.00, 'Festival', ARRAY['English'], 40.7128, -74.0060),
  ('e2222222-2222-2222-2222-222222222222', 'Indie Film Night', NOW() + INTERVAL '7 days', 'Showcase of independent filmmakers', 'Independent', 10.00, 'Screening', ARRAY['English', 'Spanish'], 34.0522, -118.2437),
  ('e3333333-3333-3333-3333-333333333333', 'Horror Movie Marathon', NOW() + INTERVAL '14 days', 'All-night horror classics', 'Horror', 20.00, 'Marathon', ARRAY['English'], 41.8781, -87.6298),
  ('e4444444-4444-4444-4444-444444444444', 'Foreign Film Series', NOW() + INTERVAL '21 days', 'International cinema from around the world', 'Drama', 12.00, 'Series', ARRAY['French', 'Japanese', 'Korean'], 37.7749, -122.4194),
  ('e5555555-5555-5555-5555-555555555555', 'Comedy Night at the Park', NOW() + INTERVAL '5 days', 'Free outdoor comedy film screening', 'Comedy', 0.00, 'Community', ARRAY['English'], 40.7589, -73.9851)
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Posts
-- ============================================
INSERT INTO "public"."Post" (
  "id",
  "userId",
  "content",
  "type",
  "createdAt",
  "imageUrls",
  "parentPostId"
) VALUES
  -- Text posts
  ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Just watched Shawshank Redemption again. Never gets old! 🎬', 'SHORT', NOW() - INTERVAL '2 days', '{}', NULL),
  ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'The Dark Knight is a masterpiece of modern cinema. Christopher Nolan''s direction, Heath Ledger''s performance, and the moral complexity make it unforgettable.', 'LONG', NOW() - INTERVAL '5 days', '{}', NULL),
  ('p3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Anyone else think Inception is overrated?', 'SHORT', NOW() - INTERVAL '1 day', '{}', NULL),
  ('p4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Film analysis: The use of color grading in The Godfather to represent moral decay is absolutely brilliant. Each scene''s palette tells its own story.', 'LONG', NOW() - INTERVAL '7 days', '{}', NULL),
  ('p5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Spirited Away on the big screen tonight! Can''t wait! 🍿', 'SHORT', NOW() - INTERVAL '3 hours', '{}', NULL),
  ('p6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Just discovered the indie film scene. Why didn''t anyone tell me about this sooner?!', 'SHORT', NOW() - INTERVAL '12 hours', '{}', NULL),
  ('p7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Hot take: Fight Club aged poorly', 'SHORT', NOW() - INTERVAL '4 days', '{}', NULL),
  ('p8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Parasite winning Best Picture was a watershed moment for international cinema. It opened doors and changed perceptions about what mainstream audiences can appreciate.', 'LONG', NOW() - INTERVAL '10 days', '{}', NULL),
  ('p9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'Documentary recommendations anyone?', 'SHORT', NOW() - INTERVAL '6 hours', '{}', NULL),
  ('paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The Matrix revolutionized action choreography and visual effects. Its influence can still be seen in films today, 25 years later.', 'LONG', NOW() - INTERVAL '8 days', '{}', NULL),
  ('pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Going to the Summer Film Festival next month. Who''s in?', 'SHORT', NOW() - INTERVAL '1 hour', '{}', NULL),
  ('pcccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Rewatching LOTR trilogy this weekend. Epic! 🧙‍♂️', 'SHORT', NOW() - INTERVAL '2 hours', '{}', NULL),
  ('pdddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Pulp Fiction: nonlinear storytelling at its finest', 'SHORT', NOW() - INTERVAL '3 days', '{}', NULL),
  ('peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'The cinematography in Interstellar is breathtaking. IMAX made all the difference.', 'SHORT', NOW() - INTERVAL '6 days', '{}', NULL),
  ('pffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'Studio Ghibli marathon happening! Starting with Totoro 🌳', 'SHORT', NOW() - INTERVAL '4 hours', '{}', NULL),
  ('pgggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 'Se7en still holds up as one of the best thriller endings ever', 'SHORT', NOW() - INTERVAL '5 days', '{}', NULL),
  ('phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', 'Star Wars original trilogy > prequels > sequels. Fight me.', 'SHORT', NOW() - INTERVAL '8 hours', '{}', NULL),
  ('piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 'Back to the Future is the perfect time travel movie. Everything about it works.', 'SHORT', NOW() - INTERVAL '9 days', '{}', NULL),
  ('pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 'Film noir appreciation post: Double Indemnity, The Maltese Falcon, Touch of Evil. The shadows, the dialogue, the moral ambiguity - this genre defined cinema.', 'LONG', NOW() - INTERVAL '11 days', '{}', NULL),
  ('pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '12 Angry Men with just one room and phenomenal acting 👏', 'SHORT', NOW() - INTERVAL '5 hours', '{}', NULL),
  
  -- Picture posts with image URLs (some with multiple images for carousel)
  ('plllllll-llll-llll-llll-llllllllllll', '11111111-1111-1111-1111-111111111111', 'My home theater setup for movie night! 🎥', 'SHORT', NOW() - INTERVAL '10 hours', ARRAY['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800'], NULL),
  ('pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '22222222-2222-2222-2222-222222222222', 'Found this incredible vintage poster at the flea market today!', 'SHORT', NOW() - INTERVAL '15 hours', ARRAY['https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800'], NULL),
  ('pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '33333333-3333-3333-3333-333333333333', 'Cinema architecture is art 🎭', 'SHORT', NOW() - INTERVAL '1 day', ARRAY['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800'], NULL),
  ('pooooooo-oooo-oooo-oooo-oooooooooooo', '44444444-4444-4444-4444-444444444444', 'My growing Criterion Collection 📚', 'SHORT', NOW() - INTERVAL '2 days', ARRAY['https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800'], NULL),
  ('ppppppp-pppp-pppp-pppp-pppppppppppp', '55555555-5555-5555-5555-555555555555', 'Best seat in the house for tonight''s screening!', 'SHORT', NOW() - INTERVAL '30 minutes', ARRAY['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800'], NULL),
  
  -- Reply posts (threads)
  ('pqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '22222222-2222-2222-2222-222222222222', 'Totally agree! That scene gives me chills', 'SHORT', NOW() - INTERVAL '1 day', '{}', 'p1111111-1111-1111-1111-111111111111'),
  ('prrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '33333333-3333-3333-3333-333333333333', 'You clearly didn''t understand it then', 'SHORT', NOW() - INTERVAL '20 hours', '{}', 'p3333333-3333-3333-3333-333333333333'),
  ('pssssss-ssss-ssss-ssss-ssssssssssss', '44444444-4444-4444-4444-444444444444', 'Me! Been waiting for this all year', 'SHORT', NOW() - INTERVAL '45 minutes', '{}', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
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
  -- p1111111: 5 reactions (Shawshank - inspiring, emotional)
  ('l0000001-0001-0001-0001-000000000001', 'p1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000002', 'p1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000003', 'p1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000004', 'p1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 day'),
  ('l0000001-0001-0001-0001-000000000005', 'p1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '1 day'),
  
  -- p2222222: 12 reactions (Dark Knight - masterpiece, A-listers)
  ('l0000002-0002-0002-0002-000000000001', 'p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000002', 'p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000003', 'p2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000004', 'p2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000005', 'p2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000006', 'p2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000007', 'p2222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000008', 'p2222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 'BLOCKBUSTER', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000009', 'p2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000010', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000011', 'p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l0000002-0002-0002-0002-000000000012', 'p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 days'),
  
  -- p4444444: 23 reactions (Film analysis - thought-provoking)
  ('l0000004-0004-0004-0004-000000000001', 'p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000002', 'p4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000003', 'p4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000004', 'p4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000005', 'p4444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000006', 'p4444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'SPICY', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000007', 'p4444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000008', 'p4444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000009', 'p4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  ('l0000004-0004-0004-0004-000000000010', 'p4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '6 days'),
  
  -- p5555555: 8 reactions (Spirited Away - magical)
  ('l0000005-0005-0005-0005-000000000001', 'p5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'STAR_STUDDED', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000002', 'p5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000003', 'p5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'SPICY', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000004', 'p5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'STAR_STUDDED', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000005', 'p5555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000006', 'p5555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'SPICY', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000007', 'p5555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 'STAR_STUDDED', NOW() - INTERVAL '2 hours'),
  ('l0000005-0005-0005-0005-000000000008', 'p5555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 'THOUGHT_PROVOKING', NOW() - INTERVAL '2 hours'),
  
  -- p6666666: 4 reactions (indie film discovery - spicy/bold)
  ('l0000006-0006-0006-0006-000000000001', 'p6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '11 hours'),
  ('l0000006-0006-0006-0006-000000000002', 'p6666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '11 hours'),
  ('l0000006-0006-0006-0006-000000000003', 'p6666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'THOUGHT_PROVOKING', NOW() - INTERVAL '11 hours'),
  ('l0000006-0006-0006-0006-000000000004', 'p6666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '11 hours'),
  
  -- p8888888: 34 reactions (Parasite - watershed moment, blockbuster)
  ('l0000008-0008-0008-0008-000000000001', 'p8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000002', 'p8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000003', 'p8888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000004', 'p8888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'SPICY', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000005', 'p8888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000006', 'p8888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000007', 'p8888888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000008', 'p8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'STAR_STUDDED', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000009', 'p8888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', 'THOUGHT_PROVOKING', NOW() - INTERVAL '9 days'),
  ('l0000008-0008-0008-0008-000000000010', 'p8888888-8888-8888-8888-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '9 days'),
  
  -- p9999999: 7 reactions (Documentary recommendations)
  ('l0000009-0009-0009-0009-000000000001', 'p9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 hours'),
  ('l0000009-0009-0009-0009-000000000002', 'p9999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 hours'),
  ('l0000009-0009-0009-0009-000000000003', 'p9999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'SPICY', NOW() - INTERVAL '5 hours'),
  ('l0000009-0009-0009-0009-000000000004', 'p9999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 hours'),
  ('l0000009-0009-0009-0009-000000000005', 'p9999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', 'STAR_STUDDED', NOW() - INTERVAL '5 hours'),
  ('l0000009-0009-0009-0009-000000000006', 'p9999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 hours'),
  ('l0000009-0009-0009-0009-000000000007', 'p9999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '5 hours'),
  
  -- paaaaaaa: 19 reactions (Matrix - revolutionary, blockbuster)
  ('l000000a-000a-000a-000a-000000000001', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000002', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000003', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'BLOCKBUSTER', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000004', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'STAR_STUDDED', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000005', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000006', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000007', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', 'SPICY', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000008', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000009', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '7 days'),
  ('l000000a-000a-000a-000a-000000000010', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STAR_STUDDED', NOW() - INTERVAL '7 days'),
  
  -- pbbbbbb: 10 reactions (Film festival event invite)
  ('l000000b-000b-000b-000b-000000000001', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'SPICY', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000002', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'BLOCKBUSTER', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000003', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'STAR_STUDDED', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000004', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000005', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000006', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 'THOUGHT_PROVOKING', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000007', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'SPICY', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000008', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '99999999-9999-9999-9999-999999999999', 'STAR_STUDDED', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000009', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '30 minutes'),
  ('l000000b-000b-000b-000b-000000000010', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '30 minutes'),
  
  -- pcccccc: 15 reactions (LOTR trilogy marathon - epic, star-studded)
  ('l000000c-000c-000c-000c-000000000001', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000002', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000003', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000004', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 'STAR_STUDDED', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000005', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000006', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777', 'SPICY', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000007', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', 'STAR_STUDDED', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000008', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000009', 'pcccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 hour'),
  ('l000000c-000c-000c-000c-000000000010', 'pcccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '1 hour'),
  
  -- Picture posts
  -- plllllll: 18 reactions (Home theater setup)
  ('l000000l-000l-000l-000l-000000000001', 'plllllll-llll-llll-llll-llllllllllll', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000002', 'plllllll-llll-llll-llll-llllllllllll', '33333333-3333-3333-3333-333333333333', 'SPICY', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000003', 'plllllll-llll-llll-llll-llllllllllll', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000004', 'plllllll-llll-llll-llll-llllllllllll', '55555555-5555-5555-5555-555555555555', 'STAR_STUDDED', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000005', 'plllllll-llll-llll-llll-llllllllllll', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000006', 'plllllll-llll-llll-llll-llllllllllll', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000007', 'plllllll-llll-llll-llll-llllllllllll', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000008', 'plllllll-llll-llll-llll-llllllllllll', '99999999-9999-9999-9999-999999999999', 'STAR_STUDDED', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000009', 'plllllll-llll-llll-llll-llllllllllll', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '9 hours'),
  ('l000000l-000l-000l-000l-000000000010', 'plllllll-llll-llll-llll-llllllllllll', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '9 hours'),
  
  -- pmmmmmmm: 22 reactions (Vintage poster find)
  ('l000000m-000m-000m-000m-000000000001', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000002', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000003', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000004', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000005', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000006', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000007', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '88888888-8888-8888-8888-888888888888', 'SPICY', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000008', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000009', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'THOUGHT_PROVOKING', NOW() - INTERVAL '14 hours'),
  ('l000000m-000m-000m-000m-000000000010', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '14 hours'),

  -- p3333333: 2 reactions (Inception overrated - controversial/spicy)
  ('l0000003-0003-0003-0003-000000000001', 'p3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '23 hours'),
  ('l0000003-0003-0003-0003-000000000002', 'p3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '23 hours'),

  -- p7777777: 3 reactions (Fight Club aged poorly - controversial)
  ('l0000007-0007-0007-0007-000000000001', 'p7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '3 days'),
  ('l0000007-0007-0007-0007-000000000002', 'p7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'SPICY', NOW() - INTERVAL '3 days'),
  ('l0000007-0007-0007-0007-000000000003', 'p7777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '3 days'),

  -- pdddddd: 9 reactions (Pulp Fiction - stylish, blockbuster)
  ('l000000d-000d-000d-000d-000000000001', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000002', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000003', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000004', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000005', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000006', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000007', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000008', 'pdddddd-dddd-dddd-dddd-dddddddddddd', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '2 days'),
  ('l000000d-000d-000d-000d-000000000009', 'pdddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SPICY', NOW() - INTERVAL '2 days'),

  -- peeeeee: 17 reactions (Interstellar cinematography - visually stunning)
  ('l000000e-000e-000e-000e-000000000001', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'STAR_STUDDED', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000002', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000003', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000004', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'STAR_STUDDED', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000005', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000006', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000007', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000008', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '88888888-8888-8888-8888-888888888888', 'BLOCKBUSTER', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000009', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '99999999-9999-9999-9999-999999999999', 'THOUGHT_PROVOKING', NOW() - INTERVAL '5 days'),
  ('l000000e-000e-000e-000e-000000000010', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STAR_STUDDED', NOW() - INTERVAL '5 days'),

  -- pffffff: 6 reactions (Studio Ghibli marathon)
  ('l000000f-000f-000f-000f-000000000001', 'pffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'STAR_STUDDED', NOW() - INTERVAL '3 hours'),
  ('l000000f-000f-000f-000f-000000000002', 'pffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'SPICY', NOW() - INTERVAL '3 hours'),
  ('l000000f-000f-000f-000f-000000000003', 'pffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'BLOCKBUSTER', NOW() - INTERVAL '3 hours'),
  ('l000000f-000f-000f-000f-000000000004', 'pffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', 'STAR_STUDDED', NOW() - INTERVAL '3 hours'),
  ('l000000f-000f-000f-000f-000000000005', 'pffffff-ffff-ffff-ffff-ffffffffffff', '77777777-7777-7777-7777-777777777777', 'THOUGHT_PROVOKING', NOW() - INTERVAL '3 hours'),
  ('l000000f-000f-000f-000f-000000000006', 'pffffff-ffff-ffff-ffff-ffffffffffff', '88888888-8888-8888-8888-888888888888', 'BLOCKBUSTER', NOW() - INTERVAL '3 hours'),

  -- pgggggg: 13 reactions (Se7en thriller)
  ('l000000g-000g-000g-000g-000000000001', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000002', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000003', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '33333333-3333-3333-3333-333333333333', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000004', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '44444444-4444-4444-4444-444444444444', 'BLOCKBUSTER', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000005', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000006', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000007', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000008', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000009', 'pgggggg-gggg-gggg-gggg-gggggggggggg', '99999999-9999-9999-9999-999999999999', 'SPICY', NOW() - INTERVAL '4 days'),
  ('l000000g-000g-000g-000g-000000000010', 'pgggggg-gggg-gggg-gggg-gggggggggggg', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '4 days'),

  -- phhhhh: 2 reactions (Star Wars debate - spicy hot take)
  ('l000000h-000h-000h-000h-000000000001', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '7 hours'),
  ('l000000h-000h-000h-000h-000000000002', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '88888888-8888-8888-8888-888888888888', 'BLOCKBUSTER', NOW() - INTERVAL '7 hours'),

  -- piiiiii: 21 reactions (Back to the Future - blockbuster)
  ('l000000i-000i-000i-000i-000000000001', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '11111111-1111-1111-1111-111111111111', 'BLOCKBUSTER', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000002', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000003', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '33333333-3333-3333-3333-333333333333', 'BLOCKBUSTER', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000004', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000005', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000006', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '66666666-6666-6666-6666-666666666666', 'STAR_STUDDED', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000007', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000008', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 'SPICY', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000009', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '8 days'),
  ('l000000i-000i-000i-000i-000000000010', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STAR_STUDDED', NOW() - INTERVAL '8 days'),

  -- pjjjjjj: 14 reactions (Film noir - thought-provoking)
  ('l000000j-000j-000j-000j-000000000001', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '11111111-1111-1111-1111-111111111111', 'THOUGHT_PROVOKING', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000002', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '22222222-2222-2222-2222-222222222222', 'THOUGHT_PROVOKING', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000003', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000004', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000005', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000006', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '66666666-6666-6666-6666-666666666666', 'THOUGHT_PROVOKING', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000007', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000008', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000009', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 'BLOCKBUSTER', NOW() - INTERVAL '10 days'),
  ('l000000j-000j-000j-000j-000000000010', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'THOUGHT_PROVOKING', NOW() - INTERVAL '10 days'),

  -- pkkkkkk: 10 reactions (12 Angry Men - thought-provoking)
  ('l000000k-000k-000k-000k-000000000001', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '11111111-1111-1111-1111-111111111111', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000002', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '22222222-2222-2222-2222-222222222222', 'STAR_STUDDED', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000003', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '33333333-3333-3333-3333-333333333333', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000004', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000005', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000006', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000007', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '77777777-7777-7777-7777-777777777777', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000008', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '88888888-8888-8888-8888-888888888888', 'STAR_STUDDED', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000009', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '99999999-9999-9999-9999-999999999999', 'THOUGHT_PROVOKING', NOW() - INTERVAL '4 hours'),
  ('l000000k-000k-000k-000k-000000000010', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '4 hours'),

  -- pnnnnnnn: 14 reactions (Cinema architecture - star-studded aesthetic)
  ('l000000n-000n-000n-000n-000000000001', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '11111111-1111-1111-1111-111111111111', 'STAR_STUDDED', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000002', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '22222222-2222-2222-2222-222222222222', 'SPICY', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000003', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '44444444-4444-4444-4444-444444444444', 'STAR_STUDDED', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000004', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '55555555-5555-5555-5555-555555555555', 'THOUGHT_PROVOKING', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000005', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '66666666-6666-6666-6666-666666666666', 'STAR_STUDDED', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000006', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '77777777-7777-7777-7777-777777777777', 'BLOCKBUSTER', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000007', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '88888888-8888-8888-8888-888888888888', 'STAR_STUDDED', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000008', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '99999999-9999-9999-9999-999999999999', 'THOUGHT_PROVOKING', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000009', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SPICY', NOW() - INTERVAL '23 hours'),
  ('l000000n-000n-000n-000n-000000000010', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '23 hours'),

  -- pooooooo: 25 reactions (Criterion Collection - star-studded)
  ('l000000o-000o-000o-000o-000000000001', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '11111111-1111-1111-1111-111111111111', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000002', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000003', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000004', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '44444444-4444-4444-4444-444444444444', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000005', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '55555555-5555-5555-5555-555555555555', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000006', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000007', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000008', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '88888888-8888-8888-8888-888888888888', 'THOUGHT_PROVOKING', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000009', 'pooooooo-oooo-oooo-oooo-oooooooooooo', '99999999-9999-9999-9999-999999999999', 'STAR_STUDDED', NOW() - INTERVAL '1 day'),
  ('l000000o-000o-000o-000o-000000000010', 'pooooooo-oooo-oooo-oooo-oooooooooooo', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '1 day'),

  -- ppppppp: 16 reactions (Best seat screening - spicy/exciting)
  ('l000000p-000p-000p-000p-000000000001', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000002', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000003', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000004', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '44444444-4444-4444-4444-444444444444', 'SPICY', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000005', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000006', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '66666666-6666-6666-6666-666666666666', 'SPICY', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000007', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '77777777-7777-7777-7777-777777777777', 'STAR_STUDDED', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000008', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '88888888-8888-8888-8888-888888888888', 'BLOCKBUSTER', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000009', 'ppppppp-pppp-pppp-pppp-pppppppppppp', '99999999-9999-9999-9999-999999999999', 'SPICY', NOW() - INTERVAL '20 minutes'),
  ('l000000p-000p-000p-000p-000000000010', 'ppppppp-pppp-pppp-pppp-pppppppppppp', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BLOCKBUSTER', NOW() - INTERVAL '20 minutes'),

  -- Reply posts
  -- pqqqqqqq: 3 reactions (Reply about Shawshank)
  ('l000000q-000q-000q-000q-000000000001', 'pqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '33333333-3333-3333-3333-333333333333', 'THOUGHT_PROVOKING', NOW() - INTERVAL '23 hours'),
  ('l000000q-000q-000q-000q-000000000002', 'pqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '44444444-4444-4444-4444-444444444444', 'SPICY', NOW() - INTERVAL '23 hours'),
  ('l000000q-000q-000q-000q-000000000003', 'pqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '55555555-5555-5555-5555-555555555555', 'BLOCKBUSTER', NOW() - INTERVAL '23 hours'),

  -- prrrrrr: 1 reaction (Snarky reply about Inception)
  ('l000000r-000r-000r-000r-000000000001', 'prrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '44444444-4444-4444-4444-444444444444', 'SPICY', NOW() - INTERVAL '19 hours'),

  -- pssssss: 5 reactions (Reply about festival)
  ('l000000s-000s-000s-000s-000000000001', 'pssssss-ssss-ssss-ssss-ssssssssssss', '11111111-1111-1111-1111-111111111111', 'SPICY', NOW() - INTERVAL '40 minutes'),
  ('l000000s-000s-000s-000s-000000000002', 'pssssss-ssss-ssss-ssss-ssssssssssss', '22222222-2222-2222-2222-222222222222', 'BLOCKBUSTER', NOW() - INTERVAL '40 minutes'),
  ('l000000s-000s-000s-000s-000000000003', 'pssssss-ssss-ssss-ssss-ssssssssssss', '33333333-3333-3333-3333-333333333333', 'STAR_STUDDED', NOW() - INTERVAL '40 minutes'),
  ('l000000s-000s-000s-000s-000000000004', 'pssssss-ssss-ssss-ssss-ssssssssssss', '55555555-5555-5555-5555-555555555555', 'SPICY', NOW() - INTERVAL '40 minutes'),
  ('l000000s-000s-000s-000s-000000000005', 'pssssss-ssss-ssss-ssss-ssssssssssss', '66666666-6666-6666-6666-666666666666', 'BLOCKBUSTER', NOW() - INTERVAL '40 minutes')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Ratings
-- ============================================
INSERT INTO "public"."Rating" (
  "id",
  "userId",
  "movieId",
  "stars",
  "comment",
  "tags",
  "date"
) VALUES
  ('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'tt0111161', 5, 'Absolute masterpiece. Tim Robbins and Morgan Freeman are perfect.', ARRAY['inspirational', 'emotional'], NOW() - INTERVAL '10 days'),
  ('r2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'tt0468569', 5, 'Heath Ledger''s Joker is iconic. Best superhero movie ever made.', ARRAY['dark', 'intense', 'action-packed'], NOW() - INTERVAL '8 days'),
  ('r3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'tt1375666', 4, 'Mind-bending but sometimes confusing. Still worth multiple watches.', ARRAY['complex', 'visually-stunning'], NOW() - INTERVAL '5 days'),
  ('r4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'tt0068646', 5, 'The definitive gangster film. Brando''s performance is legendary.', ARRAY['classic', 'violent', 'epic'], NOW() - INTERVAL '15 days'),
  ('r5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'tt0245429', 5, 'Miyazaki''s imagination knows no bounds. Beautiful and touching.', ARRAY['magical', 'heartwarming', 'animated'], NOW() - INTERVAL '3 days'),
  ('r6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'tt0114369', 5, 'Fincher at his best. Dark, twisted, unforgettable ending.', ARRAY['dark', 'psychological', 'thriller'], NOW() - INTERVAL '12 days'),
  ('r7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'tt0076759', 5, 'Changed cinema forever. A true cultural phenomenon.', ARRAY['sci-fi', 'adventure', 'iconic'], NOW() - INTERVAL '20 days'),
  ('r8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'tt6751668', 5, 'Brilliant social commentary. Every scene is meticulously crafted.', ARRAY['thought-provoking', 'tense', 'satirical'], NOW() - INTERVAL '7 days'),
  ('r9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'tt0110912', 5, 'Tarantino''s best work. Dialogue is sharp, structure is perfect.', ARRAY['stylish', 'violent', 'quotable'], NOW() - INTERVAL '18 days'),
  ('raaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tt0133093', 5, 'Revolutionary special effects. The philosophical questions still resonate.', ARRAY['philosophical', 'action', 'groundbreaking'], NOW() - INTERVAL '6 days'),
  ('rbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'tt0109830', 5, 'Tom Hanks gives the performance of a lifetime. Emotional journey.', ARRAY['heartwarming', 'emotional', 'inspiring'], NOW() - INTERVAL '14 days'),
  ('rcccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'tt0137523', 4, 'Thought-provoking critique of consumerism. Twist is great.', ARRAY['psychological', 'violent', 'subversive'], NOW() - INTERVAL '11 days'),
  ('rdddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'tt0816692', 5, 'Christopher Nolan''s most ambitious film. Visually spectacular.', ARRAY['epic', 'emotional', 'sci-fi'], NOW() - INTERVAL '4 days'),
  ('reeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'tt0099685', 5, 'Scorsese''s masterclass in storytelling. Ray Liotta is perfect.', ARRAY['gangster', 'violent', 'fast-paced'], NOW() - INTERVAL '16 days'),
  ('rfffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'tt1853728', 4, 'Tarantino''s revisionist Western. Entertaining but long.', ARRAY['western', 'violent', 'stylized'], NOW() - INTERVAL '9 days'),
  ('rgggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 'tt0073486', 5, 'Jack Nicholson''s best performance. Powerful and disturbing.', ARRAY['psychological', 'rebellious', 'classic'], NOW() - INTERVAL '13 days'),
  ('rhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', 'tt0167260', 5, 'The perfect conclusion to an epic trilogy. Extended edition is a must.', ARRAY['epic', 'fantasy', 'emotional'], NOW() - INTERVAL '22 days'),
  ('riiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 'tt0120737', 5, 'Peter Jackson brought Tolkien''s world to life perfectly.', ARRAY['adventure', 'fantasy', 'epic'], NOW() - INTERVAL '21 days'),
  ('rjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 'tt0088763', 5, 'The most fun time travel movie ever. Perfect blend of comedy and adventure.', ARRAY['fun', 'nostalgic', 'adventure'], NOW() - INTERVAL '17 days'),
  ('rkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tt0050083', 5, 'Timeless courtroom drama. All takes place in one room but riveting.', ARRAY['tense', 'dialogue-driven', 'classic'], NOW() - INTERVAL '19 days'),
  ('rllllll-llll-llll-llll-llllllllllll', '11111111-1111-1111-1111-111111111111', 'tt0068646', 5, 'An offer you can''t refuse. This film is perfection.', ARRAY['classic', 'family-saga'], NOW() - INTERVAL '25 days'),
  ('rmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '22222222-2222-2222-2222-222222222222', 'tt0111161', 5, 'Hope is a powerful thing. This movie proves it.', ARRAY['hopeful', 'friendship'], NOW() - INTERVAL '23 days'),
  ('rnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '33333333-3333-3333-3333-333333333333', 'tt0245429', 4, 'Beautiful animation but felt long at times.', ARRAY['animated', 'imaginative'], NOW() - INTERVAL '2 days'),
  ('rooooooo-oooo-oooo-oooo-oooooooooooo', '44444444-4444-4444-4444-444444444444', 'tt0137523', 5, 'His name was Robert Paulson. Unforgettable.', ARRAY['cult-classic', 'mind-bending'], NOW() - INTERVAL '26 days'),
  ('rpppppp-pppp-pppp-pppp-pppppppppppp', '55555555-5555-5555-5555-555555555555', 'tt0076759', 5, 'May the Force be with you. Always.', ARRAY['iconic', 'space-opera'], NOW() - INTERVAL '24 days'),
  ('rqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '66666666-6666-6666-6666-666666666666', 'tt0109830', 4, 'Life is like a box of chocolates... sweet but predictable at times.', ARRAY['feel-good', 'heartwarming'], NOW() - INTERVAL '27 days'),
  ('rrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '77777777-7777-7777-7777-777777777777', 'tt0110912', 5, 'English, do you speak it?! Iconic quotes galore.', ARRAY['quotable', 'violent'], NOW() - INTERVAL '28 days'),
  ('rsssssss-ssss-ssss-ssss-ssssssssssss', '88888888-8888-8888-8888-888888888888', 'tt0133093', 4, 'Take the red pill. Mind-blowing when it came out.', ARRAY['sci-fi', 'philosophical'], NOW() - INTERVAL '29 days'),
  ('rttttttt-tttt-tttt-tttt-tttttttttttt', '99999999-9999-9999-9999-999999999999', 'tt1375666', 5, 'We need to go deeper. Every layer is fascinating.', ARRAY['complex', 'thriller'], NOW() - INTERVAL '30 days'),
  ('ruuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tt6751668', 5, 'The stairs scene alone is worth the price of admission.', ARRAY['social-commentary', 'thriller'], NOW() - INTERVAL '31 days')
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
  "ratingId",
  "content",
  "createdAt"
) VALUES
  ('c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', NULL, 'Totally agree! One of the best films ever made.', NOW() - INTERVAL '1 day'),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', NULL, 'Morgan Freeman''s narration is iconic', NOW() - INTERVAL '1 day'),
  ('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'p2222222-2222-2222-2222-222222222222', NULL, 'Heath Ledger deserved that Oscar', NOW() - INTERVAL '4 days'),
  ('c4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'p3333333-3333-3333-3333-333333333333', NULL, 'Disagree! It''s a masterpiece', NOW() - INTERVAL '20 hours'),
  ('c5555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'p3333333-3333-3333-3333-333333333333', NULL, 'The ending alone makes it worth it', NOW() - INTERVAL '18 hours'),
  ('c6666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', 'p4444444-4444-4444-4444-444444444444', NULL, 'Great analysis! Never noticed that before', NOW() - INTERVAL '6 days'),
  ('c7777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', 'p5555555-5555-5555-5555-555555555555', NULL, 'Have fun! It''s magical on the big screen', NOW() - INTERVAL '2 hours'),
  ('c8888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', 'p8888888-8888-8888-8888-888888888888', NULL, 'Couldn''t agree more. Historic moment for cinema', NOW() - INTERVAL '9 days'),
  ('c9999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p9999999-9999-9999-9999-999999999999', NULL, 'Check out "13th" and "Won''t You Be My Neighbor"', NOW() - INTERVAL '5 hours'),
  ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'Count me in! 🎬', NOW() - INTERVAL '30 minutes'),
  ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', NULL, 'r1111111-1111-1111-1111-111111111111', 'The tunnel scene gives me chills every time', NOW() - INTERVAL '9 days'),
  ('ccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', NULL, 'r2222222-2222-2222-2222-222222222222', 'RIP Heath Ledger. Gone too soon.', NOW() - INTERVAL '7 days'),
  ('cdddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', NULL, 'r5555555-5555-5555-5555-555555555555', 'Studio Ghibli never misses', NOW() - INTERVAL '2 days'),
  ('ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', NULL, 'r8888888-8888-8888-8888-888888888888', 'The stairs metaphor is brilliant', NOW() - INTERVAL '6 days'),
  ('cfffffff-ffff-ffff-ffff-ffffffffffff', '66666666-6666-6666-6666-666666666666', NULL, 'r9999999-9999-9999-9999-999999999999', 'Royale with cheese 🍔', NOW() - INTERVAL '17 days'),
  ('cgggggg-gggg-gggg-gggg-gggggggggggg', '77777777-7777-7777-7777-777777777777', 'pcccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'Extended editions or theatrical?', NOW() - INTERVAL '1 hour'),
  ('chhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '88888888-8888-8888-8888-888888888888', 'phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', NULL, 'Original trilogy forever ⭐', NOW() - INTERVAL '7 hours'),
  ('ciiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '99999999-9999-9999-9999-999999999999', NULL, 'rhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'The Battle of Pelennor Fields is cinema at its finest', NOW() - INTERVAL '21 days'),
  ('cjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'rjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'Great Scott! This movie is perfect', NOW() - INTERVAL '16 days'),
  ('ckkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '11111111-1111-1111-1111-111111111111', 'piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', NULL, '1.21 gigawatts!', NOW() - INTERVAL '8 days'),
  ('clllllll-llll-llll-llll-llllllllllll', '22222222-2222-2222-2222-222222222222', 'pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NULL, 'Great picks! Also check out The Big Sleep', NOW() - INTERVAL '10 days'),
  ('cmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '33333333-3333-3333-3333-333333333333', NULL, 'raaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The Wachowskis were ahead of their time', NOW() - INTERVAL '5 days'),
  ('cnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '44444444-4444-4444-4444-444444444444', NULL, 'rdddddd-dddd-dddd-dddd-dddddddddddd', 'That docking scene with the music 🎵', NOW() - INTERVAL '3 days'),
  ('cooooooo-oooo-oooo-oooo-oooooooooooo', '55555555-5555-5555-5555-555555555555', 'pgggggg-gggg-gggg-gggg-gggggggggggg', NULL, 'What''s in the box?!', NOW() - INTERVAL '4 days'),
  ('cpppppp-pppp-pppp-pppp-pppppppppppp', '66666666-6666-6666-6666-666666666666', NULL, 'rllllll-llll-llll-llll-llllllllllll', 'Leave the gun, take the cannoli', NOW() - INTERVAL '24 days'),
  
  -- Additional comments for better coverage
  ('cqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '11111111-1111-1111-1111-111111111111', 'p6666666-6666-6666-6666-666666666666', NULL, 'Welcome to the indie world! So much hidden talent here', NOW() - INTERVAL '11 hours'),
  ('crrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '22222222-2222-2222-2222-222222222222', 'p6666666-6666-6666-6666-666666666666', NULL, 'Check out A24 films, they''re amazing!', NOW() - INTERVAL '10 hours'),
  ('cssssss-ssss-ssss-ssss-ssssssssssss', '33333333-3333-3333-3333-333333333333', 'p6666666-6666-6666-6666-666666666666', NULL, 'Indie films have the best storytelling', NOW() - INTERVAL '9 hours'),
  
  ('cttttttt-tttt-tttt-tttt-tttttttttttt', '44444444-4444-4444-4444-444444444444', 'p7777777-7777-7777-7777-777777777777', NULL, 'Strong disagree! It''s still relevant', NOW() - INTERVAL '3 days'),
  ('cuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', '55555555-5555-5555-5555-555555555555', 'p7777777-7777-7777-7777-777777777777', NULL, 'The twist still holds up though', NOW() - INTERVAL '3 days'),
  
  ('cvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', '66666666-6666-6666-6666-666666666666', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'Bullet time was revolutionary', NOW() - INTERVAL '7 days'),
  ('cwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '77777777-7777-7777-7777-777777777777', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'The philosophy still resonates today', NOW() - INTERVAL '7 days'),
  ('cxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '88888888-8888-8888-8888-888888888888', 'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'Red pill or blue pill? 💊', NOW() - INTERVAL '7 days'),
  
  ('cyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '99999999-9999-9999-9999-999999999999', 'pdddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'Tarantino is a genius with structure', NOW() - INTERVAL '2 days'),
  ('czzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pdddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'The diner scene is perfect', NOW() - INTERVAL '2 days'),
  
  ('c000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'Seeing it in IMAX was life-changing', NOW() - INTERVAL '5 days'),
  ('c111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'That black hole sequence 🤯', NOW() - INTERVAL '5 days'),
  ('c222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'Hans Zimmer''s score is incredible', NOW() - INTERVAL '5 days'),
  
  ('c333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'pffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'Totoro is the best! 🌳', NOW() - INTERVAL '3 hours'),
  ('c444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'pffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'Miyazaki marathons are the best', NOW() - INTERVAL '3 hours'),
  
  ('c555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', NULL, 'Single room, pure acting perfection', NOW() - INTERVAL '4 hours'),
  ('c666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', NULL, 'Every character has depth', NOW() - INTERVAL '4 hours'),
  ('c777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', 'pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', NULL, 'Peak courtroom drama', NOW() - INTERVAL '4 hours'),
  
  ('c888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', 'plllllll-llll-llll-llll-llllllllllll', NULL, 'Nice setup! What projector?', NOW() - INTERVAL '9 hours'),
  ('c999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'plllllll-llll-llll-llll-llllllllllll', NULL, 'Goals! 🎬', NOW() - INTERVAL '8 hours'),
  ('caa0000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'plllllll-llll-llll-llll-llllllllllll', NULL, 'That screen size though 😍', NOW() - INTERVAL '8 hours'),
  
  ('cbb0000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', NULL, 'What a find! How much?', NOW() - INTERVAL '14 hours'),
  ('ccc0000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', NULL, 'Vintage posters are so cool', NOW() - INTERVAL '13 hours'),
  ('cdd0000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', NULL, 'I need to hit up flea markets more', NOW() - INTERVAL '13 hours'),
  ('cee0000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'pmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', NULL, 'Gorgeous artwork!', NOW() - INTERVAL '12 hours'),
  
  ('cff0000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', NULL, 'Old theaters have so much character', NOW() - INTERVAL '22 hours'),
  ('cgg0000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', 'pnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', NULL, 'The architecture is stunning', NOW() - INTERVAL '21 hours'),
  
  ('chh0000-0000-0000-0000-000000000000', '88888888-8888-8888-8888-888888888888', 'pooooooo-oooo-oooo-oooo-oooooooooooo', NULL, 'Criterion Collection is life 📚', NOW() - INTERVAL '1 day'),
  ('cii0000-0000-0000-0000-000000000000', '99999999-9999-9999-9999-999999999999', 'pooooooo-oooo-oooo-oooo-oooooooooooo', NULL, 'Which titles do you have?', NOW() - INTERVAL '1 day'),
  ('cjj0000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pooooooo-oooo-oooo-oooo-oooooooooooo', NULL, 'My wallet hurts looking at this 😅', NOW() - INTERVAL '1 day'),
  ('ckk0000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'pooooooo-oooo-oooo-oooo-oooooooooooo', NULL, 'Beautiful collection!', NOW() - INTERVAL '1 day'),
  
  ('cll0000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'ppppppp-pppp-pppp-pppp-pppppppppppp', NULL, 'Perfect spot! Enjoy the film', NOW() - INTERVAL '25 minutes'),
  ('cmm0000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'ppppppp-pppp-pppp-pppp-pppppppppppp', NULL, 'Center seats are always the best', NOW() - INTERVAL '20 minutes'),
  ('cnn0000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'ppppppp-pppp-pppp-pppp-pppppppppppp', NULL, 'What movie are you seeing?', NOW() - INTERVAL '18 minutes')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Seed data inserted successfully!' as message;

