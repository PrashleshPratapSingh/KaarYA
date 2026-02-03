import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '../../constants/Colors';

interface AudioRecorderProps {
    onRecordingComplete: (uri: string, duration: number) => void;
    onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
    onRecordingComplete,
    onCancel,
}) => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const pulseAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        startRecording();

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        let interval: number;
        if (recording && !isPaused) {
            interval = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000) as unknown as number;
        }
        return () => clearInterval(interval);
    }, [recording, isPaused]);

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                console.error('Permission to access microphone is required!');
                onCancel();
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(newRecording);
        } catch (err) {
            console.error('Failed to start recording', err);
            onCancel();
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (uri) {
                onRecordingComplete(uri, recordingDuration);
            }
            setRecording(null);
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const cancelRecording = async () => {
        if (recording) {
            await recording.stopAndUnloadAsync();
            setRecording(null);
        }
        onCancel();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.recordingBar}>
                <TouchableOpacity
                    onPress={cancelRecording}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color={BrandColors.black} />
                </TouchableOpacity>

                <Animated.View
                    style={[
                        styles.recordingIndicator,
                        { transform: [{ scale: pulseAnim }] },
                    ]}
                >
                    <View style={styles.redDot} />
                </Animated.View>

                <Text style={styles.duration}>{formatDuration(recordingDuration)}</Text>

                <View style={styles.waveformContainer}>
                    {[...Array(25)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.waveBar,
                                { height: Math.random() * 30 + 10 },
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    onPress={stopRecording}
                    style={styles.sendButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="send" size={20} color={BrandColors.white} />
                </TouchableOpacity>
            </View>

            <Text style={styles.hint}>Slide to cancel • Tap to send</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: BrandColors.cream,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    recordingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BrandColors.white,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: BrandColors.black,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    cancelButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: BrandColors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recordingIndicator: {
        marginRight: 8,
    },
    redDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E74C3C',
    },
    duration: {
        fontSize: 14,
        fontWeight: '600',
        color: BrandColors.black,
        marginRight: 12,
        minWidth: 45,
    },
    waveformContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        gap: 2,
    },
    waveBar: {
        width: 3,
        backgroundColor: BrandColors.purple,
        borderRadius: 2,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: BrandColors.purple,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    hint: {
        fontSize: 11,
        color: BrandColors.mediumGray,
        textAlign: 'center',
        marginTop: 8,
    },
});
