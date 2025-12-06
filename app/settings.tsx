import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  FileText, 
  LogOut,
  ChevronRight,
  Moon,
  Smartphone
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { id: 1, icon: User, label: 'Profile Information', route: '/profile' },
        { id: 2, icon: MapPin, label: 'Saved Addresses', route: '/addresses' },
        { id: 3, icon: CreditCard, label: 'Payment Methods', route: '/payments' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 4, icon: Bell, label: 'Notifications', toggle: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { id: 5, icon: Moon, label: 'Dark Mode', toggle: true, value: darkModeEnabled, onToggle: setDarkModeEnabled },
        { id: 6, icon: Globe, label: 'Language', value: 'English', route: '/language' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 7, icon: HelpCircle, label: 'Help Center', route: '/help' },
        { id: 8, icon: Smartphone, label: 'Contact Us', route: '/contact' },
        { id: 9, icon: FileText, label: 'Terms & Conditions', route: '/terms' },
        { id: 10, icon: Shield, label: 'Privacy Policy', route: '/privacy' },
      ]
    }
  ];

  const handleLogout = () => {
    // Mock logout functionality
    console.log('User logged out');
    router.push('/');
  };

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-purple-500 pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-4"
            accessibilityLabel="Go back"
          >
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1">Settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-2xl shadow-sm">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center">
              <User color="#A855F7" size={32} />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-gray-900 text-lg font-bold">John Doe</Text>
              <Text className="text-gray-500 text-sm">john.doe@email.com</Text>
              <Text className="text-gray-500 text-sm">+1 234 567 8900</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/profile')}
              accessibilityLabel="Edit profile"
            >
              <ChevronRight color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mt-6">
            <Text className="text-gray-500 text-sm font-semibold px-4 mb-3 uppercase">
              {section.title}
            </Text>
            <View className="bg-white mx-4 rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <TouchableOpacity
                    onPress={() => !item.toggle && item.route && router.push(item.route)}
                    disabled={item.toggle}
                    className="flex-row items-center px-4 py-4"
                    accessibilityLabel={item.label}
                  >
                    <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center">
                      <item.icon color="#A855F7" size={20} />
                    </View>
                    <Text className="flex-1 text-gray-900 text-base ml-3">{item.label}</Text>
                    
                    {item.toggle ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#D1D5DB', true: '#A855F7' }}
                        thumbColor="#FFFFFF"
                      />
                    ) : item.value ? (
                      <View className="flex-row items-center">
                        <Text className="text-gray-500 text-sm mr-2">{item.value}</Text>
                        <ChevronRight color="#6B7280" size={20} />
                      </View>
                    ) : (
                      <ChevronRight color="#6B7280" size={20} />
                    )}
                  </TouchableOpacity>
                  {itemIndex < section.items.length - 1 && (
                    <View className="h-px bg-gray-100 ml-16" />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-gray-400 text-xs">QuickCart Express</Text>
          <Text className="text-gray-400 text-xs mt-1">Version 1.0.0</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white mx-4 mt-4 mb-8 p-4 rounded-2xl shadow-sm flex-row items-center justify-center"
          accessibilityLabel="Logout"
        >
          <LogOut color="#EF4444" size={20} />
          <Text className="text-red-500 text-base font-semibold ml-2">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}