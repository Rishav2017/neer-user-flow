import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Search, ChevronDown, User, Heart, Home, Grid3x3, ShoppingBag, Coffee } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 1, name: 'All', emoji: '🛍️' },
    { id: 2, name: 'Fresh', emoji: '🍎' },
    { id: 3, name: 'Weekend Party', emoji: '🥕' },
    { id: 4, name: 'Electronics', emoji: '🎧' },
    { id: 5, name: 'Fashion', emoji: '👕' },
  ];

  const deals = [
    {
      id: 1,
      name: 'Amul Day Black Currant Ice Cream Tub',
      variant: '1 pack (500 ml)',
      flavor: 'Black Currant',
      price: 123,
      originalPrice: 170,
      discount: '₹47 OFF',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
    },
    {
      id: 2,
      name: 'Crax Double Mazza Roasted Chana Peanuts Namkeen ...',
      variant: '1 pack (160 g or 171 g)',
      flavor: 'Power Crunch',
      price: 48,
      originalPrice: 55,
      discount: '₹7 OFF',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80',
    },
    {
      id: 3,
      name: 'HELL Energy Drink',
      variant: '1 pc (250 ml)',
      flavor: 'Original',
      price: 46,
      originalPrice: 60,
      discount: '₹14 OFF',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80',
    },
  ];

  return (
    <View className="flex-1 bg-purple-100">
      {/* Header */}
      <View className="bg-purple-100 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-gray-900">Try Again in 15 Mins</Text>
              <Text className="ml-2 text-xl">🏠</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm text-gray-700">Other - 13th Cross Road, Mico Layout, BTM 2...</Text>
              <ChevronDown size={16} color="#374151" />
            </View>
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-white items-center justify-center"
            onPress={() => router.push('/settings')}
          >
            <User size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Quick Access Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mt-3 max-h-20"
          contentContainerStyle={{ gap: 12 }}
        >
          <View className="bg-white rounded-2xl px-6 py-3">
            <Text className="text-purple-600 font-bold text-base">zepto</Text>
          </View>
          <View className="bg-white rounded-2xl px-6 py-3">
            <Text className="text-purple-600 font-bold text-base">50%</Text>
            <Text className="text-purple-600 text-xs">OFF ZONE</Text>
          </View>
          <View className="bg-white rounded-2xl px-6 py-3">
            <Text className="text-purple-600 font-bold text-base">Super</Text>
            <Text className="text-purple-600 font-bold text-base">Mall.</Text>
          </View>
          <View className="bg-white rounded-2xl px-6 py-3">
            <Text className="text-purple-400 font-bold text-base">café</Text>
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center">
            <Search size={20} color="#6B7280" />
            <Text className="ml-3 text-gray-600 text-base">Search for "Golden Grain"</Text>
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-4 max-h-28"
          contentContainerStyle={{ paddingHorizontal: 16, gap: 24 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.name)}
              className="items-center"
            >
              <Text className="text-4xl mb-2">{category.emoji}</Text>
              <Text className={`text-sm font-medium ${selectedCategory === category.name ? 'text-gray-900' : 'text-gray-600'}`}>
                {category.name}
              </Text>
              {selectedCategory === category.name && (
                <View className="w-full h-1 bg-gray-900 rounded-full mt-2" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promotional Banners */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-2xl p-4 mb-3">
            <View className="flex-row items-center">
              <View className="bg-purple-100 rounded-xl p-3 mr-3">
                <Text className="text-purple-600 font-bold text-2xl">Z</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">₹0 FEES</Text>
            </View>
          </View>

          <View className="bg-purple-600 rounded-2xl p-4 mb-3">
            <View className="flex-row items-center">
              <View className="bg-yellow-400 rounded-full w-12 h-12 items-center justify-center mr-3">
                <Text className="text-2xl">💰</Text>
              </View>
              <View>
                <Text className="text-white font-bold text-lg">EVERYDAY</Text>
                <Text className="text-white font-bold text-lg">LOWEST PRICES*</Text>
              </View>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3">
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <Text className="text-purple-600 text-sm font-medium">₹0 Handling Fee</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <Text className="text-purple-600 text-sm font-medium">₹0 Delivery Fee*</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <Text className="text-purple-600 text-sm font-medium">₹0 Rain & Surge Fee</Text>
            </View>
          </View>
        </View>

        {/* Blockbuster Deals */}
        <View className="px-4 mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Blockbuster <Text className="font-normal">Deals</Text>
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="max-h-96"
            contentContainerStyle={{ gap: 12 }}
          >
            {deals.map((deal) => (
              <View key={deal.id} className="bg-white rounded-2xl p-3 w-48">
                <TouchableOpacity className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Heart size={18} color="#EC4899" />
                </TouchableOpacity>
                
                <Image
                  source={{ uri: deal.image }}
                  style={{ width: 168, height: 140 }}
                  resizeMode="cover"
                  className="rounded-xl mb-3"
                />

                <TouchableOpacity className="bg-white border-2 border-purple-600 rounded-lg py-2 px-4 mb-3">
                  <Text className="text-purple-600 font-bold text-center text-base">ADD</Text>
                </TouchableOpacity>

                <View className="flex-row items-center mb-1">
                  <View className="bg-green-600 rounded px-2 py-1 mr-2">
                    <Text className="text-white font-bold text-sm">₹{deal.price}</Text>
                  </View>
                  <Text className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</Text>
                </View>

                <Text className="text-green-600 font-medium text-xs mb-2">{deal.discount}</Text>

                <Text className="text-gray-900 font-medium text-sm mb-1" numberOfLines={2}>
                  {deal.name}
                </Text>

                <Text className="text-gray-500 text-xs mb-1">{deal.variant}</Text>
                <Text className="text-gray-700 text-xs font-medium">{deal.flavor}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Free Delivery Banner */}
        <View className="px-4 mb-24">
          <View className="bg-gray-800 rounded-2xl p-4 flex-row items-center">
            <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center mr-3">
              <Text className="text-white text-xl">🔓</Text>
            </View>
            <View>
              <Text className="text-white font-bold text-base">Unlock free delivery</Text>
              <Text className="text-gray-300 text-sm">Shop for ₹99</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="items-center flex-1">
            <View className="w-10 h-10 bg-pink-500 rounded-full items-center justify-center mb-1">
              <Home size={20} color="#fff" />
            </View>
            <Text className="text-pink-500 text-xs font-medium">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => router.push('/categories')}
          >
            <Grid3x3 size={24} color="#6B7280" />
            <Text className="text-gray-600 text-xs mt-1">Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => router.push('/cart')}
          >
            <ShoppingBag size={24} color="#6B7280" />
            <Text className="text-gray-600 text-xs mt-1">Buy Again</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center flex-1">
            <Coffee size={24} color="#6B7280" />
            <Text className="text-gray-600 text-xs mt-1">Café</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => router.push('/settings')}
          >
            <Text className="text-red-500 font-bold text-sm">HUGGIES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}