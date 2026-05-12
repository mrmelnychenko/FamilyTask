import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info';

export type AppToastParams = {
  title: string;
  message?: string;
};


export function useAppToast() {
    const show = (type: ToastType, { title, message }: AppToastParams) => {
      Toast.show({
        type,
        text1: title,
        text2: message,
      });
    };
  
    const success = (params: AppToastParams) => {
      show('success', params);
    };
  
    const error = (params: AppToastParams) => {
      show('error', params);
    };
  
    const info = (params: AppToastParams) => {
      show('info', params);
    };
  
    return {
      success,
      error,
      info,
    };
  }