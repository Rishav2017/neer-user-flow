import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Heart, Search, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react-native';
import { getCategories, getProducts, Category, Subcategory, SubSubcategory, Product } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const screenWidth = Dimensions.get('window').width;
const sidebarWidth = 90;

// Placeholder images for products without images
const getProductImage = (imageUrl: string | null): string => {
  if (imageUrl) return imageUrl;
  return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400';
};

// Category emoji mapping
const getCategoryEmoji = (name: string): string => {
  const emojiMap: Record<string, string> = {
    'all': '🥗',
    'fruits': '🍎',
    'vegetables': '🥕',
    'fresh': '✨',
    'new': '✨',
    'exotic': '🥑',
    'organic': '🌿',
    'dairy': '🥛',
    'bread': '🍞',
    'eggs': '🥚',
    'masala': '🌶️',
    'dry fruits': '🥜',
    'snacks': '🍿',
    'drinks': '🥤',
    'electronics': '📱',
    'fashion': '👕',
    'meat': '🥩',
    'fish': '🐟',
    'frozen': '🧊',
    'ice cream': '🍦',
    'breakfast': '🥣',
    'rice': '🍚',
    'oil': '🫒',
    'tea': '🍵',
    'coffee': '☕',
  };

  const lowerName = name.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(key)) {
      return emoji;
    }
  }
  return '📦';
};

