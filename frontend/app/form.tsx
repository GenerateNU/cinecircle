import { useLocalSearchParams } from "expo-router";
import PostScreen from "../screen/PostScreen";

export default function FormPage() {
  const { type, movieId, movieTitle } = useLocalSearchParams<{ 
    type: "long" | "short"; 
    movieId?: string; 
    movieTitle?: string;
  }>();
  
  const preselectedMovie = movieId && movieTitle ? { id: movieId, title: movieTitle } : null;
  
  return <PostScreen initialType={type} preselectedMovie={preselectedMovie} />;
}