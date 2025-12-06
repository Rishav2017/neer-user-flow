import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  Home,
  Briefcase,
  User,
  Phone,
  Building,
  MapPinned,
} from "lucide-react-native";

export default function AddAddressScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"home" | "work" | "other">(
    "home"
  );
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    flatNumber: "",
    area: "",
    landmark: "",
    pincode: "",
  });

  const addressTypes = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "work" as const, label: "Work", icon: Briefcase },
    { id: "other" as const, label: "Other", icon: MapPin },
  ];

  const handleSaveAddress = () => {
    // Mock save functionality
    console.log("Saving address:", { ...formData, type: selectedType });
    router.back();
  };

  return (
    <View className="flex-1 bg-purple-100">
      {/* Header */}
      <View className="bg-purple-500 pt-12 pb-4 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">
            Add Address Details
          </Text>
        </View>

        {/* Selected Location Display */}
        <View className="bg-white/20 rounded-2xl p-4 flex-row items-start">
          <MapPinned size={20} color="#FFFFFF" className="mt-1 mr-3" />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base mb-1">
              Delivering to
            </Text>
            <Text className="text-white/90 text-sm">
              123 Main Street, Downtown Area, City - 400001
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Address Type Selection */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold text-base mb-3">
            Save Address As
          </Text>
          <View className="flex-row gap-3">
            {addressTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  className={`flex-1 items-center py-3 rounded-xl border-2 ${
                    isSelected
                      ? "bg-purple-50 border-purple-500"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Icon
                    size={24}
                    color={isSelected ? "#A855F7" : "#6B7280"}
                  />
                  <Text
                    className={`mt-2 font-semibold text-sm ${
                      isSelected ? "text-purple-500" : "text-gray-500"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold text-base mb-4">
            Contact Details
          </Text>

          {/* Full Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Full Name *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <User size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.fullName}
                onChangeText={(text) =>
                  setFormData({ ...formData, fullName: text })
                }
              />
            </View>
          </View>

          {/* Phone Number Input */}
          <View>
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Phone Number *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Phone size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, phoneNumber: text })
                }
              />
            </View>
          </View>
        </View>

        {/* Address Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold text-base mb-4">
            Address Details
          </Text>

          {/* Flat/House Number */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Flat / House No. / Building *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Building size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter flat/house number"
                placeholderTextColor="#9CA3AF"
                value={formData.flatNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, flatNumber: text })
                }
              />
            </View>
          </View>

          {/* Area/Street */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Area / Street / Sector *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <MapPin size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter area or street name"
                placeholderTextColor="#9CA3AF"
                value={formData.area}
                onChangeText={(text) =>
                  setFormData({ ...formData, area: text })
                }
              />
            </View>
          </View>

          {/* Landmark */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Nearby Landmark (Optional)
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <MapPinned size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="E.g., Near City Mall"
                placeholderTextColor="#9CA3AF"
                value={formData.landmark}
                onChangeText={(text) =>
                  setFormData({ ...formData, landmark: text })
                }
              />
            </View>
          </View>

          {/* Pincode */}
          <View>
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Pincode *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <MapPin size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter 6-digit pincode"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                value={formData.pincode}
                onChangeText={(text) =>
                  setFormData({ ...formData, pincode: text })
                }
              />
            </View>
          </View>
        </View>

        {/* Helper Text */}
        <View className="mx-4 mt-4 mb-24">
          <Text className="text-gray-500 text-xs text-center">
            * Required fields must be filled to save the address
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <TouchableOpacity
          onPress={handleSaveAddress}
          className="bg-purple-500 rounded-full py-4 items-center"
        >
          <Text className="text-white font-bold text-base">Save Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}