import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');
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

const VideoPlayerPlaceholder = () => {
  return (
    <View style={styles.videoContainer}>
      {/* Background Thumbnail (Place real <Video> component here later) */}
      <Image
        source={{ uri: 'https://img.youtube.com/vi/gvkqT_Uoahw/maxresdefault.jpg' }}
        style={styles.videoBackground}
        contentFit="cover"
      />

      {/* Overlay Controls */}
      <View style={styles.overlay}>

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol name="arrow.left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topRightControls}>
            <TouchableOpacity style={styles.iconButton}>
              <IconSymbol name="speaker.wave.2.fill" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <IconSymbol name="tv" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Playback Controls */}
        <View style={styles.centerControls}>
          <TouchableOpacity style={styles.controlCircleSmall}>
            <IconSymbol name="backward.fill" size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlCircleLarge}>
            <IconSymbol name="play.fill" size={28} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlCircleSmall}>
            <IconSymbol name="forward.fill" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bottom Progress Bar & Info */}
        <View style={styles.bottomControls}>
          <View style={styles.timeRow}>
            <ThemedText style={styles.timeText}>
              {VIDEO_INFO.currentTime} / {VIDEO_INFO.totalTime}
            </ThemedText>
            <TouchableOpacity>
              <IconSymbol name="arrow.up.left.and.arrow.down.right" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar Line */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <View style={styles.progressBarFill} />
            <View style={styles.progressBarKnob} />
          </View>
        </View>
      </View>
    </View>
  );
};

const StatBox = ({ icon, text }: { icon: string, text: string }) => (
  <View style={styles.statBox}>
    <IconSymbol name={icon as any} size={20} color="#fff" style={{ marginRight: 8 }} />
    <ThemedText type="defaultSemiBold" style={{ color: '#fff', fontSize: 13 }}>{text}</ThemedText>
  </View>
);

export default function VideoDetailScreen() {
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={{ flex: 0, backgroundColor: '#000' }} />

      {/* Video Player Section (Fixed at top) */}
      <VideoPlayerPlaceholder />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Title */}
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
            <StatBox icon="desktopcomputer" text={VIDEO_INFO.views} />
            <StatBox icon="hand.thumbsup" text={VIDEO_INFO.likes} />
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
    padding: 20,
    paddingBottom: 40,
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
