import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Text,
    Modal,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { BrandColors, UIColors } from '../../constants/Colors';
import { AudioRecorder } from './AudioRecorder';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    onSendAudio: (uri: string, duration: number) => void;
    onAttachFile?: (uri: string, type: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    onSendAudio,
    onAttachFile,
}) => {
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
    };

    const handleRecordingComplete = (uri: string, duration: number) => {
        onSendAudio(uri, duration);
        setIsRecording(false);
    };

    const handleCancelRecording = () => {
        setIsRecording(false);
    };

    const pickImage = async () => {
        setShowAttachMenu(false);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && onAttachFile) {
                onAttachFile(result.assets[0].uri, result.assets[0].type || 'image');
            }
        } catch (error) {
            console.log('Error picking image:', error);
        }
    };

    const pickDocument = async () => {
        setShowAttachMenu(false);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0 && onAttachFile) {
                onAttachFile(result.assets[0].uri, 'document');
            }
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    const pickCamera = async () => {
        setShowAttachMenu(false);
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && onAttachFile) {
                onAttachFile(result.assets[0].uri, 'image');
            }
        } catch (error) {
            console.log('Error launching camera:', error);
        }
    };

    if (isRecording) {
        return (
            <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                onCancel={handleCancelRecording}
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Plus Button on Left */}
            <TouchableOpacity
                style={styles.plusButton}
                onPress={() => setShowAttachMenu(true)}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={26} color="#fff" />
            </TouchableOpacity>

            {/* Input Field */}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Message..."
                    placeholderTextColor="#999"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={1000}
                />
                <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
                    <Ionicons name="happy-outline" size={24} color="#888" />
                </TouchableOpacity>
            </View>

            {/* Send or Mic Button */}
            {message.trim() ? (
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                    activeOpacity={0.7}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.micButton}
                    onPress={handleStartRecording}
                    activeOpacity={0.7}
                >
                    <Ionicons name="mic" size={22} color="#fff" />
                </TouchableOpacity>
            )}

            {/* Attachment Menu Modal */}
            <Modal
                visible={showAttachMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAttachMenu(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowAttachMenu(false)}
                >
                    <View style={styles.attachMenuContainer}>
                        <View style={styles.attachMenu}>
                            {/* Document */}
                            <TouchableOpacity
                                style={styles.attachOption}
                                onPress={pickDocument}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.attachIcon, { backgroundColor: '#5B5FFF' }]}>
                                    <Ionicons name="document-text" size={24} color="#fff" />
                                </View>
                                <Text style={styles.attachLabel}>Document</Text>
                            </TouchableOpacity>

                            {/* Camera */}
                            <TouchableOpacity
                                style={styles.attachOption}
                                onPress={pickCamera}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.attachIcon, { backgroundColor: '#FF6B6B' }]}>
                                    <Ionicons name="camera" size={24} color="#fff" />
                                </View>
                                <Text style={styles.attachLabel}>Camera</Text>
                            </TouchableOpacity>

                            {/* Gallery */}
                            <TouchableOpacity
                                style={styles.attachOption}
                                onPress={pickImage}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.attachIcon, { backgroundColor: '#4ECDC4' }]}>
                                    <Ionicons name="images" size={24} color="#fff" />
                                </View>
                                <Text style={styles.attachLabel}>Gallery</Text>
                            </TouchableOpacity>

                            {/* Link */}
                            <TouchableOpacity
                                style={styles.attachOption}
                                onPress={() => setShowAttachMenu(false)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.attachIcon, { backgroundColor: '#FFD700' }]}>
                                    <Ionicons name="link" size={24} color="#000" />
                                </View>
                                <Text style={styles.attachLabel}>Link</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 28 : 14,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
        gap: 8,
    },
    plusButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F5F5F5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 44,
        maxHeight: 120,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 4,
        maxHeight: 100,
    },
    emojiButton: {
        padding: 4,
        marginLeft: 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    attachMenuContainer: {
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    attachMenu: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    attachOption: {
        alignItems: 'center',
        gap: 8,
    },
    attachIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attachLabel: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
});
