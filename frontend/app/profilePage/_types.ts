export type User = {
  name: string;
  username: string;
  bio?: string;
  followers?: number;
  following?: number;
  profilePic?: string;
};

export type TabKey = 'movies' | 'posts' | 'events' | 'badges';

