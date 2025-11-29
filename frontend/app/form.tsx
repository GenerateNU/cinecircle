import { useLocalSearchParams } from "expo-router";
import PostScreen from "../screen/PostScreen";

export default function FormPage() {
  const { type } = useLocalSearchParams<{ type: "long" | "short" }>();
  return <PostScreen initialType={type} />;
}