import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBox } from '@/components/SearchBox';
import { Colors } from '@/constants/theme';
import { searchVideos, SortOrder } from '@/utils/api'; // Import typu SortOrder
import { SortModal } from '@/components/sort-modal'; // Import nowego modala

// Helper do daty
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Mapowanie nazw technicznych na ładne nazwy do wyświetlania na pasku
const SORT_LABELS: Record<string, string> = {
  date: 'Latest',
  viewCount: 'Most popular',
  relevance: 'Oldest', // Fallback, jak ustaliliśmy w modalu
};

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [query, setQuery] = useState(q as string || '');

  // NOWE STANY
  const [sortOrder, setSortOrder] = useState<SortOrder>('viewCount'); // Domyślnie 'Most popular'
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  useEffect(() => {
    if (q) setQuery(q as string);
  }, [q]);

  // Aktualizacja zapytania - klucz zależy teraz też od sortOrder
  const { data: videos, isLoading } = useQuery({
    queryKey: ['search', q, sortOrder],
    queryFn: () => searchVideos(q as string, sortOrder), // Przekazujemy sortOrder
    enabled: !!q,
  });

  const handleSearchSubmit = () => {
    router.push({
      pathname: '/search-results',
      params: { q: query } // Resetujemy sortowanie przy nowym szukaniu? Zależy od Ciebie. Tutaj zostaje.
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Modal Sortowania */}
        <SortModal
          visible={isSortModalVisible}
          currentSort={sortOrder}
          onClose={() => setSortModalVisible(false)}
          onConfirm={(newOrder) => setSortOrder(newOrder)}
        />

        {/* Header */}
        <View style={styles.headerContainer}>
          <SearchBox
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            placeholder="Search videos..."
            style={{ flex: 1 }}
          />
        </View>

        {/* Info Bar z przyciskiem sortowania */}
        <View style={styles.infoBar}>
          <ThemedText style={styles.resultsText}>
            {isLoading ? 'Searching...' : `${videos?.length || 0} results found for: "${q}"`}
          </ThemedText>

          {/* Klikalny element sortowania */}
          <TouchableOpacity
            style={styles.sortContainer}
            onPress={() => setSortModalVisible(true)}
          >
            <ThemedText style={styles.sortLabel}>Sort by: </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.sortValue}>
              {SORT_LABELS[sortOrder]} ▾
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Lista Wyników */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id.videoId}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/detail",
                  params: { videoData: JSON.stringify(item) }
                }}
                asChild
              >
                <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
                  <Image
                    source={{ uri: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url }}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />

                  <View style={styles.textContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.channelName}>
                      {item.snippet.channelTitle}
                    </ThemedText>

                    <ThemedText style={styles.videoTitle} numberOfLines={2}>
                      {item.snippet.title}
                    </ThemedText>

                    <ThemedText style={styles.dateText}>
                      {formatDate(item.snippet.publishedAt)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
            ListEmptyComponent={
              <View style={styles.loadingContainer}>
                <ThemedText>No videos found.</ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 12,
    opacity: 0.7,
    flex: 1,
    marginRight: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 4, // Hit slop
  },
  sortLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  sortValue: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  cardContainer: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#2d2d2d',
    marginBottom: 12,
  },
  textContainer: {
    paddingHorizontal: 4,
  },
  channelName: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  videoTitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
});
