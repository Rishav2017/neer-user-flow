import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { sendOTP, isLoggedIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace('/home');
    }
  }, [isLoggedIn]);

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      if (cleaned.length > 0) {
        setIsValid(validatePhoneNumber(cleaned));
      } else {
        setIsValid(true);
      }
    }
  };

  const handleContinue = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setIsValid(false);
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // Send OTP via Firebase
      await sendOTP(phoneNumber);
      // Navigate to OTP screen
      router.push({
        pathname: '/otp',
        params: { phone: phoneNumber },
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonEnabled = phoneNumber.length === 10 && isValid && !isLoading;

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header spacer */}
            <View className="px-4 py-4 h-14" />

            {/* Content */}
            <View className="flex-1 px-6 pt-8">
              {/* Icon */}
              <View className="items-center mb-8">
                <View className="w-20 h-20 rounded-full bg-purple-500 items-center justify-center">
                  <Phone size={40} color="#FFFFFF" />
                </View>
              </View>

              {/* Title */}
              <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">
                Welcome to QuickCart
              </Text>

              <Text className="text-base text-gray-500 text-center mb-12">
                Enter your mobile number to get started
              </Text>

              {/* Phone Input */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </Text>

                <View
                  className={`flex-row items-center bg-white rounded-2xl px-4 py-4 ${
                    !isValid ? 'border-2 border-red-500' : 'border-2 border-transparent'
                  }`}
                >
                  <Text className="text-lg font-medium text-gray-900 mr-2">+91</Text>
                  <View className="w-px h-6 bg-gray-300 mr-3" />
                  <TextInput
                    className="flex-1 text-lg text-gray-900"
                    placeholder="Enter 10-digit mobile number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    editable={!isLoading}
                    accessibilityLabel="Phone number input"
                  />
                </View>

                {!isValid && phoneNumber.length > 0 && (
                  <Text className="text-sm text-red-500 mt-2 ml-1">
                    Please enter a valid 10-digit mobile number
                  </Text>
                )}
              </View>

              {/* Info Text */}
              <View className="bg-purple-100 rounded-xl p-4 mb-8">
                <Text className="text-sm text-gray-600 text-center">
                  We'll send you a verification code to confirm your number
                </Text>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isButtonEnabled}
                className={`rounded-full py-4 items-center flex-row justify-center ${
                  isButtonEnabled ? 'bg-purple-500' : 'bg-gray-300'
                }`}
                accessibilityLabel="Continue to OTP verification"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    className={`text-lg font-bold ${
                      isButtonEnabled ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    Continue
                  </Text>
                )}
              </TouchableOpacity>

              {/* Terms Text */}
              <Text className="text-xs text-gray-500 text-center mt-6">
                By continuing, you agree to our{' '}
                <Text className="text-purple-500 font-medium">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-purple-500 font-medium">Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
