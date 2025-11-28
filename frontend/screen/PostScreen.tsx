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
  // The post type comes from the route (/post/form?type=long)
  const [postType] = useState<"long" | "short">(initialType);

  // Toolbar actions
  const [showStars, setShowStars] = useState(false);

  // Form references
  const longFormRef = useRef<any>(null);
  const shortFormRef = useRef<any>(null);

  // User info
  const { user } = useAuth();

  // Submit handler (used by both forms)
  const handleFormSubmit = async (formData: PostFormData) => {
    const payload = {
      ...formData,
      userId: user.id,
      postType: postType === "long" ? "LONG_POST" : "SHORT_POST",
    };

    await createPost(payload);
    router.back();
  };

  // Trigger internal form submit
  const handleSubmitButton = () => {
    if (postType === "long") {
      longFormRef.current?.submit();
    } else {
      shortFormRef.current?.submit();
    }
  };

  // Toolbar action handler (stars, images, etc.)
  const handleToolbarAction = (action: string) => {
    if (action === "rating") {
      setShowStars((prev) => !prev);
    }
  };

  return (
    <>
      {/* Header bar with Back + Submit */}
      <CreatePostBar
        title={postType === "long" ? "Create Long" : "Create Short"}
        onBack={() => router.back()}
        onSubmit={handleSubmitButton}
      />

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {postType === "long" ? (
            <LongPostForm
              ref={longFormRef}
              showTextBox
              showStars={showStars}
              onToolbarAction={handleToolbarAction}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <ShortPostForm
              ref={shortFormRef}
              showTextBox
              showStars={showStars}
              onToolbarAction={handleToolbarAction}
              onSubmit={handleFormSubmit}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
