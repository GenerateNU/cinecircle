import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import LongPostForm from "../components/LongPostForm";
import ShortPostForm from "../components/ShortPostForm";
import CreatePostBar from "../components/CreatePostBar";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";

export type PostFormData = {
  content: string; 
  rating?: number; 
  title?: string; 
  subtitle?: string; 
  tags?: string[];
};

export default function PostScreen({
  initialType,
}: {
  initialType: "long" | "short";
}) {
  const [postType] = useState<"long" | "short">(initialType);
  const [showStars, setShowStars] = useState(false);
  const longFormRef = useRef<any>(null);
  const shortFormRef = useRef<any>(null);
  const { user } = useAuth();

  const handleFormSubmit = async (formData: PostFormData) => {
    const payload = {
      ...formData,
      userId: user?.id,
      postType: postType === "long" ? "LONG_POST" : "SHORT_POST",
    };

    await createPost(payload);
    router.back();
  };

  const handleSubmitButton = () => {
    if (postType === "long") {
      longFormRef.current?.submit();
    } else {
      shortFormRef.current?.submit();
    }
  };

  // TO DO - ask in meeting on Wed
  const handleToolbarAction = (action: string) => {
    if (action === "rating") {
      setShowStars((prev) => !prev);
    }
  };

  return (
    <>
      <CreatePostBar
        title={postType === "long" ? "Create Long" : "Create Short"}
        onBack={() => router.back()}
        onSubmit={handleSubmitButton}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {postType === "long" ? (
            <LongPostForm
              onToolbarAction={handleToolbarAction}
              onSubmit={handleFormSubmit}
/>
          ) : (
            <ShortPostForm
              onToolbarAction={handleToolbarAction}
              onSubmit={handleFormSubmit}
            />
          )}
        </ScrollView>
        
      </KeyboardAvoidingView>
    </>
  );
}