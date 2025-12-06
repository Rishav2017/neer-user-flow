import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShoppingBag,
} from "lucide-react-native";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  unit: string;
  inStock: boolean;
}

export default function CartScreen() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Fresh Bananas",
      image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224",
      price: 45,
      originalPrice: 60,
      quantity: 2,
      unit: "dozen",
      inStock: true,
    },
    {
      id: "2",
      name: "Organic Tomatoes",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
      price: 80,
      quantity: 1,
      unit: "kg",
      inStock: true,
    },
    {
      id: "3",
      name: "Fresh Milk",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
      price: 65,
      originalPrice: 75,
      quantity: 3,
      unit: "ltr",
      inStock: true,
    },
    {
      id: "4",
      name: "Brown Eggs",
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f",
      price: 120,
      quantity: 1,
      unit: "dozen",
      inStock: false,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode("");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 0;
  const handlingFee = 0;
  const discount = appliedCoupon ? 50 : 0;
  const total = subtotal + deliveryFee + handlingFee - discount;

  const inStockItems = cartItems.filter((item) => item.inStock);
  const outOfStockItems = cartItems.filter((item) => !item.inStock);

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-900">My Cart</Text>
            <Text className="text-sm text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Text>
          </View>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Delivery Info Banner */}
        <View className="bg-green-50 mx-4 mt-4 p-4 rounded-2xl border border-green-200">
          <View className="flex-row items-center gap-2">
            <ShoppingBag size={20} color="#10B981" />
            <Text className="flex-1 text-sm font-semibold text-green-700">
              Free delivery on orders above ₹199
            </Text>
          </View>
          <Text className="text-xs text-green-600 mt-1 ml-7">
            Add ₹{Math.max(0, 199 - subtotal)} more to qualify
          </Text>
        </View>

        {/* In Stock Items */}
        {inStockItems.length > 0 && (
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 px-4 mb-3">
              Available Items ({inStockItems.length})
            </Text>
            {inStockItems.map((item) => (
              <View
                key={item.id}
                className="bg-white mx-4 mb-3 p-4 rounded-2xl"
              >
                <View className="flex-row gap-3">
                  <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-gray-500 mb-2">
                      {item.unit}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg font-bold text-purple-600">
                        ₹{item.price}
                      </Text>
                      {item.originalPrice && (
                        <Text className="text-sm text-gray-400 line-through">
                          ₹{item.originalPrice}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="items-end justify-between">
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      className="p-2"
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                    <View className="flex-row items-center bg-purple-100 rounded-full">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Minus size={16} color="#A855F7" />
                      </TouchableOpacity>
                      <Text className="text-sm font-bold text-purple-600 w-8 text-center">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Plus size={16} color="#A855F7" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Out of Stock Items */}
        {outOfStockItems.length > 0 && (
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 px-4 mb-3">
              Out of Stock ({outOfStockItems.length})
            </Text>
            {outOfStockItems.map((item) => (
              <View
                key={item.id}
                className="bg-white mx-4 mb-3 p-4 rounded-2xl opacity-60"
              >
                <View className="flex-row gap-3">
                  <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-red-500 font-semibold mb-2">
                      Currently unavailable
                    </Text>
                    <Text className="text-lg font-bold text-gray-400">
                      ₹{item.price}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    className="p-2"
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Coupon Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <View className="flex-row items-center gap-2 mb-3">
            <Tag size={20} color="#A855F7" />
            <Text className="text-base font-semibold text-gray-900">
              Apply Coupon
            </Text>
          </View>

          {appliedCoupon ? (
            <View className="bg-green-50 p-3 rounded-xl border border-green-200 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-bold text-green-700">
                  {appliedCoupon}
                </Text>
                <Text className="text-xs text-green-600 mt-1">
                  ₹50 discount applied
                </Text>
              </View>
              <TouchableOpacity
                onPress={removeCoupon}
                className="bg-green-600 px-4 py-2 rounded-full"
              >
                <Text className="text-xs font-semibold text-white">
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row gap-2">
              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter coupon code"
                placeholderTextColor="#9CA3AF"
                className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-sm text-gray-900"
              />
              <TouchableOpacity
                onPress={applyCoupon}
                disabled={!couponCode.trim()}
                className={`px-6 py-3 rounded-xl ${
                  couponCode.trim()
                    ? "bg-purple-600"
                    : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    couponCode.trim() ? "text-white" : "text-gray-400"
                  }`}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="mt-3 bg-purple-50 p-3 rounded-xl">
            <Text className="text-xs font-semibold text-purple-700">
              Available Coupons
            </Text>
            <Text className="text-xs text-purple-600 mt-1">
              FIRST50 - ₹50 off on first order
            </Text>
          </View>
        </View>

        {/* Bill Details */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Bill Details
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Item Total</Text>
              <Text className="text-sm font-semibold text-gray-900">
                ₹{subtotal}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Delivery Fee</Text>
              <Text className="text-sm font-semibold text-green-600">
                FREE
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Handling Fee</Text>
              <Text className="text-sm font-semibold text-green-600">
                FREE
              </Text>
            </View>

            {discount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Discount</Text>
                <Text className="text-sm font-semibold text-green-600">
                  -₹{discount}
                </Text>
              </View>
            )}

            <View className="border-t border-gray-200 pt-3 mt-1">
              <View className="flex-row justify-between">
                <Text className="text-base font-bold text-gray-900">
                  Grand Total
                </Text>
                <Text className="text-lg font-bold text-purple-600">
                  ₹{total}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Savings Info */}
        {discount > 0 && (
          <View className="bg-green-50 mx-4 mt-4 p-4 rounded-2xl border border-green-200">
            <Text className="text-sm font-semibold text-green-700 text-center">
              🎉 You saved ₹{discount} on this order!
            </Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs text-gray-500">Total Amount</Text>
              <Text className="text-2xl font-bold text-purple-600">
                ₹{total}
              </Text>
            </View>
            <TouchableOpacity className="bg-purple-600 px-8 py-4 rounded-full">
              <Text className="text-base font-bold text-white">
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-500 text-center">
            15 min delivery • Zero fees
          </Text>
        </View>
      )}

      {/* Empty Cart State */}
      {cartItems.length === 0 && (
        <View className="flex-1 items-center justify-center px-8">
          <ShoppingBag size={64} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
            Your cart is empty
          </Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Add items to get started with your order
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="bg-purple-600 px-8 py-4 rounded-full mt-6"
          >
            <Text className="text-base font-bold text-white">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}