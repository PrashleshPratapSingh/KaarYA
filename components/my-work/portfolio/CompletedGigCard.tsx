import { View, Text, Pressable, Share, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CompletedGig } from '../../../lib/types/mywork';
import { VibeBadge } from '../VibeBadge';

interface CompletedGigCardProps {
    gig: CompletedGig;
    onPressProfile?: () => void;
}

export function CompletedGigCard({ gig, onPressProfile }: CompletedGigCardProps) {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my completed project on KaarYA: "${gig.title}" for ${gig.clientName}! 🚀 #KaarYA #Hustle`,
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const formatDate = () => {
        const date = new Date(gig.completedDate);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            {/* Work Snippet */}
            <View
                className="bg-karya-yellow/10 rounded-xl p-5 mb-4 items-center justify-center"
                style={{ minHeight: 100 }}
            >
                <Text className="text-lg text-center font-semibold text-karya-black leading-relaxed">
                    {gig.workSnippet}
                </Text>
            </View>

            {/* Title & Profile Info Row */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-4">
                    <Text className="text-base font-extrabold text-karya-black mb-2 leading-tight">
                        {gig.title}
                    </Text>
                    {/* Badges */}
                    <View className="flex-row flex-wrap gap-2">
                        {gig.vibeBadges.map((badge, index) => (
                            <VibeBadge key={index} label={badge} />
                        ))}
                    </View>
                </View>

                {/* Small Profile Logo/Avatar - Trigger for Profile */}
                <Pressable
                    onPress={onPressProfile}
                    className="w-12 h-12 bg-karya-yellow rounded-2xl items-center justify-center border-2 border-karya-black overflow-hidden active:scale-95 shadow-sm"
                >
                    {gig.clientAvatar ? (
                        <Image source={{ uri: gig.clientAvatar }} className="w-full h-full" />
                    ) : (
                        <Feather name="user" size={24} color="#000" />
                    )}
                </Pressable>
            </View>

            <View className="h-[1px] bg-gray-100 w-full mb-3" />

            {/* Footer */}
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-xl font-extrabold text-green-600">
                        ₹{gig.amount.toLocaleString('en-IN')}
                    </Text>
                    <Text className="text-xs text-gray-400 font-medium">{formatDate()}</Text>
                </View>

                {gig.rating && (
                    <View className="flex-row items-center gap-4">
                        <Pressable
                            onPress={handleShare}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center active:scale-95"
                        >
                            <Feather name="share-2" size={18} color="#000" />
                        </Pressable>
                        <View className="flex-row items-center gap-1.5 bg-karya-yellow/20 px-3 py-1.5 rounded-full">
                            <Feather name="star" size={16} color="#F59E0B" />
                            <Text className="text-base font-extrabold text-karya-black">{gig.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
