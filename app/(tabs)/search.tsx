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
import { searchVideos, YouTubeSearchResult } from '@/utils/api'; // Upewnij się, że masz funkcję searchVideos

// Helper do daty
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams(); // Odbieramy parametr "q"
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Stan lokalnego inputa (żeby można było szukać ponownie z tego ekranu)
  const [query, setQuery] = useState(q as string || '');

  // Aktualizacja stanu jeśli parametr URL się zmieni
  useEffect(() => {
    if (q) setQuery(q as string);
  }, [q]);

  // Pobieranie danych
  const { data: videos, isLoading } = useQuery({
    queryKey: ['search', q], // Cache key zależy od parametru z URL
    queryFn: () => searchVideos(q as string),
    enabled: !!q, // Wykonaj tylko jeśli "q" istnieje
  });

  const handleSearchSubmit = () => {
    router.push({
      pathname: '/search',
      params: { q: query }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Header z SearchBoxem */}
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

        {/* Pasek Info */}
        <View style={styles.infoBar}>
          <ThemedText style={styles.resultsText}>
            {isLoading ? 'Searching...' : `${videos?.length || 0} results found for: "${q}"`}
          </ThemedText>
          <View style={styles.sortContainer}>
            <ThemedText style={styles.sortLabel}>Sort by: </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.sortValue}>Most popular</ThemedText>
          </View>
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
                  {/* Duży obrazek na górze */}
                  <Image
                    source={{ uri: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url }}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />

                  {/* Dane pod obrazkiem */}
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
  },
  sortLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  sortValue: {
    fontSize: 12,
  },

  // Lista
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

  // Karta
  cardContainer: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  thumbnail: {
    width: '100%',
    height: 200, // Duży obrazek jak w referencji
    borderRadius: 16,
    backgroundColor: '#2d2d2d',
    marginBottom: 12,
  },
  textContainer: {
    paddingHorizontal: 4,
  },
  channelName: {
    fontSize: 14,
    color: '#1e293b', // Ciemny granat
    marginBottom: 4,
  },
  videoTitle: {
    fontSize: 16,
    color: '#475569', // Szary tekst opisu/tytułu
    lineHeight: 22,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right', // Data po prawej stronie
  },
});
