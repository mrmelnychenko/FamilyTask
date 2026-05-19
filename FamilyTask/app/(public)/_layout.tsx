import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect, Slot } from "expo-router";

export default function PublicLayout() {
    const { user, loading } = useAuth();
  
    if (loading) return <LoadingScreen />;
  
    if (user) return <Redirect href="/home" />;
  
    return <Slot />;
  }