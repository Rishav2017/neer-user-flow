import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Package, MapPin, Clock } from 'lucide-react-native';
import { getOrder, Order } from '@/services/api';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await getOrder(orderId!);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        {/* Success Animation */}
        <View className="bg-green-100 rounded-full p-6 mb-6">
          <CheckCircle size={64} color="#10B981" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
          Order Placed Successfully!
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Your order has been confirmed and will be delivered soon.
        </Text>

        {order && (
          <View className="bg-purple-50 w-full rounded-2xl p-6 mb-8">
            {/* Order ID */}
            <View className="flex-row items-center mb-4">
              <Package size={20} color="#A855F7" />
              <View className="ml-3">
                <Text className="text-xs text-gray-500">Order ID</Text>
                <Text className="font-semibold text-gray-900">
                  #{order.id.slice(0, 8).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View className="flex-row items-start mb-4">
              <MapPin size={20} color="#A855F7" />
              <View className="ml-3 flex-1">
                <Text className="text-xs text-gray-500">Delivering to</Text>
                <Text className="font-semibold text-gray-900" numberOfLines={2}>
                  {order.delivery_address}
                </Text>
              </View>
            </View>

            {/* Estimated Time */}
            <View className="flex-row items-center">
              <Clock size={20} color="#A855F7" />
              <View className="ml-3">
                <Text className="text-xs text-gray-500">Estimated Delivery</Text>
                <Text className="font-semibold text-gray-900">15-20 minutes</Text>
              </View>
            </View>

            {/* Order Total */}
            <View className="border-t border-purple-200 mt-4 pt-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Amount</Text>
                <Text className="text-lg font-bold text-purple-600">
                  ₹{Math.round(parseFloat(order.total_amount))}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="w-full gap-3">
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            className="bg-purple-600 py-4 rounded-full"
          >
            <Text className="text-white font-bold text-center text-base">
              Continue Shopping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/orders')}
            className="border-2 border-purple-600 py-4 rounded-full"
          >
            <Text className="text-purple-600 font-bold text-center text-base">
              Track Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
