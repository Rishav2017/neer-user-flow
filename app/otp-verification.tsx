import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Mock phone number (in real app, this would come from navigation params)
  const phoneNumber = '+91 98765 43210';

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;
    
    // Mock resend functionality
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    Alert.alert('Success', 'OTP has been resent to your phone number');
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    
    // Mock verification (in real app, this would call an API)
    setTimeout(() => {
      setIsVerifying(false);
      
      // Mock success (in real app, check API response)
      if (otpCode === '123456') {
        Alert.alert('Success', 'Phone number verified successfully!', [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-purple-500 pt-12 pb-6 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
          activeOpacity={0.7}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Verify OTP</Text>
        <Text className="text-purple-100 text-sm mt-1">
          Enter the code sent to {phoneNumber}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* OTP Input Section */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-gray-900 text-lg font-semibold mb-6 text-center">
              Enter 6-Digit Code
            </Text>
            
            {/* OTP Input Boxes */}
            <View className="flex-row justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className={`w-12 h-14 border-2 rounded-xl text-center text-xl font-bold ${
                    digit
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  style={{ textAlignVertical: 'center' }}
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View className="items-center">
              {!canResend ? (
                <View className="flex-row items-center gap-2 mb-4">
                  <Text className="text-gray-500 text-sm">
                    Resend OTP in
                  </Text>
                  <View className="bg-purple-100 px-3 py-1 rounded-full">
                    <Text className="text-purple-600 font-semibold">
                      00:{timer.toString().padStart(2, '0')}
                    </Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  className="flex-row items-center gap-2 mb-4"
                  activeOpacity={0.7}
                >
                  <RefreshCw color="#A855F7" size={18} />
                  <Text className="text-purple-600 font-semibold">
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerify}
              disabled={!isOtpComplete || isVerifying}
              className={`py-4 rounded-full ${
                isOtpComplete && !isVerifying
                  ? 'bg-purple-500'
                  : 'bg-gray-300'
              }`}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View className="bg-purple-100 rounded-2xl p-4">
            <Text className="text-purple-900 font-semibold mb-2">
              💡 Quick Tips
            </Text>
            <Text className="text-purple-700 text-sm mb-1">
              • Check your messages for the 6-digit code
            </Text>
            <Text className="text-purple-700 text-sm mb-1">
              • Make sure you have a stable network connection
            </Text>
            <Text className="text-purple-700 text-sm">
              • For testing, use code: 123456
            </Text>
          </View>

          {/* Change Number */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 py-3"
            activeOpacity={0.7}
          >
            <Text className="text-purple-600 text-center font-medium">
              Change Phone Number
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}