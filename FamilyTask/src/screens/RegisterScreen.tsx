import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import { AuthHeader } from '../components/ui/header/AuthHeader';
import { ArrowBack } from '../components/ui/ArrowBack';
import { RegisterForm } from '../components/ui/auth/RegisterForm';

export function RegisterScreen() {

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
          title="Створити акаунт"
          text="Зареєструйтесь та створіть свій сімейний простір"
        />

        <RegisterForm />
      </ScrollView>
    </View>
  );
}