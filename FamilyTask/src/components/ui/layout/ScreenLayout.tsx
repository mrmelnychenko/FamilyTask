import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowBack } from '../ArrowBack';

interface IScreenLayout {
  children: React.ReactNode;
  scrollable?: boolean;
  showBack?: boolean;
}

export function ScreenLayout({ children, scrollable = true, showBack=false }: IScreenLayout) {
  return (
    <SafeAreaView className="flex-1" >
        {showBack && <ArrowBack />}
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
