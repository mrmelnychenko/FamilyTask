import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowBack } from '../ArrowBack';
import { Href } from 'expo-router';

interface IScreenLayout {
  children: React.ReactNode;
  scrollable?: boolean;
  showBack?: boolean;
  backHref?: Href;
  style?: object;
  title?: string;
}

export function ScreenLayout({
  children,
  scrollable = true,
  showBack = false,
  backHref,
  style,
  title,
}: IScreenLayout) {
  return (
    <SafeAreaView className="flex-1" style={style}>
      {showBack && <ArrowBack title={title} href={backHref} />}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scrollable ? (
          <View className="flex-1">
            {children}
          </View>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