export default function SubCategoryScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { isLoggedIn } = useAuth();
  const { addToCart, updateQuantity, getItemQuantity, getCartItem, cartCount, cartTotal, isLoading: cartLoading } = useCart();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [subSubcategories, setSubSubcategories] = useState<SubSubcategory[]>([]);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState(name || 'Category');
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSubSubcategories();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id, selectedSubSubcategory]);

  const fetchSubSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCategories();

      let foundSubSubcategories: SubSubcategory[] = [];
      let foundName = name || 'Category';

      for (const category of response.data) {
        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            if (subcategory.id === id) {
              foundName = subcategory.name;
              foundSubSubcategories = subcategory.subcategories || [];
              break;
            }
          }
        }
        if (foundSubSubcategories.length > 0 || foundName !== (name || 'Category')) break;
      }

      setCategoryName(foundName);
      setSubSubcategories(foundSubSubcategories);
    } catch (err: any) {
      console.error('Error fetching sub-subcategories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const params: {
        sub_category_id?: string;
        sub_sub_category_id?: string;
        per_page: number;
      } = { per_page: 50 };

      if (selectedSubSubcategory) {
        params.sub_sub_category_id = selectedSubSubcategory;
      } else {
        params.sub_category_id = id;
      }

      const response = await getProducts(params);
      setProducts(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleSubSubcategorySelect = (subSubId: string | null) => {
    setSelectedSubSubcategory(subSubId);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please login to add items to cart', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/') },
      ]);
      return;
    }

    if (product.stock_quantity === 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock');
      return;
    }

    try {
      setAddingProductId(product.id);
      await addToCart(product.id, 1);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add item to cart');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleIncreaseQuantity = async (product: Product) => {
    const cartItem = getCartItem(product.id);
    if (!cartItem) return;

    const newQuantity = cartItem.quantity + 1;
    if (newQuantity > product.stock_quantity) {
      Alert.alert('Stock Limit', `Only ${product.stock_quantity} items available`);
      return;
    }

    try {
      setAddingProductId(product.id);
      await updateQuantity(cartItem.id, newQuantity);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update cart');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleDecreaseQuantity = async (product: Product) => {
    const cartItem = getCartItem(product.id);
    if (!cartItem) return;

    try {
      setAddingProductId(product.id);
      await updateQuantity(cartItem.id, cartItem.quantity - 1);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update cart');
    } finally {
      setAddingProductId(null);
    }
  };

  const calculateDiscount = (price: string): { original: number; discount: number } => {
    const currentPrice = parseFloat(price);
    const discountPercent = 25;
    const originalPrice = Math.round(currentPrice * (100 / (100 - discountPercent)));
    return {
      original: originalPrice,
      discount: originalPrice - currentPrice,
    };
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-4">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchSubSubcategories}
          className="bg-purple-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const productWidth = (screenWidth - sidebarWidth - 24) / 2;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ChevronLeft size={28} color="#111827" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900" numberOfLines={1}>
              {categoryName}
            </Text>
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

      <View className="flex-1 flex-row">
        {/* Left Sidebar - Sub-subcategories */}
        <View style={{ width: sidebarWidth }} className="bg-gray-50 border-r border-gray-200">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* All option */}
            <TouchableOpacity
              onPress={() => handleSubSubcategorySelect(null)}
              className={`py-4 px-2 items-center border-b border-gray-100 ${
                selectedSubSubcategory === null ? 'bg-purple-100' : 'bg-white'
              }`}
              style={selectedSubSubcategory === null ? { borderLeftWidth: 3, borderLeftColor: '#A855F7' } : {}}
            >
              <Text className="text-3xl mb-2">🥗</Text>
              <Text className="text-xs text-center text-gray-800 font-medium">All</Text>
            </TouchableOpacity>

            {subSubcategories.map((subSub) => (
              <TouchableOpacity
                key={subSub.id}
                onPress={() => handleSubSubcategorySelect(subSub.id)}
                className={`py-4 px-2 items-center border-b border-gray-100 ${
                  selectedSubSubcategory === subSub.id ? 'bg-purple-100' : 'bg-white'
                }`}
                style={selectedSubSubcategory === subSub.id ? { borderLeftWidth: 3, borderLeftColor: '#A855F7' } : {}}
              >
                <Text className="text-3xl mb-2">{getCategoryEmoji(subSub.name)}</Text>
                <Text
                  className="text-xs text-center text-gray-700"
                  numberOfLines={2}
                >
                  {subSub.name}
                </Text>
              </TouchableOpacity>
            ))}

            {subSubcategories.length === 0 && (
              <View className="py-8 px-2 items-center">
                <Text className="text-gray-400 text-xs text-center">
                  No sub-categories available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Right Side - Products */}
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View className="p-3">
            <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FEF3C7' }}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800',
                }}
                style={{ width: '100%', height: 180 }}
                resizeMode="cover"
              />
              <View className="absolute top-0 left-0 right-0 bottom-0 p-5 justify-center">
                <Text className="text-4xl font-bold text-green-900 mb-1">Freshly</Text>
                <Text className="text-4xl font-bold text-green-900 mb-2">Launched</Text>
                <Text className="text-sm text-green-800 mb-4">UP TO 30% OFF</Text>
                <TouchableOpacity className="bg-white self-start px-5 py-2 rounded-full">
                  <Text className="text-green-900 font-semibold">Explore</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Products Grid */}
          <View className="px-2 pb-6">
            {productsLoading ? (
              <View className="py-16 items-center">
                <ActivityIndicator size="large" color="#A855F7" />
                <Text className="text-gray-500 mt-3">Loading products...</Text>
              </View>
            ) : products.length === 0 ? (
              <View className="py-16 items-center">
                <Text className="text-5xl mb-4">📦</Text>
                <Text className="text-gray-600 text-lg font-medium">No products found</Text>
                <Text className="text-gray-400 text-sm mt-2 text-center px-4">
                  Try selecting a different category or check back later
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap">
                {products.map((product) => {
                  const { original, discount } = calculateDiscount(product.price);
                  const currentPrice = parseFloat(product.price);
                  const quantityInCart = getItemQuantity(product.id);
                  const isAddingThis = addingProductId === product.id;

                  return (
                    <View
                      key={product.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 m-1"
                      style={{ width: productWidth - 4 }}
                    >
                      {/* Product Image */}
                      <View className="relative">
                        <Image
                          source={{ uri: getProductImage(product.image_url) }}
                          style={{ width: '100%', height: 130 }}
                          resizeMode="cover"
                        />
                        {discount > 10 && (
                          <View className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-md">
                            <Text className="text-white text-xs font-bold">SUPER</Text>
                            <Text className="text-white text-xs font-bold">SAVER</Text>
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() => toggleFavorite(product.id)}
                          className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-sm"
                        >
                          <Heart
                            size={18}
                            color={favorites.has(product.id) ? '#EC4899' : '#9CA3AF'}
                            fill={favorites.has(product.id) ? '#EC4899' : 'transparent'}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Product Info */}
                      <View className="p-3">
                        {/* ADD Button or Quantity Selector */}
                        {isAddingThis ? (
                          <View className="border-2 border-pink-500 rounded-lg py-2 mb-3 items-center">
                            <ActivityIndicator size="small" color="#EC4899" />
                          </View>
                        ) : quantityInCart > 0 ? (
                          <View className="flex-row items-center justify-between border-2 border-pink-500 rounded-lg mb-3 overflow-hidden">
                            <TouchableOpacity
                              onPress={() => handleDecreaseQuantity(product)}
                              className="px-3 py-2 bg-pink-50"
                            >
                              <Minus size={18} color="#EC4899" />
                            </TouchableOpacity>
                            <Text className="text-pink-500 font-bold text-base">{quantityInCart}</Text>
                            <TouchableOpacity
                              onPress={() => handleIncreaseQuantity(product)}
                              className="px-3 py-2 bg-pink-50"
                            >
                              <Plus size={18} color="#EC4899" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleAddToCart(product)}
                            className="border-2 border-pink-500 rounded-lg py-2 mb-3"
                            disabled={product.stock_quantity === 0}
                            style={{
                              opacity: product.stock_quantity === 0 ? 0.5 : 1,
                              backgroundColor: 'white'
                            }}
                          >
                            <Text className="text-pink-500 font-bold text-center">
                              {product.stock_quantity === 0 ? 'OUT OF STOCK' : 'ADD'}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {/* Price */}
                        <View className="flex-row items-center mb-1">
                          <View className="bg-green-600 rounded px-2 py-0.5 mr-2">
                            <Text className="text-white font-bold text-sm">
                              ₹{Math.round(currentPrice)}
                            </Text>
                          </View>
                          <Text className="text-gray-400 line-through text-sm">
                            ₹{original}
                          </Text>
                        </View>

                        {/* Discount */}
                        <Text className="text-green-600 font-semibold text-sm mb-2">
                          ₹{Math.round(discount)} OFF
                        </Text>

                        {/* Product Name */}
                        <Text
                          className="text-gray-900 font-medium text-sm mb-1"
                          numberOfLines={2}
                        >
                          {product.name}
                        </Text>

                        {/* Description */}
                        {product.description && (
                          <Text className="text-gray-500 text-xs" numberOfLines={1}>
                            {product.description}
                          </Text>
                        )}

                        {/* Stock warning */}
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                          <Text className="text-orange-500 text-xs font-medium mt-1">
                            Only {product.stock_quantity} left
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Floating Cart Banner */}
      {cartCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          className="absolute bottom-6 left-4 right-4 bg-green-600 rounded-2xl py-4 px-5 flex-row items-center justify-between shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center">
            <View className="bg-green-700 rounded-full p-2 mr-3">
              <ShoppingBag size={20} color="#fff" />
            </View>
            <View>
              <Text className="text-white font-bold text-base">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'} added
              </Text>
              <Text className="text-green-100 text-sm">
                ₹{Math.round(cartTotal)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-white font-semibold text-base mr-1">View Cart</Text>
            <ChevronRight size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
