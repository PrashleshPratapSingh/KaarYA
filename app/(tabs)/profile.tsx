import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
    return (
        <View className="flex-1 bg-[#FFD700]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full border-2 border-black bg-white items-center justify-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 2, height: 2 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 5
                        }}
                    >
                        <Ionicons name="arrow-back" size={20} color="black" />
                    </TouchableOpacity>

                    <View
                        className="bg-black px-4 py-2 rounded-lg"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 3, height: 3 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 5
                        }}
                    >
                        <Text className="text-[#FFD700] font-black text-sm tracking-wider">IDENTITY FLEX</Text>
                    </View>

                    <TouchableOpacity
                        className="w-10 h-10 rounded-lg border-2 border-black bg-[#FFD700] items-center justify-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 2, height: 2 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 5
                        }}
                    >
                        <Ionicons name="settings-sharp" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Profile Avatar Section */}
                <View className="items-center mt-4">
                    <View className="relative">
                        <View
                            className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gray-300"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 4, height: 4 },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                elevation: 8
                            }}
                        >
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        {/* Verified Badge */}
                        <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00BFFF] border-2 border-black items-center justify-center">
                            <Ionicons name="checkmark" size={18} color="white" />
                        </View>
                    </View>

                    {/* Name */}
                    <Text className="text-2xl font-black text-black mt-4 tracking-wide">ARIA SINGH</Text>

                    {/* Handle & Status Pills */}
                    <View className="flex-row items-center gap-2 mt-3">
                        <View className="bg-white border-2 border-black rounded-full px-4 py-1.5">
                            <Text className="text-black font-bold text-xs">@ARIADESIGNS</Text>
                        </View>
                        <View className="bg-white border-2 border-black rounded-full px-4 py-1.5 flex-row items-center gap-1.5">
                            <View className="w-2 h-2 rounded-full bg-[#00FF00]" />
                            <Text className="text-black font-bold text-xs">OPEN TO WORK</Text>
                        </View>
                    </View>
                </View>

                {/* Hustle Stats */}
                <View className="flex-row justify-center gap-3 mt-8 px-4">
                    {/* Level Tile */}
                    <View
                        className="bg-black border-2 border-black rounded-2xl px-5 py-4 items-center min-w-[100px]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 3, height: 3 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 5
                        }}
                    >
                        <FontAwesome5 name="trophy" size={22} color="#FFD700" />
                        <Text className="text-white font-black text-lg mt-1">Lvl 42</Text>
                        <Text className="text-gray-400 font-bold text-xs">MASTER</Text>
                    </View>

                    {/* Earnings Tile */}
                    <View
                        className="bg-[#ADFF2F] border-2 border-black rounded-2xl px-5 py-4 items-center min-w-[100px]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 3, height: 3 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 5
                        }}
                    >
                        <MaterialCommunityIcons name="cash-multiple" size={24} color="black" />
                        <Text className="text-black font-black text-lg mt-1">₹85k</Text>
                        <Text className="text-black/60 font-bold text-xs">EARNED</Text>
                    </View>
                </View>

                {/* Skill Stash */}
                <View className="mt-8 px-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-black font-black text-lg tracking-wide">SKILL STASH</Text>
                        <TouchableOpacity>
                            <Text className="text-black font-bold text-sm underline">Edit Stash</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                        {/* Poster Design Skill */}
                        <View className="relative">
                            <View
                                className="bg-[#FF69B4] border-2 border-black rounded-full px-4 py-2"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 1,
                                    shadowRadius: 0,
                                    elevation: 3
                                }}
                            >
                                <Text className="text-black font-bold text-sm">Poster Design</Text>
                            </View>
                            <View className="absolute -top-2 -right-1 bg-[#90EE90] border border-black rounded-full px-1.5 py-0.5">
                                <Text className="text-black text-[10px] font-bold">+12</Text>
                            </View>
                        </View>

                        {/* Typography Skill */}
                        <View className="relative">
                            <View
                                className="bg-[#ADFF2F] border-2 border-black rounded-full px-4 py-2"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 1,
                                    shadowRadius: 0,
                                    elevation: 3
                                }}
                            >
                                <Text className="text-black font-bold text-sm">Typography</Text>
                            </View>
                            <View className="absolute -top-2 -right-1 bg-[#90EE90] border border-black rounded-full px-1.5 py-0.5">
                                <Text className="text-black text-[10px] font-bold">+8</Text>
                            </View>
                        </View>

                        {/* Figma Skill */}
                        <View className="relative">
                            <View
                                className="bg-[#00FFFF] border-2 border-black rounded-full px-4 py-2"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 1,
                                    shadowRadius: 0,
                                    elevation: 3
                                }}
                            >
                                <Text className="text-black font-bold text-sm">Figma</Text>
                            </View>
                        </View>

                        {/* Motion Skill */}
                        <View className="relative">
                            <View
                                className="bg-white border-2 border-black rounded-full px-4 py-2"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 2, height: 2 },
                                    shadowOpacity: 1,
                                    shadowRadius: 0,
                                    elevation: 3
                                }}
                            >
                                <Text className="text-black font-bold text-sm">Motion</Text>
                            </View>
                            <View className="absolute -top-2 -right-1 bg-[#90EE90] border border-black rounded-full px-1.5 py-0.5">
                                <Text className="text-black text-[10px] font-bold">+5</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Your Player Card */}
                <View className="mt-8 px-4">
                    <View className="flex-row items-center gap-2 mb-3">
                        <MaterialCommunityIcons name="fire" size={20} color="black" />
                        <Text className="text-black font-black text-lg tracking-wide">YOUR PLAYER CARD</Text>
                    </View>

                    <LinearGradient
                        colors={['#E8F5E9', '#F0FFF0', '#FFFACD', '#FAFAD2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-2xl border-2 border-black p-5 min-h-[140px]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 8
                        }}
                    >
                        {/* Dot Pattern Overlay */}
                        <View className="absolute inset-0 opacity-10">
                            {[...Array(10)].map((_, row) => (
                                <View key={row} className="flex-row justify-around py-1">
                                    {[...Array(15)].map((_, col) => (
                                        <View key={col} className="w-1 h-1 rounded-full bg-gray-400" />
                                    ))}
                                </View>
                            ))}
                        </View>

                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className="text-black font-black text-xl italic tracking-wide">KARYA</Text>
                                <Text className="text-black/30 text-[8px] font-bold">®</Text>
                            </View>
                            <View className="bg-black rounded-lg px-2.5 py-1">
                                <Text className="text-white font-bold text-[10px]">Gen-Z Elite</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-end mt-auto pt-8">
                            <View>
                                <Text className="text-black/50 text-xs font-bold">RATING</Text>
                                <View className="flex-row items-center gap-1 mt-1">
                                    {[1, 2, 3, 4].map((star) => (
                                        <Ionicons key={star} name="star" size={12} color="black" />
                                    ))}
                                    <Ionicons name="star-half" size={12} color="black" />
                                </View>
                            </View>
                            <Text className="text-black font-black text-5xl">4.9</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Share My Card Button */}
                <View className="px-4 mt-6">
                    <TouchableOpacity
                        className="bg-black border-2 border-black rounded-2xl py-4 flex-row items-center justify-center gap-2"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            elevation: 8
                        }}
                    >
                        <Feather name="upload" size={20} color="white" />
                        <Text className="text-white font-black text-base tracking-wider">SHARE MY CARD</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
