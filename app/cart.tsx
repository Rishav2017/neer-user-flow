import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
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
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Placeholder image for products without images
const getProductImage = (imageUrl: string | null): string => {
  if (imageUrl) return imageUrl;
  return "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400";
};

export default function CartScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const {
    cartItems,
    cartTotal,
    cartCount,
    isLoading,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [showCustomTipInput, setShowCustomTipInput] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      refreshCart();
    }
  }, [isLoggedIn]);

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      setUpdatingItemId(cartItemId);
      await updateQuantity(cartItemId, newQuantity);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update cart");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdatingItemId(cartItemId);
              await removeFromCart(cartItemId);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to remove item");
            } finally {
              setUpdatingItemId(null);
            }
          },
        },
      ]
    );
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

  const subtotal = cartTotal;
  const deliveryFee = 0;
  const handlingFee = 0;
  const discount = appliedCoupon ? 50 : 0;
  const tipAmount = selectedTip || (customTip ? parseFloat(customTip) || 0 : 0);
  const total = subtotal + deliveryFee + handlingFee - discount + tipAmount;

  const tipOptions = [10, 20, 30, 50];

  const handleTipSelect = (tip: number) => {
    if (selectedTip === tip) {
      setSelectedTip(null);
    } else {
      setSelectedTip(tip);
      setCustomTip("");
    }
  };

  const handleCustomTipChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomTip(numericValue);
    setSelectedTip(null);
  };

  const handleOtherTipPress = () => {
    setShowCustomTipInput(true);
    setSelectedTip(null);
  };

  const handlePresetTipSelect = (tip: number) => {
    if (selectedTip === tip) {
      setSelectedTip(null);
    } else {
      setSelectedTip(tip);
      setCustomTip("");
      setShowCustomTipInput(false);
    }
  };

  // Filter items by stock
  const inStockItems = cartItems.filter(
    (item) => item.product && item.product.stock_quantity > 0
  );
  const outOfStockItems = cartItems.filter(
    (item) => item.product && item.product.stock_quantity === 0
  );

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center px-8">
        <ShoppingBag size={64} color="#D1D5DB" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
          Please login to view cart
        </Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          Login to add items and checkout
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-purple-600 px-8 py-4 rounded-full mt-6"
        >
          <Text className="text-base font-bold text-white">Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && cartItems.length === 0) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
        <Text className="text-gray-600 mt-4">Loading cart...</Text>
      </View>
    );
  }

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
              {cartCount} {cartCount === 1 ? "item" : "items"}
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
          {subtotal < 199 && (
            <Text className="text-xs text-green-600 mt-1 ml-7">
              Add ₹{Math.max(0, 199 - subtotal)} more to qualify
            </Text>
          )}
        </View>

        {/* In Stock Items */}
        {inStockItems.length > 0 && (
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 px-4 mb-3">
              Available Items ({inStockItems.length})
            </Text>
            {inStockItems.map((item) => {
              const price = parseFloat(item.product.price);
              const isUpdating = updatingItemId === item.id;

              return (
                <View key={item.id} className="bg-white mx-4 mb-3 p-4 rounded-2xl">
                  <View className="flex-row gap-3">
                    <Image
                      source={{ uri: getProductImage(item.product.image_url) }}
                      className="w-20 h-20 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </Text>
                      {item.product.description && (
                        <Text className="text-xs text-gray-500 mb-2">
                          {item.product.description}
                        </Text>
                      )}
                      <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-bold text-purple-600">
                          ₹{Math.round(price)}
                        </Text>
                        <Text className="text-sm text-gray-400">
                          x {item.quantity} = ₹{Math.round(price * item.quantity)}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end justify-between">
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        className="p-2"
                        disabled={isUpdating}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                      {isUpdating ? (
                        <View className="bg-purple-100 rounded-full px-4 py-2">
                          <ActivityIndicator size="small" color="#A855F7" />
                        </View>
                      ) : (
                        <View className="flex-row items-center bg-purple-100 rounded-full">
                          <TouchableOpacity
                            onPress={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 items-center justify-center"
                          >
                            <Minus size={16} color="#A855F7" />
                          </TouchableOpacity>
                          <Text className="text-sm font-bold text-purple-600 w-8 text-center">
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 items-center justify-center"
                            disabled={item.quantity >= item.product.stock_quantity}
                          >
                            <Plus
                              size={16}
                              color={
                                item.quantity >= item.product.stock_quantity
                                  ? "#D1D5DB"
                                  : "#A855F7"
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  {item.product.stock_quantity < 10 && (
                    <Text className="text-xs text-orange-500 mt-2">
                      Only {item.product.stock_quantity} left in stock
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Out of Stock Items */}
        {outOfStockItems.length > 0 && (
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 px-4 mb-3">
              Out of Stock ({outOfStockItems.length})
            </Text>
            {outOfStockItems.map((item) => {
              const price = parseFloat(item.product.price);

              return (
                <View
                  key={item.id}
                  className="bg-white mx-4 mb-3 p-4 rounded-2xl opacity-60"
                >
                  <View className="flex-row gap-3">
                    <Image
                      source={{ uri: getProductImage(item.product.image_url) }}
                      className="w-20 h-20 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </Text>
                      <Text className="text-xs text-red-500 font-semibold mb-2">
                        Currently unavailable
                      </Text>
                      <Text className="text-lg font-bold text-gray-400">
                        ₹{Math.round(price)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      className="p-2"
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Coupon Section */}
        {cartItems.length > 0 && (
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
                  <Text className="text-xs font-semibold text-white">Remove</Text>
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
                    couponCode.trim() ? "bg-purple-600" : "bg-gray-200"
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
        )}

        {/* Tip Section */}
        {cartItems.length > 0 && (
          <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-base font-semibold text-gray-900">
                  Tip your delivery partner
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  100% of tip goes to your delivery partner
                </Text>
              </View>
              <Text className="text-2xl">🛵</Text>
            </View>

            {/* Tip Options */}
            <View className="flex-row gap-2">
              {tipOptions.map((tip) => (
                <TouchableOpacity
                  key={tip}
                  onPress={() => handlePresetTipSelect(tip)}
                  className={`flex-1 py-3 rounded-xl border-2 items-center ${
                    selectedTip === tip
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      selectedTip === tip ? "text-purple-600" : "text-gray-700"
                    }`}
                  >
                    ₹{tip}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Other Button */}
              <TouchableOpacity
                onPress={handleOtherTipPress}
                className={`flex-1 py-3 rounded-xl border-2 items-center ${
                  showCustomTipInput || (customTip && !selectedTip)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    showCustomTipInput || (customTip && !selectedTip)
                      ? "text-purple-600"
                      : "text-gray-700"
                  }`}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Tip Input - Only shown when Other is selected */}
            {showCustomTipInput && (
              <View className="mt-3 flex-row items-center bg-gray-50 rounded-xl border-2 border-purple-300 px-4">
                <Text className="text-purple-600 font-bold">₹</Text>
                <TextInput
                  value={customTip}
                  onChangeText={handleCustomTipChange}
                  placeholder="Enter tip amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  autoFocus
                  className="flex-1 py-3 px-2 text-base text-gray-900"
                />
                {customTip ? (
                  <TouchableOpacity
                    onPress={() => {
                      setCustomTip("");
                      setShowCustomTipInput(false);
                    }}
                    className="p-1"
                  >
                    <Text className="text-gray-400 text-lg">✕</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {tipAmount > 0 && (
              <View className="mt-3 bg-green-50 p-3 rounded-xl border border-green-200">
                <Text className="text-xs text-green-700 text-center">
                  Thank you for tipping ₹{tipAmount}! Your kindness makes their day better.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bill Details */}
        {cartItems.length > 0 && (
          <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Bill Details
            </Text>

            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Item Total</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  ₹{Math.round(subtotal)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Delivery Fee</Text>
                <Text className="text-sm font-semibold text-green-600">FREE</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Handling Fee</Text>
                <Text className="text-sm font-semibold text-green-600">FREE</Text>
              </View>

              {discount > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Discount</Text>
                  <Text className="text-sm font-semibold text-green-600">
                    -₹{discount}
                  </Text>
                </View>
              )}

              {tipAmount > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Delivery Partner Tip</Text>
                  <Text className="text-sm font-semibold text-gray-900">
                    ₹{tipAmount}
                  </Text>
                </View>
              )}

              <View className="border-t border-gray-200 pt-3 mt-1">
                <View className="flex-row justify-between">
                  <Text className="text-base font-bold text-gray-900">
                    Grand Total
                  </Text>
                  <Text className="text-lg font-bold text-purple-600">
                    ₹{Math.round(total)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Savings Info */}
        {discount > 0 && (
          <View className="bg-green-50 mx-4 mt-4 p-4 rounded-2xl border border-green-200">
            <Text className="text-sm font-semibold text-green-700 text-center">
              You saved ₹{discount} on this order!
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
                ₹{Math.round(total)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/checkout?tip=${tipAmount}`)}
              className="bg-purple-600 px-8 py-4 rounded-full"
            >
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
      {cartItems.length === 0 && !isLoading && (
        <View className="flex-1 items-center justify-center px-8">
          <ShoppingBag size={64} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
            Your cart is empty
          </Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Add items to get started with your order
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="bg-purple-600 px-8 py-4 rounded-full mt-6"
          >
            <Text className="text-base font-bold text-white">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
