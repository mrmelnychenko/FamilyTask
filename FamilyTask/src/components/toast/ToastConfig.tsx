import { colors } from '@/src/utils/colors';
import React from 'react';
import { View, Text } from 'react-native';
import { BaseToast, ErrorToast, ToastConfigParams } from 'react-native-toast-message';


type ToastProps = ToastConfigParams<any>;

const baseStyle = {
  borderLeftWidth: 0,
  borderRadius: 16,
  paddingHorizontal: 14,
  paddingVertical: 10,
};

export const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        ...baseStyle,
        backgroundColor: colors.successBg,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: colors.success,
      }}
      text2Style={{
        fontSize: 12,
        color: colors.muted,
      }}
    />
  ),

  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{
        ...baseStyle,
        backgroundColor: colors.dangerBg,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: colors.danger,
      }}
      text2Style={{
        fontSize: 12,
        color: colors.muted,
      }}
    />
  ),

  warning: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        ...baseStyle,
        backgroundColor: colors.warningBg,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: colors.warning,
      }}
      text2Style={{
        fontSize: 12,
        color: colors.muted,
      }}
    />
  ),

  info: (props: ToastProps) => (
    <View
      style={{
        ...baseStyle,
        backgroundColor: colors.primaryLight,
        flexDirection: 'column',
      }}
    >
      <Text
        style={{
          color: colors.primaryDark,
          fontWeight: '700',
          fontSize: 14,
        }}
      >
        {props.text1}
      </Text>

      {!!props.text2 && (
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {props.text2}
        </Text>
      )}
    </View>
  ),
};