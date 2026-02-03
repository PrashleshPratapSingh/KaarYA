import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BrutalistCard } from '../BrutalistCard';
import { CountdownTimer } from '../CountdownTimer';
import { ProgressBar } from '../ProgressBar';
import { DeliverableUploadButton } from './DeliverableUploadButton';
import { ChatBubble } from './ChatBubble';
import { Gig } from '../../../lib/types/mywork';

interface GigCardProps {
    gig: Gig;
    onPress?: () => void;
}

export function GigCard({ gig, onPress }: GigCardProps) {
    const { title, clientName, amount, deadline, progress, unreadMessages } = gig;

    return (
        <Pressable onPress={onPress}>
            <BrutalistCard backgroundColor="white" className="p-5 mb-4">
                {/* Header */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 pr-3">
                        <Text className="text-lg font-bold text-karya-black tracking-tight mb-1">
                            {title}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Client: {clientName}
                        </Text>
                    </View>
                    <View className="bg-karya-yellow border-2 border-karya-black px-3 py-1">
                        <Text className="text-sm font-bold text-karya-black">
                            ₹{amount.toLocaleString('en-IN')}
                        </Text>
                    </View>
                </View>

                {/* Countdown Timer */}
                <CountdownTimer deadline={deadline} className="mb-4" />

                {/* Progress Bar */}
                <ProgressBar
                    percentage={progress}
                    label="PROJECT COMMITMENT"
                    className="mb-4"
                />

                {/* Action Row */}
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <DeliverableUploadButton gigId={gig.id} />
                    </View>
                    <ChatBubble unreadCount={unreadMessages} gigId={gig.id} />
                </View>
            </BrutalistCard>
        </Pressable>
    );
}
