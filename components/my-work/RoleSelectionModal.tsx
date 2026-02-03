import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { UserRole } from '../../lib/types/mywork';

interface RoleSelectionModalProps {
    visible: boolean;
    onSelectRole: (role: UserRole) => void;
}

export function RoleSelectionModal({ visible, onSelectRole }: RoleSelectionModalProps) {
    const handleRoleSelect = async (role: UserRole) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelectRole(role);
    };

    return (
        <Modal visible={visible} animationType="slide" statusBarTranslucent>
            <View className="flex-1 bg-karya-yellow px-8 justify-center">
                <View className="mb-12">
                    <View className="bg-black/10 self-center px-4 py-1 rounded-full mb-6">
                        <Text className="text-[10px] font-bold uppercase tracking-widest text-black/60">Select Your Path</Text>
                    </View>
                    <Text className="text-4xl font-extrabold text-center text-karya-black mb-2 leading-tight">
                        Ready to Start?
                    </Text>
                    <Text className="text-center text-karya-black/60 font-medium">
                        Choose your role in the ecosystem.
                    </Text>
                </View>

                <View className="gap-6">
                    {/* Client Option */}
                    <Pressable
                        onPress={() => handleRoleSelect('client')}
                        className="bg-white rounded-3xl p-6 flex-row items-center gap-5 shadow-lg shadow-black/5"
                        style={{ elevation: 5 }}
                    >
                        <View className="bg-blue-50 w-16 h-16 rounded-2xl items-center justify-center">
                            <Feather name="briefcase" size={24} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xl font-extrabold text-gray-900">Client</Text>
                            <Text className="text-xs text-gray-500 font-medium mt-1">Launch a Micro-Gig</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="#CBD5E1" />
                    </Pressable>

                    {/* Executor Option */}
                    <Pressable
                        onPress={() => handleRoleSelect('executor')}
                        className="bg-white rounded-3xl p-6 flex-row items-center gap-5 shadow-lg shadow-black/5"
                        style={{ elevation: 5 }}
                    >
                        <View className="bg-green-50 w-16 h-16 rounded-2xl items-center justify-center">
                            <Feather name="zap" size={24} color="#10B981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xl font-extrabold text-gray-900">Executor</Text>
                            <Text className="text-xs text-gray-500 font-medium mt-1">Earn with Precision</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="#CBD5E1" />
                    </Pressable>
                </View>

                <View className="absolute bottom-12 left-0 right-0 items-center">
                    <Text className="text-[10px] font-bold text-karya-black/40 uppercase tracking-widest mb-6">Premium Micro-Gig Ecosystem</Text>
                    <Pressable className="bg-white px-8 py-3 rounded-full shadow-sm">
                        <Text className="text-xs font-bold text-gray-400">BACK TO HOME</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
