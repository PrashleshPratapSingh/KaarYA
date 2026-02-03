/**
 * KaarYa Home Screen
 * Clean main screen that imports modular components
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl } from 'react-native';
import { StatusBar } from 'react-native';

// Import components from home folder
import {
  HomeHeader,
  CategoryChip,
  GigCard,
  EmptyState,
  KARYA_YELLOW,
  KARYA_BLACK,
  CATEGORIES,
  CategoryType,
} from '../../components/home';

// Import sample data
import { SAMPLE_GIGS } from '../../components/home/data';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={KARYA_YELLOW} />

      {/* Header */}
      <HomeHeader />

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesWrapper}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.key}
            label={cat.label}
            icon={cat.icon}
            isActive={activeCategory === cat.key}
            onPress={() => handleCategoryChange(cat.key)}
          />
        ))}
      </ScrollView>

      {/* Gig Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={KARYA_BLACK}
            colors={[KARYA_BLACK]}
          />
        }
      >
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>FRESH GIGS</Text>
          <Text style={styles.gigCount}>{filteredGigs.length} available</Text>
        </View>

        {/* Gig Cards or Empty State */}
        {filteredGigs.length > 0 ? (
          filteredGigs.map((gig, index) => (
            <GigCard
              key={gig.id}
              gig={gig}
              index={index}
              onPress={() => console.log(`View gig: ${gig.id}`)}
              onApply={() => console.log(`Apply to: ${gig.id}`)}
            />
          ))
        ) : (
          <EmptyState />
        )}

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: KARYA_BLACK,
    letterSpacing: 1,
  },
  gigCount: {
    fontSize: 13,
    fontWeight: '600',
    color: KARYA_BLACK,
    opacity: 0.6,
  },
});
