import React from 'react';
import { View, Text } from 'react-native';
import { Transaction } from '../../../lib/types/mywork';

interface ReceiptTransactionProps {
    transaction: Transaction;
}

export function ReceiptTransaction({ transaction }: ReceiptTransactionProps) {
    const formatDate = () => {
        const date = new Date(transaction.date);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const isCredit = transaction.type === 'credit';

    return (
        <View className="py-4 px-4 flex-row items-center justify-between">
            <View className="flex-1">
                <Text className="text-sm font-bold text-karya-black" numberOfLines={1}>
                    {transaction.description}
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                    {formatDate()}
                </Text>
            </View>

            <Text className={`text-base font-extrabold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
            </Text>
        </View>
    );
}
