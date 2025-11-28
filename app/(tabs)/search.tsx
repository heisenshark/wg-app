import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  View,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query'; // Upewnij się, że masz to zainstalowane
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { SearchBox } from '@/components/SearchBox';
import Icon from '@/components/icon'; // Twój import ikon

// Importujemy funkcje API
import {
  fetchJsVideos,
  fetchReactVideos,
  fetchRnVideos,
  fetchTsVideos,
  YouTubeSearchResult
} from '@/utils/api';

// Helper do formatowania daty (np. 2024-08-12 -> 12.08.2024)
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Komponent sekcji (zeby nie powtarzać kodu w głównym komponencie)
const VideoSection = ({ title, isLoading, data }: { title: string, isLoading: boolean, data?: YouTubeSearchResult[] }) => {
  if (isLoading) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <View>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={{ fontFamily: Fonts.rounded, fontSize: 20 }}>
          {title}
        </ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.showMore}>Show more</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.videoId}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Przekazujemy cały obiekt wideo jako string JSON do detali */}
            <Link
              href={{
                pathname: "/detail", // Upewnij się, że masz taki plik w app/detail.tsx lub app/(tabs)/...
                params: { videoData: JSON.stringify(item) }
              }}
              asChild
            >
              <TouchableOpacity>
                <Image
                  source={{ uri: item.snippet.thumbnails.medium.url }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={500}
                />
                <ThemedText numberOfLines={2} type="defaultSemiBold" style={styles.cardTitle}>
                  {item.snippet.title}
                </ThemedText>
                <ThemedText style={styles.cardDate}>
                  {formatDate(item.snippet.publishedAt)}
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      />
      <View style={styles.divider} />
    </View>
  );
};

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // --- TanStack Queries ---
  // Pobieramy dane równolegle
  const { data: rnVideos, isLoading: rnLoading } = useQuery({ queryKey: ['videos', 'rn'], queryFn: fetchRnVideos });
  const { data: reactVideos, isLoading: reactLoading } = useQuery({ queryKey: ['videos', 'react'], queryFn: fetchReactVideos });
  const { data: tsVideos, isLoading: tsLoading } = useQuery({ queryKey: ['videos', 'ts'], queryFn: fetchTsVideos });
  const { data: jsVideos, isLoading: jsLoading } = useQuery({ queryKey: ['videos', 'js'], queryFn: fetchJsVideos });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <SearchBox
            placeholder="Search videos"
            style={{ flex: 1 }}
          />
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name='settings' color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

          <VideoSection title="React Native" isLoading={rnLoading} data={rnVideos} />
          <VideoSection title="React" isLoading={reactLoading} data={reactVideos} />
          <VideoSection title="TypeScript" isLoading={tsLoading} data={tsVideos} />
          <VideoSection title="JavaScript" isLoading={jsLoading} data={jsVideos} />

        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  settingsButton: {
    width: 38,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  showMore: {
    fontSize: 12,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: 180,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#2d2d2d',
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 11,
    opacity: 0.5,
    textAlign: 'right',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    opacity: 0.2,
    marginHorizontal: 16,
    marginTop: 20,
  },
});
