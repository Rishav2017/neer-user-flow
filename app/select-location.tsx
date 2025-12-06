import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Search, ChevronRight, Navigation, Home, Briefcase, Heart, Plus, X } from 'lucide-react-native';

interface SavedAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  details: string;
  isDefault: boolean;
}

export default function SelectLocationScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string>('1');

  // Mock saved addresses
  const savedAddresses: SavedAddress[] = [
    {
      id: '1',
      type: 'home',
      label: 'Home',
      address: '123 Main Street, Apartment 4B',
      details: 'Near Central Park, New York, NY 10001',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      label: 'Work',
      address: '456 Business Avenue, Floor 12',
      details: 'Downtown Manhattan, New York, NY 10005',
      isDefault: false
    },
    {
      id: '3',
      type: 'other',
      label: 'Mom\'s Place',
      address: '789 Oak Street, House #5',
      details: 'Brooklyn Heights, Brooklyn, NY 11201',
      isDefault: false
    }
  ];

  // Mock recent searches
  const recentSearches = [
    'Times Square, Manhattan',
    'Brooklyn Bridge Park',
    'Central Station, Queens'
  ];

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color="#A855F7" />;
      case 'work':
        return <Briefcase size={20} color="#A855F7" />;
      default:
        return <MapPin size={20} color="#A855F7" />;
    }
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  const handleConfirmLocation = () => {
    // Navigate back to home with selected address
    router.back();
  };

  const handleUseCurrentLocation = () => {
    // Mock current location detection
    console.log('Detecting current location...');
  };

  return (
    <View className="flex-1 bg-purple-100">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Select Location</Text>
          <View className="w-10" />
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-purple-50 rounded-full px-4 py-3">
          <Search size={20} color="#A855F7" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for area, street name..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 text-base"
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Use Current Location */}
        <TouchableOpacity 
          onPress={handleUseCurrentLocation}
          className="bg-white mx-4 mt-4 rounded-2xl p-4 flex-row items-center border-2 border-purple-500"
        >
          <View className="bg-purple-100 rounded-full p-3">
            <Navigation size={24} color="#A855F7" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-base font-bold text-gray-900">Use Current Location</Text>
            <Text className="text-sm text-gray-500 mt-1">Enable location services</Text>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Saved Addresses */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Saved Addresses</Text>
            <TouchableOpacity className="flex-row items-center">
              <Plus size={18} color="#A855F7" />
              <Text className="text-purple-500 font-semibold ml-1">Add New</Text>
            </TouchableOpacity>
          </View>

          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              onPress={() => handleSelectAddress(address.id)}
              className={`bg-white rounded-2xl p-4 mb-3 ${
                selectedAddress === address.id ? 'border-2 border-purple-500' : 'border border-gray-200'
              }`}
            >
              <View className="flex-row items-start">
                <View className="bg-purple-100 rounded-full p-3">
                  {getAddressIcon(address.type)}
                </View>
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center">
                    <Text className="text-base font-bold text-gray-900">{address.label}</Text>
                    {address.isDefault && (
                      <View className="bg-green-100 rounded-full px-2 py-1 ml-2">
                        <Text className="text-xs font-semibold text-green-600">Default</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-gray-900 mt-2">{address.address}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{address.details}</Text>
                </View>
                {selectedAddress === address.id && (
                  <View className="bg-purple-500 rounded-full p-1 ml-2">
                    <View className="bg-white rounded-full w-3 h-3" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View className="mt-6 px-4 pb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-gray-200"
              >
                <View className="bg-gray-100 rounded-full p-2">
                  <MapPin size={18} color="#6B7280" />
                </View>
                <Text className="flex-1 ml-3 text-sm text-gray-900">{search}</Text>
                <ChevronRight size={18} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Confirm Button */}
      <View className="bg-white px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleConfirmLocation}
          className="bg-purple-500 rounded-full py-4 items-center"
        >
          <Text className="text-white text-base font-bold">Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}