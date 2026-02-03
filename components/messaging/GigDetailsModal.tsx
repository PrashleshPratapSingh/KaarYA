import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors, UIColors } from '../../constants/Colors';

interface GigDetailsModalProps {
    visible: boolean;
    onClose: () => void;
}

export const GigDetailsModal: React.FC<GigDetailsModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Backdrop press to close */}
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View style={styles.modalContainer}>
                    {/* Header with Title and Close */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.label}>CURRENT GIG</Text>
                            <Text style={styles.title}>Landing Page Design</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color={BrandColors.black} />
                        </TouchableOpacity>
                    </View>

                    {/* Status Pill */}
                    <View style={styles.statusContainer}>
                        <View style={styles.statusPill}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>IN PROGRESS</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Key Details Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <View style={styles.iconBox}>
                                <Ionicons name="cash-outline" size={20} color={BrandColors.black} />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Payment</Text>
                                <Text style={styles.detailValue}>₹2,500</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.iconBox}>
                                <Ionicons name="calendar-outline" size={20} color={BrandColors.black} />
                            </View>
                            <View>
                                <Text style={styles.detailLabel}>Deadline</Text>
                                <Text style={styles.detailValue}>Feb 5, 2026</Text>
                            </View>
                        </View>
                    </View>

                    {/* Milestone Card */}
                    <View style={styles.milestoneCard}>
                        <View style={styles.milestoneHeader}>
                            <Text style={styles.milestoneLabel}>CURRENT MILESTONE</Text>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={14} color={BrandColors.white} />
                            </View>
                        </View>
                        <Text style={styles.milestoneTitle}>Initial Wireframes</Text>
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                        </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.fullDetailsButton} onPress={onClose}>
                        <Text style={styles.buttonText}>VIEW FULL PROJECT</Text>
                        <Ionicons name="arrow-forward" size={18} color={BrandColors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: BrandColors.cream,
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: BrandColors.mediumGray,
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: BrandColors.black,
        lineHeight: 28,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: BrandColors.green,
        marginRight: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: BrandColors.green,
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BrandColors.white,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: BrandColors.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    detailLabel: {
        fontSize: 11,
        color: BrandColors.mediumGray,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: BrandColors.black,
    },
    milestoneCard: {
        backgroundColor: BrandColors.white,
        padding: 16,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    milestoneHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    milestoneLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: BrandColors.purple,
        letterSpacing: 0.5,
    },
    checkIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: BrandColors.green,
        justifyContent: 'center',
        alignItems: 'center',
    },
    milestoneTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: BrandColors.black,
        marginBottom: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '70%',
        backgroundColor: BrandColors.green,
        borderRadius: 3,
    },
    fullDetailsButton: {
        backgroundColor: BrandColors.black,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 20,
        shadowColor: BrandColors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: BrandColors.white,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        marginRight: 8,
    },
});
