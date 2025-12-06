import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validatePhoneNumber = (number: string) => {
    // Basic validation for 10-digit phone number
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numbers
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

  const handleContinue = () => {
    if (validatePhoneNumber(phoneNumber)) {
      // Navigate to OTP screen with phone number
      router.push('/otp');
    } else {
      setIsValid(false);
    }
  };

  const isButtonEnabled = phoneNumber.length === 10 && isValid;

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
        </View>

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
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
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
            className={`rounded-full py-4 items-center ${
              isButtonEnabled ? 'bg-purple-500' : 'bg-gray-300'
            }`}
            accessibilityLabel="Continue to OTP verification"
          >
            <Text className={`text-lg font-bold ${
              isButtonEnabled ? 'text-white' : 'text-gray-500'
            }`}>
              Continue
            </Text>
          </TouchableOpacity>

          {/* Terms Text */}
          <Text className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <Text className="text-purple-500 font-medium">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-purple-500 font-medium">Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}