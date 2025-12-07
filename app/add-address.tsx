import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
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
  Navigation,
} from "lucide-react-native";
import * as Location from "expo-location";
import { createAddress } from "@/services/api";

export default function AddAddressScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"home" | "work" | "other">(
    "home"
  );
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    addressLine: "",
    areaName: "",
    landmark: "",
    pincode: "",
    latitude: 0,
    longitude: 0,
  });

  const addressTypes = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "work" as const, label: "Work", icon: Briefcase },
    { id: "other" as const, label: "Other", icon: MapPin },
  ];

  const getCurrentLocation = async () => {
    try {
      setFetchingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to get your current location.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData({
        ...formData,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert("Success", "Location captured successfully!");
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location. Please try again.");
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSaveAddress = async () => {
    // Validate required fields
    if (!formData.receiverName.trim()) {
      Alert.alert("Error", "Please enter receiver's name");
      return;
    }
    if (!formData.receiverPhone.trim() || formData.receiverPhone.length !== 10) {
      Alert.alert("Error", "Please enter valid 10-digit phone number");
      return;
    }
    if (!formData.addressLine.trim()) {
      Alert.alert("Error", "Please enter flat/house number");
      return;
    }
    if (!formData.areaName.trim()) {
      Alert.alert("Error", "Please enter area name");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      Alert.alert("Error", "Please enter valid 6-digit pincode");
      return;
    }
    if (formData.latitude === 0 && formData.longitude === 0) {
      Alert.alert("Error", "Please capture your current location");
      return;
    }

    try {
      setLoading(true);

      await createAddress({
        label: selectedType,
        address_line: formData.addressLine,
        area_name: formData.areaName,
        landmark: formData.landmark || undefined,
        receiver_name: formData.receiverName,
        receiver_phone: formData.receiverPhone,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pincode: formData.pincode,
        is_default: false,
      });

      Alert.alert("Success", "Address saved successfully", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error saving address:", error);
      Alert.alert("Error", error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
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

        {/* Info Display */}
        <View className="bg-white/20 rounded-2xl p-4 flex-row items-start">
          <MapPinned size={20} color="#FFFFFF" className="mt-1 mr-3" />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base mb-1">
              Add your delivery location
            </Text>
            <Text className="text-white/90 text-sm">
              Fill in the details below to save your address
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

        {/* Receiver Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold text-base mb-4">
            Receiver Details
          </Text>

          {/* Receiver Name Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Receiver Name *
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <User size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter receiver's full name"
                placeholderTextColor="#9CA3AF"
                value={formData.receiverName}
                onChangeText={(text) =>
                  setFormData({ ...formData, receiverName: text })
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
                value={formData.receiverPhone}
                onChangeText={(text) =>
                  setFormData({ ...formData, receiverPhone: text })
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
                value={formData.addressLine}
                onChangeText={(text) =>
                  setFormData({ ...formData, addressLine: text })
                }
              />
            </View>
          </View>

          {/* Area Name */}
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
                value={formData.areaName}
                onChangeText={(text) =>
                  setFormData({ ...formData, areaName: text })
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
              <TextInput
                className="flex-1 text-gray-900 text-base"
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

        {/* Location Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold text-base mb-4">
            Location Coordinates *
          </Text>

          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={fetchingLocation}
            className={`flex-row items-center justify-center py-4 rounded-xl border-2 border-dashed ${
              formData.latitude !== 0
                ? "border-green-500 bg-green-50"
                : "border-purple-300 bg-purple-50"
            }`}
          >
            {fetchingLocation ? (
              <ActivityIndicator size="small" color="#A855F7" />
            ) : (
              <>
                <Navigation
                  size={20}
                  color={formData.latitude !== 0 ? "#10B981" : "#A855F7"}
                />
                <Text
                  className={`ml-2 font-semibold ${
                    formData.latitude !== 0 ? "text-green-600" : "text-purple-600"
                  }`}
                >
                  {formData.latitude !== 0
                    ? "Location Captured"
                    : "Get Current Location"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {formData.latitude !== 0 && (
            <Text className="text-gray-500 text-xs text-center mt-2">
              Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}
            </Text>
          )}
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
          disabled={loading}
          className={`rounded-full py-4 items-center ${
            loading ? "bg-purple-300" : "bg-purple-500"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Save Address</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
