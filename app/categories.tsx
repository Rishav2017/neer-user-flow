import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Heart, Search, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getCategories, Category } from '@/services/api';

// Placeholder images for categories (since API doesn't have images)
const categoryImages: Record<string, string> = {
  'Grocery & Kitchen': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
  'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=400&fit=crop',
  'Dairy, Bread & Eggs': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop',
  'Masala & Dry Fruits': 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82e6c?w=400&h=400&fit=crop',
  'Snacks & Drinks': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop',
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
  'Fashion': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop',
};

const getCategoryImage = (name: string): string => {
  return categoryImages[name] || categoryImages['default'];
};

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategories();
      setCategories(response.data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
        <Text className="text-gray-600 mt-4">Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center px-4">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchCategories}
          className="bg-purple-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

        {/* Categories List */}
        {categories.length === 0 ? (
          <View className="px-4 py-8 items-center">
            <Text className="text-gray-500 text-lg">No categories available</Text>
          </View>
        ) : (
          categories.map((category) => (
            <View key={category.id} className="px-4 pt-4 pb-2">
              {/* Category Header */}
              <TouchableOpacity
                onPress={() => toggleCategory(category.id)}
                className="flex-row items-center justify-between mb-4"
              >
                <Text className="text-xl font-bold text-gray-900">{category.name}</Text>
                <View className="flex-row items-center">
                  <Text className="text-purple-500 text-sm mr-1">
                    {category.subcategories?.length || 0} subcategories
                  </Text>
                  <ChevronRight
                    size={20}
                    color="#A855F7"
                    style={{
                      transform: [{ rotate: expandedCategory === category.id ? '90deg' : '0deg' }],
                    }}
                  />
                </View>
              </TouchableOpacity>

              {/* Subcategories Grid */}
              {category.subcategories && category.subcategories.length > 0 && (
                <View className="flex-row flex-wrap gap-3">
                  {category.subcategories.map((subcategory) => (
                    <TouchableOpacity
                      key={subcategory.id}
                      className="bg-white rounded-2xl p-4 items-center"
                      style={{ width: '30%', minWidth: 100 }}
                      onPress={() => router.push({
                        pathname: '/subcategory',
                        params: { id: subcategory.id, name: subcategory.name }
                      })}
                    >
                      <Image
                        source={{ uri: getCategoryImage(subcategory.name) }}
                        className="w-16 h-16 rounded-xl mb-2"
                        resizeMode="cover"
                      />
                      <Text
                        className="text-gray-900 text-xs font-medium text-center leading-4"
                        numberOfLines={2}
                      >
                        {subcategory.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Show message if no subcategories */}
              {(!category.subcategories || category.subcategories.length === 0) && (
                <TouchableOpacity
                  className="bg-white rounded-2xl p-4 items-center"
                  onPress={() => router.push({
                    pathname: '/subcategory',
                    params: { id: category.id, name: category.name }
                  })}
                >
                  <Image
                    source={{ uri: getCategoryImage(category.name) }}
                    className="w-20 h-20 rounded-xl mb-3"
                    resizeMode="cover"
                  />
                  <Text className="text-gray-900 text-sm font-medium text-center">
                    Browse {category.name}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

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
          onPress={() => router.push('/home')}
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
          onPress={() => router.push('/cart')}
        >
          <View className="w-6 h-6 items-center justify-center mb-1">
            <View className="w-5 h-5 border-2 border-gray-400 rounded" />
          </View>
          <Text className="text-gray-500 text-xs">Buy Again</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center py-2 px-4">
          <View className="w-6 h-6 items-center justify-center mb-1">
            <View className="w-4 h-5 border-2 border-gray-400 rounded-t-lg" />
            <View className="w-3 h-1 bg-gray-400 absolute bottom-0" />
          </View>
          <Text className="text-gray-500 text-xs">Café</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center py-2 px-4"
          onPress={() => router.push('/settings')}
        >
          <Text className="text-red-500 text-base font-bold mb-1">HUGGIES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
