import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export function ScreenLayout({ children, scrollable = true, showBack=false, backHref, style, title }: IScreenLayout) {
  return (
    <SafeAreaView className="flex-1" style={style}>
        {showBack && <ArrowBack title={title}  href={backHref}/>}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 32}}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
