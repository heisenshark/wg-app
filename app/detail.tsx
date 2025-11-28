import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VideoPlayer } from '@/components/video-player';

const { width } = Dimensions.get('window');
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '@/components/icon';
import { IconName } from 'generated-icons';


const VIDEO_HEIGHT = width * 0.5625; // 16:9 Aspect Ratio

// --- Mock Data ---
const VIDEO_INFO = {
  title: 'Lorem ipsum dolor sit amet, consect...',
  channelName: 'Channel name',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque venenatis semper purus a accumsan. Donec accumsan pulvinar metus, euismod lacinia libero congue non.',
  views: '25268952 views',
  likes: '12345 likes',
  currentTime: '2:08',
  totalTime: '11:57'
};

// --- Components ---

const StatBox = ({ icon, text }: { icon: IconName, text: string }) => (
  <View style={styles.statBox}>
    <Icon name={icon as any} color="#fff" style={{ marginRight: 8, height: 20, width: 20 }} />
    <ThemedText type="defaultSemiBold" style={{ color: '#fff', fontSize: 13 }}>{text}</ThemedText>
  </View>
);

export default function VideoDetailScreen() {
  const [orientation, setOrientation] = useState(0)
  const [width, setWidth] = useState(Dimensions.get('window'));

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    ScreenOrientation.getOrientationAsync().then(e => setOrientation(e))
    const sub = ScreenOrientation.addOrientationChangeListener((e) => { setOrientation(e.orientationInfo.orientation) });
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      ScreenOrientation.removeOrientationChangeListener(sub);
    }
  }, []);



  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={{ flex: 0, backgroundColor: '#000' }} />

      {/* Video Player Section (Fixed at top) */}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <VideoPlayer thumbnailUri='https://img.youtube.com/vi/gvkqT_Uoahw/maxresdefault.jpg' />
        {/* Title */}
        <View style={styles.scrollContentContainer}>

          <ThemedText type="subtitle" style={styles.videoTitle}>
            {VIDEO_INFO.title}
          </ThemedText>

          {/* Channel Info */}
          <View style={styles.channelContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person" size={24} color="#fff" />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.channelName}>
              {VIDEO_INFO.channelName}
            </ThemedText>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
              <ThemedText type="defaultSemiBold" style={styles.activeTabText}>Details</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <ThemedText type="defaultSemiBold" style={styles.inactiveTabText}>Notes</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>Description</ThemedText>
            <ThemedText style={styles.descriptionText}>
              {VIDEO_INFO.description}
              {'\n\n'}
              Vivamus ut massa finibus, consequat dui commodo, semper magna. Donec nec justo consectetur lacus facilisis tristique eget quis nulla.
            </ThemedText>
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>Statistics</ThemedText>
            <View style={styles.statsContainer}>
              <StatBox icon="views" text={VIDEO_INFO.views} />
              <StatBox icon="likes" text={VIDEO_INFO.likes} />
            </View>
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

  // --- Video Styles ---
  videoContainer: {
    width: width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.6, // Dimmed for overlay visibility
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slight dark tint
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlCircleLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  controlCircleSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    marginBottom: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 2,
  },
  progressBarFill: {
    width: '18%', // Simulated progress
    height: '100%',
    backgroundColor: '#ff0000',
    borderRadius: 2,
  },
  progressBarKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff0000',
    marginLeft: -6, // Center on end of fill
    left: '18%',
  },

  // --- Content Styles ---
  scrollContent: {
  },
  scrollContentContainer: {
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#282a3a', // Dark Navy
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channelName: {
    fontSize: 16,
    color: '#282a3a',
  },

  // Tabs
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

  // Description & Stats
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
    backgroundColor: '#282a3a', // Dark Navy
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});
