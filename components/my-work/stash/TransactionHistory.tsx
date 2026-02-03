import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReceiptTransaction } from './ReceiptTransaction';
import { Transaction } from '../../../lib/types/mywork';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    return (
        <View className="bg-white rounded-2xl overflow-hidden">
            <ScrollView className="max-h-80">
                {transactions.map((transaction, index) => (
                    <View key={transaction.id}>
                        <ReceiptTransaction transaction={transaction} />
                        {index < transactions.length - 1 && (
                            <View className="h-[1px] bg-gray-100 mx-4" />
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
