-- Clear existing data (optional)
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
  "imageUrl"
) VALUES
  ('tt0111161', 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years.', '9.2', 9300000, '["English"]', '120', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0068646', 'The Godfather', 'The aging patriarch of an organized crime dynasty transfers control.', '9.1', 9200000, '["English", "Italian"]', '98', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0468569', 'The Dark Knight', 'Batman must accept one of the greatest psychological tests.', '8.9', 9000000, '["English"]', '145', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0137523', 'Fight Club', 'An insomniac office worker forms an underground fight club.', '8.7', 8800000, '["English"]', '89', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0109830', 'Forrest Gump', 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.', '8.8', 8800000, '["English"]', '103', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt1375666', 'Inception', 'A thief who steals corporate secrets through dream-sharing technology.', '8.7', 8800000, '["English", "French", "Japanese"]', '156', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0073486', 'One Flew Over the Cuckoo''s Nest', 'A criminal pleads insanity and is admitted to a mental institution.', '8.6', 8700000, '["English"]', '67', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0099685', 'Goodfellas', 'The story of Henry Hill and his life in the mob.', '8.6', 8700000, '["English", "Italian"]', '78', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0245429', 'Spirited Away', 'A young girl enters a world ruled by gods and witches.', '8.5', 8600000, '["Japanese"]', '92', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt1853728', 'Django Unchained', 'With the help of a German bounty hunter, a freed slave seeks revenge.', '8.4', 8500000, '["English"]', '85', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0816692', 'Interstellar', 'A team of explorers travel through a wormhole in space.', '8.6', 8700000, '["English"]', '134', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0110912', 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine.', '8.8', 8900000, '["English"]', '156', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0076759', 'Star Wars', 'Luke Skywalker joins forces to save Princess Leia.', '8.5', 8600000, '["English"]', '167', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0050083', '12 Angry Men', 'A jury holdout attempts to prevent a miscarriage of justice.', '8.9', 9000000, '["English"]', '54', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt6751668', 'Parasite', 'Greed and class discrimination threaten the symbiotic relationship.', '8.5', 8600000, '["Korean"]', '98', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0167260', 'The Lord of the Rings: The Return of the King', 'Gandalf and Aragorn lead the World of Men against Sauron.', '8.9', 9000000, '["English"]', '189', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0114369', 'Se7en', 'Two detectives hunt a serial killer who uses the seven deadly sins.', '8.6', 8600000, '["English"]', '76', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0120737', 'The Lord of the Rings: The Fellowship of the Ring', 'A meek Hobbit sets out to destroy the One Ring.', '8.8', 8800000, '["English"]', '145', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0133093', 'The Matrix', 'A computer hacker learns about the true nature of his reality.', '8.7', 8700000, '["English"]', '167', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg'),
  ('tt0088763', 'Back to the Future', 'Marty McFly is accidentally sent 30 years into the past.', '8.5', 8500000, '["English"]', '123', '/ii8QGacT3MXESqBckQlyrATY0lT.jpg')
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
  "votes",
  "createdAt"
) VALUES
  ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Just watched Shawshank Redemption again. Never gets old! 🎬', 'SHORT', 5, NOW() - INTERVAL '2 days'),
  ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'The Dark Knight is a masterpiece of modern cinema. Christopher Nolan''s direction, Heath Ledger''s performance, and the moral complexity make it unforgettable.', 'LONG', 12, NOW() - INTERVAL '5 days'),
  ('p3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Anyone else think Inception is overrated?', 'SHORT', -2, NOW() - INTERVAL '1 day'),
  ('p4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Film analysis: The use of color grading in The Godfather to represent moral decay is absolutely brilliant. Each scene''s palette tells its own story.', 'LONG', 23, NOW() - INTERVAL '7 days'),
  ('p5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Spirited Away on the big screen tonight! Can''t wait! 🍿', 'SHORT', 8, NOW() - INTERVAL '3 hours'),
  ('p6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Just discovered the indie film scene. Why didn''t anyone tell me about this sooner?!', 'SHORT', 4, NOW() - INTERVAL '12 hours'),
  ('p7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Hot take: Fight Club aged poorly', 'SHORT', -5, NOW() - INTERVAL '4 days'),
  ('p8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Parasite winning Best Picture was a watershed moment for international cinema. It opened doors and changed perceptions about what mainstream audiences can appreciate.', 'LONG', 34, NOW() - INTERVAL '10 days'),
  ('p9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'Documentary recommendations anyone?', 'SHORT', 7, NOW() - INTERVAL '6 hours'),
  ('paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The Matrix revolutionized action choreography and visual effects. Its influence can still be seen in films today, 25 years later.', 'LONG', 19, NOW() - INTERVAL '8 days'),
  ('pbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Going to the Summer Film Festival next month. Who''s in?', 'SHORT', 11, NOW() - INTERVAL '1 hour'),
  ('pcccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Rewatching LOTR trilogy this weekend. Epic! 🧙‍♂️', 'SHORT', 15, NOW() - INTERVAL '2 hours'),
  ('pdddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Pulp Fiction: nonlinear storytelling at its finest', 'SHORT', 9, NOW() - INTERVAL '3 days'),
  ('peeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'The cinematography in Interstellar is breathtaking. IMAX made all the difference.', 'SHORT', 17, NOW() - INTERVAL '6 days'),
  ('pffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'Studio Ghibli marathon happening! Starting with Totoro 🌳', 'SHORT', 6, NOW() - INTERVAL '4 hours'),
  ('pgggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 'Se7en still holds up as one of the best thriller endings ever', 'SHORT', 13, NOW() - INTERVAL '5 days'),
  ('phhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', 'Star Wars original trilogy > prequels > sequels. Fight me.', 'SHORT', 2, NOW() - INTERVAL '8 hours'),
  ('piiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 'Back to the Future is the perfect time travel movie. Everything about it works.', 'SHORT', 21, NOW() - INTERVAL '9 days'),
  ('pjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 'Film noir appreciation post: Double Indemnity, The Maltese Falcon, Touch of Evil. The shadows, the dialogue, the moral ambiguity - this genre defined cinema.', 'LONG', 14, NOW() - INTERVAL '11 days'),
  ('pkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '12 Angry Men with just one room and phenomenal acting 👏', 'SHORT', 10, NOW() - INTERVAL '5 hours')
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
  "date",
  "votes"
) VALUES
  ('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'tt0111161', 5, 'Absolute masterpiece. Tim Robbins and Morgan Freeman are perfect.', ARRAY['inspirational', 'emotional'], NOW() - INTERVAL '10 days', 15),
  ('r2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'tt0468569', 5, 'Heath Ledger''s Joker is iconic. Best superhero movie ever made.', ARRAY['dark', 'intense', 'action-packed'], NOW() - INTERVAL '8 days', 23),
  ('r3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'tt1375666', 4, 'Mind-bending but sometimes confusing. Still worth multiple watches.', ARRAY['complex', 'visually-stunning'], NOW() - INTERVAL '5 days', 8),
  ('r4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'tt0068646', 5, 'The definitive gangster film. Brando''s performance is legendary.', ARRAY['classic', 'violent', 'epic'], NOW() - INTERVAL '15 days', 19),
  ('r5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'tt0245429', 5, 'Miyazaki''s imagination knows no bounds. Beautiful and touching.', ARRAY['magical', 'heartwarming', 'animated'], NOW() - INTERVAL '3 days', 12),
  ('r6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'tt0114369', 5, 'Fincher at his best. Dark, twisted, unforgettable ending.', ARRAY['dark', 'psychological', 'thriller'], NOW() - INTERVAL '12 days', 17),
  ('r7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'tt0076759', 5, 'Changed cinema forever. A true cultural phenomenon.', ARRAY['sci-fi', 'adventure', 'iconic'], NOW() - INTERVAL '20 days', 25),
  ('r8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'tt6751668', 5, 'Brilliant social commentary. Every scene is meticulously crafted.', ARRAY['thought-provoking', 'tense', 'satirical'], NOW() - INTERVAL '7 days', 21),
  ('r9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'tt0110912', 5, 'Tarantino''s best work. Dialogue is sharp, structure is perfect.', ARRAY['stylish', 'violent', 'quotable'], NOW() - INTERVAL '18 days', 28),
  ('raaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tt0133093', 5, 'Revolutionary special effects. The philosophical questions still resonate.', ARRAY['philosophical', 'action', 'groundbreaking'], NOW() - INTERVAL '6 days', 16),
  ('rbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'tt0109830', 5, 'Tom Hanks gives the performance of a lifetime. Emotional journey.', ARRAY['heartwarming', 'emotional', 'inspiring'], NOW() - INTERVAL '14 days', 13),
  ('rcccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'tt0137523', 4, 'Thought-provoking critique of consumerism. Twist is great.', ARRAY['psychological', 'violent', 'subversive'], NOW() - INTERVAL '11 days', 9),
  ('rdddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'tt0816692', 5, 'Christopher Nolan''s most ambitious film. Visually spectacular.', ARRAY['epic', 'emotional', 'sci-fi'], NOW() - INTERVAL '4 days', 22),
  ('reeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'tt0099685', 5, 'Scorsese''s masterclass in storytelling. Ray Liotta is perfect.', ARRAY['gangster', 'violent', 'fast-paced'], NOW() - INTERVAL '16 days', 18),
  ('rfffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'tt1853728', 4, 'Tarantino''s revisionist Western. Entertaining but long.', ARRAY['western', 'violent', 'stylized'], NOW() - INTERVAL '9 days', 11),
  ('rgggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 'tt0073486', 5, 'Jack Nicholson''s best performance. Powerful and disturbing.', ARRAY['psychological', 'rebellious', 'classic'], NOW() - INTERVAL '13 days', 14),
  ('rhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', 'tt0167260', 5, 'The perfect conclusion to an epic trilogy. Extended edition is a must.', ARRAY['epic', 'fantasy', 'emotional'], NOW() - INTERVAL '22 days', 31),
  ('riiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 'tt0120737', 5, 'Peter Jackson brought Tolkien''s world to life perfectly.', ARRAY['adventure', 'fantasy', 'epic'], NOW() - INTERVAL '21 days', 27),
  ('rjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 'tt0088763', 5, 'The most fun time travel movie ever. Perfect blend of comedy and adventure.', ARRAY['fun', 'nostalgic', 'adventure'], NOW() - INTERVAL '17 days', 20),
  ('rkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tt0050083', 5, 'Timeless courtroom drama. All takes place in one room but riveting.', ARRAY['tense', 'dialogue-driven', 'classic'], NOW() - INTERVAL '19 days', 15),
  ('rllllll-llll-llll-llll-llllllllllll', '11111111-1111-1111-1111-111111111111', 'tt0068646', 5, 'An offer you can''t refuse. This film is perfection.', ARRAY['classic', 'family-saga'], NOW() - INTERVAL '25 days', 24),
  ('rmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '22222222-2222-2222-2222-222222222222', 'tt0111161', 5, 'Hope is a powerful thing. This movie proves it.', ARRAY['hopeful', 'friendship'], NOW() - INTERVAL '23 days', 19),
  ('rnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '33333333-3333-3333-3333-333333333333', 'tt0245429', 4, 'Beautiful animation but felt long at times.', ARRAY['animated', 'imaginative'], NOW() - INTERVAL '2 days', 7),
  ('rooooooo-oooo-oooo-oooo-oooooooooooo', '44444444-4444-4444-4444-444444444444', 'tt0137523', 5, 'His name was Robert Paulson. Unforgettable.', ARRAY['cult-classic', 'mind-bending'], NOW() - INTERVAL '26 days', 22),
  ('rpppppp-pppp-pppp-pppp-pppppppppppp', '55555555-5555-5555-5555-555555555555', 'tt0076759', 5, 'May the Force be with you. Always.', ARRAY['iconic', 'space-opera'], NOW() - INTERVAL '24 days', 26),
  ('rqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '66666666-6666-6666-6666-666666666666', 'tt0109830', 4, 'Life is like a box of chocolates... sweet but predictable at times.', ARRAY['feel-good', 'heartwarming'], NOW() - INTERVAL '27 days', 12),
  ('rrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '77777777-7777-7777-7777-777777777777', 'tt0110912', 5, 'English, do you speak it?! Iconic quotes galore.', ARRAY['quotable', 'violent'], NOW() - INTERVAL '28 days', 30),
  ('rsssssss-ssss-ssss-ssss-ssssssssssss', '88888888-8888-8888-8888-888888888888', 'tt0133093', 4, 'Take the red pill. Mind-blowing when it came out.', ARRAY['sci-fi', 'philosophical'], NOW() - INTERVAL '29 days', 18),
  ('rttttttt-tttt-tttt-tttt-tttttttttttt', '99999999-9999-9999-9999-999999999999', 'tt1375666', 5, 'We need to go deeper. Every layer is fascinating.', ARRAY['complex', 'thriller'], NOW() - INTERVAL '30 days', 25),
  ('ruuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tt6751668', 5, 'The stairs scene alone is worth the price of admission.', ARRAY['social-commentary', 'thriller'], NOW() - INTERVAL '31 days', 23)
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
  ('cpppppp-pppp-pppp-pppp-pppppppppppp', '66666666-6666-6666-6666-666666666666', NULL, 'rllllll-llll-llll-llll-llllllllllll', 'Leave the gun, take the cannoli', NOW() - INTERVAL '24 days')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Seed data inserted successfully!' as message;

