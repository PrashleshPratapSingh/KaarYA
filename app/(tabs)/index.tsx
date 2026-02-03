/**
 * KaarYa Home Screen
 * Clean main screen with functional Apply and Notification
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

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

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    Alert.alert(
      '🎉 Application Sent!',
      `Your application for "${selectedGig?.title}" has been sent to ${selectedGig?.postedBy}. They'll get back to you soon!`,
      [{ text: 'Awesome!', style: 'default' }]
    );
  };

  // Notification press
  const handleNotificationPress = () => {
    router.push('/messages');
  };

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
      />

      {/* Gig Detail Modal */}
      <GigDetailModal
        visible={modalVisible}
        gig={selectedGig}
        onClose={() => setModalVisible(false)}
        onApply={handleSendApplication}
      />
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
});
