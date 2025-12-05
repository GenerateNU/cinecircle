import React from "react";
import { router } from "expo-router";
import CreatePostModal from "../../screen/createPostModal";

export default function PostRoute() {
  return (
    <CreatePostModal
      onSelect={(type) => {
        router.push({
          pathname: "/form",
          params: { type },
        });
      }}
      onClose={() => router.back()}
    />
  );
}