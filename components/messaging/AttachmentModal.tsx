import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BrandColors } from '../../constants/Colors';

interface AttachmentModalProps {
    visible: boolean;
    onClose: () => void;
    onPickImage: () => void;
    onPickDocument: () => void;
    onPickCamera: () => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
    visible,
    onClose,
    onPickImage,
    onPickDocument,
    onPickCamera,
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

    const handleAction = (action: () => void) => {
        Haptics.selectionAsync();
        onClose();
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
                    <View style={styles.handleBar} />
                    <Text style={styles.title}>Share Content</Text>

                    <View style={styles.gridContainer}>
                        <TouchableOpacity
                            style={styles.gridItem}
                            onPress={() => handleAction(onPickDocument)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="document-text" size={28} color="#9C27B0" />
                            </View>
                            <Text style={styles.itemLabel}>Document</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridItem}
                            onPress={() => handleAction(onPickCamera)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="camera" size={28} color="#4CAF50" />
                            </View>
                            <Text style={styles.itemLabel}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridItem}
                            onPress={() => handleAction(onPickImage)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="images" size={28} color="#FF9800" />
                            </View>
                            <Text style={styles.itemLabel}>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridItem}
                            onPress={() => handleAction(() => { })}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="location" size={28} color="#2196F3" />
                            </View>
                            <Text style={styles.itemLabel}>Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridItem}
                            onPress={() => handleAction(() => { })}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: '#FCE4EC' }]}>
                                <Ionicons name="person" size={28} color="#E91E63" />
                            </View>
                            <Text style={styles.itemLabel}>Contact</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
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
        padding: 24,
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
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: BrandColors.black,
        textAlign: 'center',
        marginBottom: 24,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 20,
        marginBottom: 24,
    },
    gridItem: {
        alignItems: 'center',
        width: '30%',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: BrandColors.mediumGray,
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: BrandColors.black,
    },
});
