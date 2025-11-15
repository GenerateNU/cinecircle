// src/types/models.ts
//
// UI-specific types only. API types are auto-generated in api-generated.ts
// Components should import API types from "./api-generated"

export type User = {
  name: string;
  username: string;
  bio?: string;
  followers?: number;
  following?: number;
  profilePic?: string;
};

export type Props = {
  user?: User;
  userId?: string;
};
