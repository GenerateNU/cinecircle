import { useState, useEffect, useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/UserLike.styles";
import { getUserProfileBasic } from "../services/userService";

interface UserLikeProps {
  isLiked?: boolean;
  onLikePress?: () => void;

  /** Direct email if already known */
  email?: string;

  /** Fetch logged-in user's email automatically */
  useLoggedInUser?: boolean;

  /** Optional override for API base URL */
  apiBaseUrl?: string;
}

export default function UserLike({
  isLiked = false,
  onLikePress,
  email: emailProp,
  useLoggedInUser = false,
  apiBaseUrl = "",
}: UserLikeProps) {
  const [liked, setLiked] = useState(isLiked);
  const [email, setEmail] = useState<string | null>(emailProp ?? null);
  const [loading, setLoading] = useState(false);

  const isLikeInteractive = onLikePress !== undefined;
  const displayEmail = useMemo(() => email ?? null, [email]);

  useEffect(() => {
    let cancelled = false;

    // making it use the currently logged in user's email
    async function fetchLoggedInEmail() {
      setLoading(true);
      try {
        const res = await getUserProfileBasic();
        const fetchedEmail =
          (res as any)?.user?.email ??
          (res as any)?.data?.user?.email ??
          (res as any)?.email ??
          null;

        if (!cancelled && fetchedEmail) {
          setEmail(fetchedEmail);
        }
      } catch {
        if (!cancelled) setEmail(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!emailProp && useLoggedInUser) {
      fetchLoggedInEmail();
    }

    return () => {
      cancelled = true;
    };
  }, [useLoggedInUser, emailProp, apiBaseUrl]);

  const handleLikePress = () => {
    if (!isLikeInteractive) return;
    setLiked((prev) => !prev);
    onLikePress?.();
  };

  const LikeContainer = isLikeInteractive ? TouchableOpacity : View;

  return (
    <View style={styles.container}>
      <LikeContainer
        style={styles.button}
        onPress={isLikeInteractive ? handleLikePress : undefined}
        activeOpacity={isLikeInteractive ? 0.7 : 1}
      >
        <MaterialIcons
          name="favorite"
          style={liked ? styles.likedIcon : styles.icon}
        />

        {loading ? (
          <Text style={styles.loadingText}>Loading…</Text>
        ) : displayEmail ? (
          <Text style={styles.emailText}>{displayEmail}</Text>
        ) : null}
      </LikeContainer>
    </View>
  );
}
