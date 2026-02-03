import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../types/messaging';
import { MessageColors, BrandColors } from '../../constants/Colors';

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
    senderName?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isOwnMessage,
    senderName,
}) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const playAudio = async () => {
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    // Simple play - stopAsync() handles the rewind
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else if (message.mediaUrl) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: message.mediaUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate(async (status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        setIsPlaying(false);
                        // stopAsync resets: pos -> 0, playing -> false
                        await newSound.stopAsync();
                    }
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    React.useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const renderReactions = () => {
        if (!message.reactions || Object.keys(message.reactions).length === 0) return null;
        const emojis = Array.from(new Set(Object.values(message.reactions)));
        return (
            <View style={styles.reactionsContainer}>
                {emojis.map((emoji, index) => (
                    <View key={index} style={styles.reactionPill}>
                        <Text style={{ fontSize: 14 }}>{emoji}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderTextMessage = () => (
        <View style={{ marginBottom: message.reactions ? 10 : 0 }}>
            <View
                style={[
                    styles.bubble,
                    isOwnMessage ? styles.ownBubble : styles.otherBubble,
                ]}
            >
                {!isOwnMessage && senderName && (
                    <Text style={styles.senderName}>{senderName}</Text>
                )}
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.timestamp}>{formatTime(message.createdAt)}</Text>
            </View>
            {renderReactions()}
        </View>
    );

    const renderAudioMessage = () => (
        <View style={{ marginBottom: message.reactions ? 10 : 0 }}>
            <View
                style={[
                    styles.bubble,
                    styles.audioBubble,
                    isOwnMessage ? styles.ownBubble : styles.otherBubble,
                ]}
            >
                {!isOwnMessage && senderName && (
                    <Text style={styles.senderName}>{senderName}</Text>
                )}
                <View style={styles.audioContentWrapper}>
                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={playAudio}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={18}
                            color={BrandColors.white}
                            style={{ marginLeft: isPlaying ? 0 : 2 }}
                        />
                    </TouchableOpacity>

                    <View style={styles.audioInfo}>
                        <View style={styles.waveform}>
                            {[...Array(24)].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.waveBar,
                                        {
                                            height: Math.max(8, Math.random() * 24 + 4),
                                            backgroundColor: isOwnMessage ? 'rgba(0,0,0,0.4)' : BrandColors.purple,
                                            opacity: isPlaying && i % 2 === 0 ? 0.5 : 1
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={styles.durationRow}>
                            <Text style={styles.duration}>{formatDuration(message.duration)}</Text>
                            <Text style={styles.audioTimestamp}>{formatTime(message.createdAt)}</Text>
                        </View>
                    </View>
                </View>
            </View>
            {renderReactions()}
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                isOwnMessage ? styles.ownContainer : styles.otherContainer,
            ]}
        >
            {message.type === 'audio' ? renderAudioMessage() : renderTextMessage()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        marginHorizontal: 16,
        maxWidth: '80%',
    },
    ownContainer: {
        alignSelf: 'flex-end',
    },
    otherContainer: {
        alignSelf: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    ownBubble: {
        backgroundColor: MessageColors.senderBg,
        borderBottomRightRadius: 6,
    },
    otherBubble: {
        backgroundColor: MessageColors.receiverBg,
        borderBottomLeftRadius: 6,
        // Removed border for cleaner look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    senderName: {
        fontSize: 11,
        fontWeight: '600',
        color: BrandColors.mediumGray,
        marginBottom: 5,
        letterSpacing: 0.3,
    },
    messageText: {
        fontSize: 15,
        color: BrandColors.black,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.4)',
        marginTop: 6,
        textAlign: 'right',
        fontWeight: '500',
    },
    audioBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        minWidth: 240,
    },
    audioContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: BrandColors.purple,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        shadowColor: BrandColors.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    audioInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    waveform: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 28,
        gap: 3,
        marginBottom: 6,
    },
    waveBar: {
        width: 3,
        borderRadius: 2,
    },
    durationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    duration: {
        fontSize: 11,
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    audioTimestamp: {
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.4)',
        fontWeight: '500',
    },
    reactionsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 10, // Moved to LEFT side
        gap: 4,
        zIndex: 10,
    },
    reactionPill: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8, // Slightly more padding
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
});
