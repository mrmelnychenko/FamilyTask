import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import { AuthHeader } from '../components/ui/header/AuthHeader';
import { ArrowBack } from '../components/ui/ArrowBack';
import { LoginForm } from '../components/ui/auth/LoginForm';

export function LoginScreen() {

  return (
    <View className="flex-1 bg-background">

      {/* FIXED BACK BUTTON */}

      <ArrowBack />


      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 40,
          gap: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER (scrolls) */}
        <AuthHeader
          title="Увійти"
          text="Увійдіть до вашого сімейного простору"
        />

        <LoginForm />
      </ScrollView>
    </View>
  );
}