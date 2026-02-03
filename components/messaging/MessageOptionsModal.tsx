import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BrandColors, UIColors } from '../../constants/Colors';
import { Message, REACTION_EMOJIS } from '../../types/messaging';

interface MessageOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    message: Message | null;
    isOwnMessage: boolean;
    onReply: (message: Message) => void;
    onCopy: (message: Message) => void;
    onDelete: (message: Message) => void;
    onReact: (message: Message, emoji: string) => void;
}

const { width } = Dimensions.get('window');

export const MessageOptionsModal: React.FC<MessageOptionsModalProps> = ({
    visible,
    onClose,
    message,
    isOwnMessage,
    onReply,
    onCopy,
    onDelete,
    onReact,
}) => {
    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (visible) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                stiffness: 90,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!message) return null;

    const handleAction = (action: () => void) => {
        Haptics.selectionAsync();
        onClose();
        // slight delay to allow modal to close smoothly
        setTimeout(action, 100);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.sheetContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Handle Bar */}
                    <View style={styles.handleBar} />

                    {/* Reactions Strip */}
                    <View style={styles.reactionsContainer}>
                        {REACTION_EMOJIS.map((emoji, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.reactionButton}
                                onPress={() => handleAction(() => onReact(message, emoji))}
                            >
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* Actions List */}
                    <View style={styles.actionsList}>
                        <TouchableOpacity
                            style={styles.actionItem}
                            onPress={() => handleAction(() => onReply(message))}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#E8EAFF' }]}>
                                <Ionicons name="arrow-undo" size={20} color={BrandColors.purple} />
                            </View>
                            <Text style={styles.actionText}>Reply</Text>
                        </TouchableOpacity>

                        {message.text && (
                            <TouchableOpacity
                                style={styles.actionItem}
                                onPress={() => handleAction(() => onCopy(message))}
                            >
                                <View style={[styles.iconBox, { backgroundColor: '#FFF9E6' }]}>
                                    <Ionicons name="copy-outline" size={20} color={BrandColors.black} />
                                </View>
                                <Text style={styles.actionText}>Copy</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.actionItem} onPress={() => { }}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0F2F5' }]}>
                                <Ionicons name="arrow-forward" size={20} color={BrandColors.black} />
                            </View>
                            <Text style={styles.actionText}>Forward</Text>
                        </TouchableOpacity>

                        {isOwnMessage ? (
                            <TouchableOpacity
                                style={styles.actionItem}
                                onPress={() => handleAction(() => onDelete(message))}
                            >
                                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                </View>
                                <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.actionItem} onPress={() => { }}>
                                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                                    <Ionicons name="flag-outline" size={20} color="#FF3B30" />
                                </View>
                                <Text style={[styles.actionText, { color: '#FF3B30' }]}>Report</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        paddingTop: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    reactionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    reactionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    emojiText: {
        fontSize: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
    },
    actionsList: {
        gap: 16,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
});
