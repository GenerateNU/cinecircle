export type ApiComment = {
    id: string;
    userId: string;
    ratingId?: string | null;
    postId?: string | null;
    parentId?: string | null;
    content: string;
    createdAt: string;
    likeCount: number;
    liked: boolean;
    UserProfile?: {
      userId: string;
      username: string | null;
      profilePicture: string | null;
    } | null;
  };