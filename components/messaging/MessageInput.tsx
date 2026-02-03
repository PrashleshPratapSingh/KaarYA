import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { BrandColors, UIColors } from '../../constants/Colors';
import { AudioRecorder } from './AudioRecorder';
import { AttachmentModal } from './AttachmentModal';

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

    const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);

    const pickImage = async () => {
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
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert("Permission to access camera is required!");
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

    const handleAttachMenu = () => {
        setAttachmentModalVisible(true);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.container}>
                {/* Action Buttons Row */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleAttachMenu}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="attach" size={18} color={BrandColors.black} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={pickDocument}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="document-text" size={18} color={BrandColors.black} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={pickImage}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="images" size={18} color={BrandColors.black} />
                    </TouchableOpacity>
                </View>

                <AttachmentModal
                    visible={attachmentModalVisible}
                    onClose={() => setAttachmentModalVisible(false)}
                    onPickImage={pickImage}
                    onPickDocument={pickDocument}
                    onPickCamera={pickCamera}
                />

                {/* Input Row */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type something..."
                        placeholderTextColor={BrandColors.mediumGray}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={1000}
                    />

                    {message.trim() ? (
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSend}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="send" size={20} color={BrandColors.white} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.micButton}
                            onPress={handleStartRecording}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="mic" size={24} color={BrandColors.white} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: BrandColors.white,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        paddingTop: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 8,
    },
    actionRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        backgroundColor: 'rgba(91, 95, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(91, 95, 255, 0.2)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: BrandColors.cream,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 15,
        color: BrandColors.black,
        maxHeight: 100,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: UIColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: UIColors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    micButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: UIColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: UIColors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});
