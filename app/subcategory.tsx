import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Heart, Search } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

interface Product {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  description: string;
  badge?: string;
  isFavorite: boolean;
}

export default function SubCategoryScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const subcategories = [
    { id: '1', name: 'All', icon: '🥗' },
    { id: '2', name: 'Fresh Vegeta...', icon: '🥕' },
    { id: '3', name: 'New Launches', icon: '✨' },
    { id: '4', name: 'Fresh Fruits', icon: '🍎' },
    { id: '5', name: 'Exotics & Premium', icon: '🥑' },
    { id: '6', name: 'Organics & Hydr...', icon: '🌿' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Mango Sindhura',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
      currentPrice: 80,
      originalPrice: 124,
      discount: 44,
      description: '2 pcs',
      badge: 'SUPER SAVER',
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Strawberry (Mahabaleshwar)',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
      currentPrice: 98,
      originalPrice: 172,
      discount: 74,
      description: '1 pack (Approx. 160g ...',
      badge: 'MILD SAVER',
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Coriander leaves',
      image: 'https://images.unsplash.com/photo-1583487758698-f3a6b0d4c5b0?w=400',
      currentPrice: 8,
      originalPrice: 12,
      discount: 4,
      description: '1 pack (100 g)',
      isFavorite: false,
    },
    {
      id: '4',
      name: 'Fresh Onion',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
      currentPrice: 28,
      originalPrice: 54,
      discount: 26,
      description: '1 Pack / 900-1000 gm',
      isFavorite: false,
    },
  ];

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ChevronLeft size={28} color="#111827" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">Fruits & Vegetables</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Heart size={24} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Search size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Left Side Category Filter */}
        <View className="flex-row">
          {/* Category Sidebar */}
          <View className="w-24 bg-gray-50 border-r border-gray-100">
            <ScrollView showsVerticalScrollIndicator={false}>
              {subcategories.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  className={`py-4 px-2 items-center border-b border-gray-100 ${
                    index === 0 ? 'bg-purple-100' : ''
                  }`}
                >
                  <Text className="text-3xl mb-1">{category.icon}</Text>
                  <Text className="text-xs text-center text-gray-700" numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Main Content */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Banner */}
            <View className="p-4">
              <View className="bg-amber-50 rounded-3xl overflow-hidden">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800' }}
                  style={{ width: screenWidth - 128, height: 200 }}
                  resizeMode="cover"
                />
                <View className="absolute top-0 left-0 right-0 bottom-0 p-6 justify-center">
                  <Text className="text-4xl font-bold text-green-900 mb-1">Freshly</Text>
                  <Text className="text-4xl font-bold text-green-900 mb-2">Launched</Text>
                  <Text className="text-sm text-green-800 mb-4">UP TO 30% OFF</Text>
                  <TouchableOpacity className="bg-white self-start px-6 py-2 rounded-full">
                    <Text className="text-green-900 font-semibold">Explore</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Products Grid */}
            <View className="px-4 pb-4">
              <View className="flex-row flex-wrap gap-3">
                {products.map((product) => (
                  <View
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shrink-0 basis-[48%] min-w-0"
                  >
                    {/* Product Image */}
                    <View className="relative">
                      <Image
                        source={{ uri: product.image }}
                        style={{ width: '100%', height: 140 }}
                        resizeMode="cover"
                      />
                      {product.badge && (
                        <View
                          className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
                            product.badge === 'SUPER SAVER'
                              ? 'bg-yellow-500'
                              : 'bg-pink-500'
                          }`}
                        >
                          <Text className="text-white text-xs font-bold">
                            {product.badge === 'SUPER SAVER' ? 'SUPER' : 'MILD'}
                          </Text>
                          <Text className="text-white text-xs font-bold">SAVER</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => toggleFavorite(product.id)}
                        className="absolute top-2 left-2 bg-white rounded-full p-1"
                      >
                        <Heart
                          size={20}
                          color={favorites.has(product.id) ? '#EC4899' : '#9CA3AF'}
                          fill={favorites.has(product.id) ? '#EC4899' : 'transparent'}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Product Info */}
                    <View className="p-3">
                      {/* ADD Button */}
                      <TouchableOpacity className="bg-white border-2 border-pink-500 rounded-lg py-2 mb-2">
                        <Text className="text-pink-500 font-bold text-center">ADD</Text>
                      </TouchableOpacity>

                      {/* Price */}
                      <View className="flex-row items-center mb-1">
                        <View className="bg-green-600 rounded px-2 py-0.5 mr-2">
                          <Text className="text-white font-bold text-sm">
                            ₹{product.currentPrice}
                          </Text>
                        </View>
                        <Text className="text-gray-400 line-through text-sm">
                          ₹{product.originalPrice}
                        </Text>
                      </View>

                      {/* Discount */}
                      <Text className="text-green-600 font-semibold text-sm mb-2">
                        ₹{product.discount} OFF
                      </Text>

                      {/* Product Name */}
                      <Text className="text-gray-900 font-semibold text-sm mb-1" numberOfLines={2}>
                        {product.name}
                      </Text>

                      {/* Description */}
                      <Text className="text-gray-500 text-xs mb-1">{product.description}</Text>

                      {/* Badge Text */}
                      {product.id === '1' && (
                        <Text className="text-teal-600 text-xs font-medium">Limited Edition</Text>
                      )}
                      {product.id === '2' && (
                        <Text className="text-teal-600 text-xs font-medium">Early Season</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}