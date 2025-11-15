import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CreatePostBar from "../components/CreatePostBar";
import PostTypeSelector from "../components/PostTypeSelector";
import PostForm, { PostFormRef } from "../components/PostForm";

export default function PostScreen() {
  const [postType, setPostType] = useState<"long" | "short" | "rating" | null>(null);
  const [showStars, setShowStars] = useState(false);

  const formRef = useRef<PostFormRef>(null);

  const handleSubmit = (data: { content: string; rating?: number }) => {
    console.log("Post submitted:", data);
    setPostType(null);
    setShowStars(false);
  };

  const handleToolbarAction = (action: string) => {
    if (action === "rating") showStars ? setShowStars(false) : setShowStars(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {postType === null ? (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <PostTypeSelector value={postType} onChange={setPostType} />
        </View>
      ) : (
        <>
          <CreatePostBar
            title={postType === "short" ? "Create Short" : "Create Post"}
            onBack={() => {
              setPostType(null);
              setShowStars(false);
            }}
            onSubmit={() => formRef.current?.submit()}
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <PostForm
                ref={formRef}
                showTextBox
                showStars={showStars}
                onSubmit={handleSubmit}
                onToolbarAction={handleToolbarAction}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}
