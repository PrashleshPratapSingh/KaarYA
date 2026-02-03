import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FundsBreakdownProps {
    pending: number;
    available: number;
}

export function FundsBreakdown({ pending, available }: FundsBreakdownProps) {
    return (
        <View className="flex-row gap-3">
            {/* Pending */}
            <View className="flex-1 bg-white border-2 border-gray-300 p-4">
                <View className="flex-row items-center gap-2 mb-2">
                    <Feather name="clock" size={18} color="#6B7280" />
                    <Text className="text-xs font-bold text-gray-700">PENDING</Text>
                </View>
                <Text className="text-2xl font-bold text-karya-black">
                    ₹{pending.toLocaleString('en-IN')}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">From 3 gigs</Text>
            </View>

            {/* Available */}
            <View className="flex-1 bg-white border-2 border-gray-300 p-4">
                <View className="flex-row items-center gap-2 mb-2">
                    <Feather name="check-circle" size={18} color="#10B981" />
                    <Text className="text-xs font-bold text-green-700">AVAILABLE</Text>
                </View>
                <Text className="text-2xl font-bold text-green-600">
                    ₹{available.toLocaleString('en-IN')}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">Ready to withdraw</Text>
            </View>
        </View>
    );
}
