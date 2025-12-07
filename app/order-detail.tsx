import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  MessageCircle,
  ChefHat,
  CircleDot,
} from 'lucide-react-native';
import { getOrder, Order } from '@/services/api';

const ORDER_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_INDEX: Record<string, number> = {
  placed: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

export default function OrderDetailScreen() {
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
      setLoading(true);
      const response = await getOrder(orderId!);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return STATUS_INDEX[order.status] ?? 0;
  };

  const getEstimatedTime = () => {
    if (!order) return '';
    const currentStep = getCurrentStepIndex();

    if (order.status === 'delivered') return 'Delivered';
    if (order.status === 'cancelled') return 'Cancelled';
    if (currentStep === 3) return '5-10 mins';
    if (currentStep === 2) return '10-15 mins';
    if (currentStep === 1) return '15-20 mins';
    return '20-25 mins';
  };

  if (loading) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
        <Text className="text-gray-600 mt-4">Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <Text className="text-gray-600">Order not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-purple-600 px-6 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStepIndex = getCurrentStepIndex();
  const isCancelled = order.status === 'cancelled';

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-purple-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Track Order</Text>
        </View>

        {/* Order ID & Status */}
        <View className="bg-white/20 rounded-2xl p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white/80 text-sm">Order ID</Text>
              <Text className="text-white font-bold text-lg">
                #{order.id.slice(0, 8).toUpperCase()}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white/80 text-sm">Estimated Delivery</Text>
              <Text className="text-white font-bold text-lg">{getEstimatedTime()}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Tracking Timeline */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-base font-bold text-gray-900 mb-4">Order Status</Text>

          {isCancelled ? (
            <View className="flex-row items-center p-4 bg-red-50 rounded-xl">
              <XCircle size={24} color="#EF4444" />
              <View className="ml-3">
                <Text className="text-red-600 font-bold">Order Cancelled</Text>
                <Text className="text-red-500 text-sm">
                  This order has been cancelled
                </Text>
              </View>
            </View>
          ) : (
            <View className="pl-2">
              {ORDER_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isLast = index === ORDER_STEPS.length - 1;

                return (
                  <View key={step.key} className="flex-row">
                    {/* Timeline Line & Dot */}
                    <View className="items-center mr-4">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          isCompleted ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        {isCurrent ? (
                          <CircleDot size={20} color="#fff" />
                        ) : (
                          <StepIcon size={20} color={isCompleted ? '#fff' : '#9CA3AF'} />
                        )}
                      </View>
                      {!isLast && (
                        <View
                          className={`w-1 h-12 ${
                            index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </View>

                    {/* Step Content */}
                    <View className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                      <Text
                        className={`font-semibold ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </Text>
                      {isCurrent && (
                        <Text className="text-purple-600 text-sm mt-1">In progress...</Text>
                      )}
                      {isCompleted && !isCurrent && (
                        <Text className="text-green-600 text-sm mt-1">Completed</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Delivery Address */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <View className="flex-row items-center mb-3">
            <MapPin size={20} color="#A855F7" />
            <Text className="text-base font-bold text-gray-900 ml-2">Delivery Address</Text>
          </View>
          <Text className="text-gray-600">{order.delivery_address}</Text>
        </View>

        {/* Order Items */}
        {order.order_items && order.order_items.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
            <Text className="text-base font-bold text-gray-900 mb-4">Order Items</Text>

            <View className="gap-3">
              {order.order_items.map((item) => (
                <View key={item.id} className="flex-row items-center">
                  {item.product?.image_url ? (
                    <Image
                      source={{ uri: item.product.image_url }}
                      className="w-14 h-14 rounded-xl bg-gray-100"
                    />
                  ) : (
                    <View className="w-14 h-14 rounded-xl bg-purple-100 items-center justify-center">
                      <Package size={24} color="#A855F7" />
                    </View>
                  )}
                  <View className="flex-1 ml-3">
                    <Text className="font-semibold text-gray-900" numberOfLines={1}>
                      {item.product?.name || 'Product'}
                    </Text>
                    <Text className="text-gray-500 text-sm">Qty: {item.quantity}</Text>
                  </View>
                  <Text className="font-bold text-gray-900">
                    ₹{Math.round(parseFloat(item.price) * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total */}
            <View className="border-t border-gray-100 mt-4 pt-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Amount</Text>
                <Text className="text-lg font-bold text-purple-600">
                  ₹{Math.round(parseFloat(order.total_amount))}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Order Time */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <View className="flex-row items-center">
            <Clock size={20} color="#A855F7" />
            <Text className="text-base font-bold text-gray-900 ml-2">Order Time</Text>
          </View>
          <Text className="text-gray-600 mt-2">{formatDate(order.created_at)}</Text>
        </View>

        {/* Help Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
          <Text className="text-base font-bold text-gray-900 mb-4">Need Help?</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 bg-purple-50 rounded-xl">
              <Phone size={18} color="#A855F7" />
              <Text className="text-purple-600 font-semibold ml-2">Call Support</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 bg-purple-50 rounded-xl">
              <MessageCircle size={18} color="#A855F7" />
              <Text className="text-purple-600 font-semibold ml-2">Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Bottom Action */}
      {order.status === 'delivered' && (
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            className="bg-purple-600 py-4 rounded-full"
          >
            <Text className="text-white font-bold text-center text-base">
              Order Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
