import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
} from 'lucide-react-native';
import { getOrders, Order } from '@/services/api';

const ORDER_STATUSES = {
  placed: { label: 'Order Placed', color: '#F59E0B', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#3B82F6', icon: CheckCircle },
  preparing: { label: 'Preparing', color: '#8B5CF6', icon: Package },
  out_for_delivery: { label: 'Out for Delivery', color: '#10B981', icon: Truck },
  delivered: { label: 'Delivered', color: '#10B981', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: XCircle },
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders({ per_page: 50 });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
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

  const getStatusInfo = (status: Order['status']) => {
    return ORDER_STATUSES[status] || ORDER_STATUSES.placed;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
        <Text className="text-gray-600 mt-4">Loading orders...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">My Orders</Text>
        </View>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-purple-100 rounded-full p-6 mb-4">
            <ShoppingBag size={48} color="#A855F7" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">No orders yet</Text>
          <Text className="text-gray-500 text-center mb-6">
            Looks like you haven't placed any orders yet. Start shopping to see your orders here.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/home')}
            className="bg-purple-600 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-bold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#A855F7']} />
          }
        >
          <View className="p-4 gap-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => router.push(`/order-detail?orderId=${order.id}`)}
                  className="bg-white rounded-2xl p-4"
                >
                  {/* Order Header */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Package size={20} color="#A855F7" />
                      <Text className="font-bold text-gray-900 ml-2">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Text>
                    </View>
                    <View
                      className="flex-row items-center px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${statusInfo.color}15` }}
                    >
                      <StatusIcon size={14} color={statusInfo.color} />
                      <Text
                        className="text-xs font-semibold ml-1"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>

                  {/* Order Details */}
                  <View className="mb-3">
                    <Text className="text-gray-500 text-sm" numberOfLines={1}>
                      {order.delivery_address}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {formatDate(order.created_at)}
                    </Text>
                  </View>

                  {/* Order Footer */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <Text className="text-lg font-bold text-purple-600">
                      ₹{Math.round(parseFloat(order.total_amount))}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-purple-600 font-semibold text-sm mr-1">
                        Track Order
                      </Text>
                      <ChevronRight size={18} color="#A855F7" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="h-8" />
        </ScrollView>
      )}
    </View>
  );
}
