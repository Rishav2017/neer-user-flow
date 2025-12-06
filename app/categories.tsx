import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Heart, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CategoriesScreen() {
  const router = useRouter();

  const groceryCategories = [
    {
      id: '1',
      name: 'Fruits &\nVegetables',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Dairy, Bread\n& Eggs',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'Atta, Rice,\nOil & Dals',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
    },
    {
      id: '4',
      name: 'Meat, Fish\n& Eggs',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop'
    },
    {
      id: '5',
      name: 'Masala &\nDry Fruits',
      image: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82e6c?w=400&h=400&fit=crop'
    },
    {
      id: '6',
      name: 'Breakfast &\nSauces',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop'
    },
    {
      id: '7',
      name: 'Packaged\nFood',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop'
    }
  ];

  const snacksCategories = [
    {
      id: '8',
      name: 'Zepto\nCafe',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop'
    },
    {
      id: '9',
      name: 'Tea, Coffee\n& More',
      image: 'https://images.unsplash.com/photo-1611564164862-33c0e5c7e93c?w=400&h=400&fit=crop'
    },
    {
      id: '10',
      name: 'Ice Creams\n& More',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop'
    },
    {
      id: '11',
      name: 'Frozen\nFood',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
    }
  ];

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">All Categories</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Heart size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Search size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Fashion Store Banner */}
        <View className="px-4 pt-6 pb-4">
          <View className="bg-purple-600 rounded-3xl overflow-hidden">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop' }}
              className="w-full h-32 absolute"
              resizeMode="cover"
            />
            <View className="p-6">
              <Text className="text-purple-200 text-xs font-semibold tracking-wider mb-1">LAUNCHING</Text>
              <Text className="text-white text-3xl font-bold mb-3">Fashion Store</Text>
              <TouchableOpacity className="bg-white rounded-full px-5 py-2 self-start flex-row items-center">
                <Text className="text-purple-600 font-semibold text-sm">Shop now</Text>
                <Text className="text-purple-600 ml-1">→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Grocery & Kitchen Section */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-xl font-bold text-gray-900 mb-4">Grocery & Kitchen</Text>
          
          {/* First Row - 3 items */}
          <View className="flex-row flex-wrap gap-3 mb-3">
            {groceryCategories.slice(0, 3).map((category) => (
              <TouchableOpacity 
                key={category.id}
                className="bg-white rounded-2xl p-4 items-center shrink-0 basis-[31%] min-w-0"
              >
                <Image
                  source={{ uri: category.image }}
                  className="w-20 h-20 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <Text className="text-gray-900 text-xs font-medium text-center leading-4">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row - 4 items */}
          <View className="flex-row flex-wrap gap-3">
            {groceryCategories.slice(3, 7).map((category) => (
              <TouchableOpacity 
                key={category.id}
                className="bg-white rounded-2xl p-4 items-center shrink-0 basis-[23%] min-w-0"
              >
                <Image
                  source={{ uri: category.image }}
                  className="w-16 h-16 rounded-xl mb-2"
                  resizeMode="cover"
                />
                <Text className="text-gray-900 text-xs font-medium text-center leading-4">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Snacks & Drinks Section */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">Snacks & Drinks</Text>
          
          <View className="flex-row flex-wrap gap-3">
            {snacksCategories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                className="bg-white rounded-2xl p-4 items-center shrink-0 basis-[23%] min-w-0"
              >
                <Image
                  source={{ uri: category.image }}
                  className="w-16 h-16 rounded-xl mb-2"
                  resizeMode="cover"
                />
                <Text className="text-gray-900 text-xs font-medium text-center leading-4">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Unlock Free Delivery Banner */}
        <View className="px-4 py-6">
          <View className="bg-gray-800 rounded-2xl p-4 flex-row items-center">
            <View className="bg-gray-700 rounded-full w-10 h-10 items-center justify-center mr-3">
              <Text className="text-white text-lg">🎁</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">Unlock free delivery</Text>
              <Text className="text-gray-400 text-sm">Shop for ₹99</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-4 py-2 flex-row items-center justify-around">
        <TouchableOpacity 
          className="items-center py-2 px-4"
          onPress={() => router.push('/')}
        >
          <View className="w-6 h-6 items-center justify-center mb-1">
            <View className="w-5 h-5 border-2 border-gray-400 rounded-lg" />
          </View>
          <Text className="text-gray-500 text-xs">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center py-2 px-4">
          <View className="w-6 h-6 items-center justify-center mb-1">
            <View className="flex-row gap-1">
              <View className="w-2 h-2 bg-pink-500 rounded-sm" />
              <View className="w-2 h-2 bg-pink-500 rounded-sm" />
            </View>
            <View className="flex-row gap-1 mt-1">
              <View className="w-2 h-2 bg-pink-500 rounded-sm" />
              <View className="w-2 h-2 bg-pink-500 rounded-sm" />
            </View>
          </View>
          <Text className="text-pink-500 text-xs font-semibold">Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="items-center py-2 px-4"
          onPress={() => router.push('/')}
        >
          <View className="w-6 h-6 items-center justify-center mb-1">
            <View className="w-5 h-5 border-2 border-gray-400 rounded" />
          </View>
          <Text className="text-gray-500 text-xs">Buy Again</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="items-center py-2 px-4"
          onPress={() => router.push('/')}
        >
          <View className="w-6 h-6 items-center justify-center mb-1">
            <View className="w-4 h-5 border-2 border-gray-400 rounded-t-lg" />
            <View className="w-3 h-1 bg-gray-400 absolute bottom-0" />
          </View>
          <Text className="text-gray-500 text-xs">Café</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="items-center py-2 px-4"
          onPress={() => router.push('/')}
        >
          <Text className="text-red-500 text-base font-bold mb-1">HUGGIES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}