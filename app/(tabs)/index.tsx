/**
 * KaarYa Home Screen
 * Clean main screen with functional Apply and Notification
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Modal, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { StatusBar } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTabBarContext } from '../../app/context/TabBarContext';
import * as Haptics from 'expo-haptics';

// Import components from home folder
import {
  HomeHeader,
  CategoryChip,
  GigGrid,
  GigDetailModal,
  KARYA_YELLOW,
  CATEGORIES,
  CategoryType,
  Gig,
} from '../../components/home';

// Import sample data
import { SAMPLE_GIGS } from '../../components/home/data';

// Ghost mascot image
const GhostMascot = require('../../assets/images/Ghost Massacre.png');

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter gigs by category
  const filteredGigs = SAMPLE_GIGS.filter(
    (gig) => activeCategory === 'all' || gig.category === activeCategory
  );

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Category change handler
  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
  };

  // Open gig detail modal
  const handleGigPress = (gig: Gig) => {
    setSelectedGig(gig);
    setModalVisible(true);
  };

  // Apply to gig
  const handleApply = (gig: Gig) => {
    setSelectedGig(gig);
    setModalVisible(true);
  };

  // Send application
  const handleSendApplication = () => {
    setModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  // Close success modal
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  // Notification press
  const handleNotificationPress = () => {
    router.push('/messages');
  };

  const { scrollY } = useTabBarContext();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useFocusEffect(
    useCallback(() => {
      scrollY.value = 0;
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KARYA_YELLOW} />

      {/* Header */}
      <HomeHeader onNotificationPress={handleNotificationPress} />

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesWrapper}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((cat, index) => (
          <CategoryChip
            key={cat.key}
            label={cat.label}
            icon={cat.icon}
            isActive={activeCategory === cat.key}
            onPress={() => handleCategoryChange(cat.key)}
            index={index}
          />
        ))}
      </ScrollView>

      {/* Gig Feed */}
      <GigGrid
        gigs={filteredGigs}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onGigPress={handleGigPress}
        onApply={handleApply}
        onScroll={scrollHandler}
      />

      {/* Gig Detail Modal */}
      <GigDetailModal
        visible={modalVisible}
        gig={selectedGig}
        onClose={() => setModalVisible(false)}
        onApply={handleSendApplication}
      />

      {/* Success Modal with Ghost Mascot */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <Pressable style={styles.successOverlay} onPress={handleCloseSuccess}>
          <View style={styles.successContainer}>
            {/* Ghost Mascot */}
            <Image
              source={GhostMascot}
              style={styles.ghostImage}
              resizeMode="contain"
            />

            {/* Success Text */}
            <Text style={styles.successTitle}>Application Sent!</Text>
            <Text style={styles.successSubtitle}>
              {selectedGig?.postedBy} will get back to you soon
            </Text>

            {/* Got it button */}
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={handleCloseSuccess}
              activeOpacity={0.8}
            >
              <Text style={styles.gotItText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KARYA_YELLOW,
  },
  categoriesWrapper: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  // Success Modal Styles
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 32,
  },
  ghostImage: {
    width: 240,
    height: 200,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  gotItButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  gotItText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
