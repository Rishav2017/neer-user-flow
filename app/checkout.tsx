import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  Check,
} from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  getAddresses,
  createOrder,
  createPaymentOrder,
  verifyPayment,
  Address,
} from '@/services/api';
import RazorpayCheckout from 'react-native-razorpay';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tip?: string }>();
  const { user } = useAuth();
  const { cartItems, cartTotal, cartCount, refreshCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const tipAmount = params.tip ? parseFloat(params.tip) : 0;
  const deliveryFee = 0;
  const totalAmount = cartTotal + tipAmount + deliveryFee;

  // Fetch addresses on focus (when coming back from add-address page)
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAddresses();
      const addressList = response.data || [];
      setAddresses(addressList);

      // Select default address or first address
      if (addressList.length > 0) {
        const defaultAddr = addressList.find((addr) => addr.is_default);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (!selectedAddress || !addressList.find(a => a.id === selectedAddress.id)) {
          setSelectedAddress(addressList[0]);
        }
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: Address): string => {
    const parts = [
      address.address_line,
      address.area_name,
      address.landmark,
      address.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Create order
      const orderResponse = await createOrder({
        delivery_address: formatAddress(selectedAddress),
      });

      const order = orderResponse.data;

      // Step 2: Create payment order
      const paymentResponse = await createPaymentOrder({
        order_id: order.id,
        payment_method: paymentMethod,
      });

      if (paymentMethod === 'cod') {
        // COD - Order placed successfully
        await refreshCart();
        Alert.alert(
          'Order Placed!',
          'Your order has been placed successfully. Pay on delivery.',
          [
            {
              text: 'View Order',
              onPress: () => router.replace(`/order-success?orderId=${order.id}`),
            },
          ]
        );
      } else {
        // Online Payment - Open Razorpay
        const paymentData = paymentResponse.data;

        const options = {
          description: 'QuickCart Express Order',
          image: 'https://your-logo-url.com/logo.png',
          currency: paymentData.currency || 'INR',
          key: paymentData.key_id,
          amount: paymentData.amount,
          name: 'QuickCart Express',
          order_id: paymentData.gateway_order_id,
          prefill: {
            email: user?.email || '',
            contact: user?.phone || '',
            name: user?.name || '',
          },
          theme: { color: '#A855F7' },
        };

        try {
          const razorpayResponse = await RazorpayCheckout.open(options);

          // Verify payment
          const verifyResponse = await verifyPayment({
            razorpay_order_id: paymentData.gateway_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
          });

          if (verifyResponse.data.status === 'paid') {
            await refreshCart();
            router.replace(`/order-success?orderId=${order.id}`);
          } else {
            Alert.alert('Payment Failed', 'Payment verification failed. Please try again.');
          }
        } catch (razorpayError: any) {
          console.error('Razorpay error:', razorpayError);
          Alert.alert(
            'Payment Cancelled',
            'Payment was cancelled or failed. Your order is saved. You can retry payment from orders.',
            [
              { text: 'OK', onPress: () => router.replace('/home') },
            ]
          );
        }
      }
    } catch (error: any) {
      console.error('Order error:', error);
      Alert.alert('Error', error.message || 'Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
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
          <Text className="text-xl font-bold text-gray-900">Checkout</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPin size={20} color="#A855F7" />
              <Text className="text-base font-semibold text-gray-900 ml-2">
                Delivery Address
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/add-address')}>
              <View className="flex-row items-center">
                <Plus size={18} color="#A855F7" />
                <Text className="text-purple-600 font-semibold text-sm ml-1">Add New</Text>
              </View>
            </TouchableOpacity>
          </View>

          {addresses.length === 0 ? (
            <TouchableOpacity
              onPress={() => router.push('/add-address')}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center"
            >
              <MapPin size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Add a delivery address</Text>
            </TouchableOpacity>
          ) : (
            <View className="gap-3">
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  onPress={() => setSelectedAddress(address)}
                  className={`p-4 rounded-xl border-2 ${
                    selectedAddress?.id === address.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="font-bold text-gray-900 capitalize">{address.label}</Text>
                        {address.is_default && (
                          <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                            <Text className="text-green-700 text-xs font-semibold">Default</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-800 text-sm font-medium">{address.receiver_name}</Text>
                      <Text className="text-gray-600 text-sm">{formatAddress(address)}</Text>
                      <Text className="text-gray-500 text-xs mt-1">{address.receiver_phone}</Text>
                    </View>
                    {selectedAddress?.id === address.id && (
                      <View className="bg-purple-500 rounded-full p-1">
                        <Check size={16} color="#fff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Payment Method Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <View className="flex-row items-center mb-4">
            <CreditCard size={20} color="#A855F7" />
            <Text className="text-base font-semibold text-gray-900 ml-2">Payment Method</Text>
          </View>

          <View className="gap-3">
            {/* Online Payment */}
            <TouchableOpacity
              onPress={() => setPaymentMethod('online')}
              className={`p-4 rounded-xl border-2 flex-row items-center ${
                paymentMethod === 'online'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  paymentMethod === 'online' ? 'bg-purple-500' : 'bg-gray-100'
                }`}
              >
                <CreditCard size={20} color={paymentMethod === 'online' ? '#fff' : '#6B7280'} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Pay Online</Text>
                <Text className="text-gray-500 text-sm">UPI, Cards, Net Banking, Wallets</Text>
              </View>
              {paymentMethod === 'online' && (
                <View className="bg-purple-500 rounded-full p-1">
                  <Check size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Cash on Delivery */}
            <TouchableOpacity
              onPress={() => setPaymentMethod('cod')}
              className={`p-4 rounded-xl border-2 flex-row items-center ${
                paymentMethod === 'cod'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  paymentMethod === 'cod' ? 'bg-purple-500' : 'bg-gray-100'
                }`}
              >
                <Banknote size={20} color={paymentMethod === 'cod' ? '#fff' : '#6B7280'} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Cash on Delivery</Text>
                <Text className="text-gray-500 text-sm">Pay when your order arrives</Text>
              </View>
              {paymentMethod === 'cod' && (
                <View className="bg-purple-500 rounded-full p-1">
                  <Check size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl">
          <Text className="text-base font-semibold text-gray-900 mb-4">Order Summary</Text>

          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Items ({cartCount})</Text>
              <Text className="font-semibold text-gray-900">₹{Math.round(cartTotal)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className="font-semibold text-green-600">FREE</Text>
            </View>

            {tipAmount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Delivery Partner Tip</Text>
                <Text className="font-semibold text-gray-900">₹{tipAmount}</Text>
              </View>
            )}

            <View className="border-t border-gray-200 pt-3 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-base font-bold text-gray-900">Total</Text>
                <Text className="text-lg font-bold text-purple-600">
                  ₹{Math.round(totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Checkout Button */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xs text-gray-500">Total Amount</Text>
            <Text className="text-2xl font-bold text-purple-600">
              ₹{Math.round(totalAmount)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={processing || !selectedAddress}
            className={`px-8 py-4 rounded-full ${
              processing || !selectedAddress ? 'bg-gray-400' : 'bg-purple-600'
            }`}
          >
            {processing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-base font-bold text-white">
                {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 text-center">
          By placing this order, you agree to our Terms & Conditions
        </Text>
      </View>
    </View>
  );
}
