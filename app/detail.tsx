import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image'; // Upewnij się, że masz ten import
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useQuery } from '@tanstack/react-query';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoPlayer } from '@/components/video-player';
import Icon from '@/components/icon';
import { IconName } from 'generated-icons';
import {
  YouTubeSearchResult,
  fetchVideoDetails,
  fetchChannelDetails // Import nowej funkcji
} from '@/utils/api';

const formatNumber = (numStr: string | undefined) => {
  if (!numStr) return '0';
  const num = parseInt(numStr, 10);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const StatBox = ({ icon, text }: { icon: IconName, text: string }) => (
  <View style={styles.statBox}>
    <Icon name={icon} color="#fff" style={{ marginRight: 8, height: 20, width: 20 }} />
    <ThemedText type="defaultSemiBold" style={{ color: '#fff', fontSize: 13 }}>{text}</ThemedText>
  </View>
);

export default function VideoDetailScreen() {
  const router = useRouter();
  const { videoData } = useLocalSearchParams();
  const [orientation, setOrientation] = useState(0);

  const initialVideo: YouTubeSearchResult | null = videoData
    ? JSON.parse(videoData as string)
    : null;

  const videoId = initialVideo?.id?.videoId;
  const channelId = initialVideo?.snippet?.channelId; // Pobieramy channelId

  const { data: fullDetails, isLoading: isVideoLoading } = useQuery({
    queryKey: ['videoDetails', videoId],
    queryFn: () => fetchVideoDetails(videoId!),
    enabled: !!videoId,
  });

  const { data: channelDetails } = useQuery({
    queryKey: ['channelDetails', channelId],
    queryFn: () => fetchChannelDetails(channelId!),
    enabled: !!channelId, // Pobieramy tylko gdy mamy ID kanału
  });

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    ScreenOrientation.getOrientationAsync().then(e => setOrientation(e));
    const sub = ScreenOrientation.addOrientationChangeListener((e) => {
      setOrientation(e.orientationInfo.orientation);
    });
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      ScreenOrientation.removeOrientationChangeListener(sub);
    };
  }, []);

  if (!initialVideo) return null;

  // Scalanie danych
  const title = fullDetails?.snippet.title || initialVideo.snippet.title;
  const channelTitle = fullDetails?.snippet.channelTitle || initialVideo.snippet.channelTitle;
  const description = fullDetails?.snippet.description || initialVideo.snippet.description;
  const thumbnail = initialVideo.snippet.thumbnails.high?.url || initialVideo.snippet.thumbnails.medium.url;

  // URL Avatara (może być undefined w trakcie ładowania)
  const channelAvatarUrl = channelDetails?.snippet.thumbnails.default.url;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={{ flex: 0, backgroundColor: '#000' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <VideoPlayer
          thumbnailUri={thumbnail}
          onBackPress={() => router.back()}
          currentTime="0:00"
          totalTime="--:--"
        />

        <View style={styles.scrollContentContainer}>

          <ThemedText type="subtitle" style={styles.videoTitle}>
            {title}
          </ThemedText>

          <View style={styles.channelContainer}>
            <View style={styles.avatarContainer}>
              {channelAvatarUrl ? (
                <Image
                  source={{ uri: channelAvatarUrl }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  transition={500}
                />
              ) : (
                // Fallback icon zanim załaduje się obrazek
                <IconSymbol name="person.circle.fill" size={48} color="#282a3a" />
              )}
            </View>
            <ThemedText type="defaultSemiBold" style={styles.channelName}>
              {channelTitle}
            </ThemedText>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
              <ThemedText type="defaultSemiBold" style={styles.activeTabText}>Details</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <ThemedText type="defaultSemiBold" style={styles.inactiveTabText}>Notes</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>Description</ThemedText>
            <ThemedText style={styles.descriptionText}>
              {description}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>Statistics</ThemedText>
            {isVideoLoading ? (
              <ActivityIndicator size="small" style={{ alignSelf: 'flex-start', marginVertical: 10 }} />
            ) : (
              <View style={styles.statsContainer}>
                <StatBox
                  icon="views"
                  text={`${formatNumber(fullDetails?.statistics?.viewCount)} Views`}
                />
                <StatBox
                  icon="likes"
                  text={`${formatNumber(fullDetails?.statistics?.likeCount)} Likes`}
                />
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentContainer: {
    zIndex: -10,
    padding: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 24,
  },
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  // Zaktualizowane style avatara
  avatarContainer: {
    marginRight: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden', // Ważne dla Image
    backgroundColor: '#eee', // Tło podczas ładowania
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  channelName: {
    fontSize: 16,
    color: '#282a3a',
    flex: 1, // Aby tekst nie wychodził poza ekran przy długich nazwach
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#282a3a',
  },
  activeTabText: {
    color: '#282a3a',
    fontSize: 16,
  },
  inactiveTabText: {
    color: '#64748b',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282a3a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});



