import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
  GestureResponderEvent
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Video, { OnProgressData, VideoRef, OnLoadData } from 'react-native-video';
import Icon from './icon';
import { useNavigation } from 'expo-router';

// --- Constants ---
const VIDEO_ASPECT_RATIO = 0.5625; // 16:9

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface VideoPlayerProps {
  thumbnailUri?: string;
  currentTime?: string;
  totalTime?: string;
  onBackPress?: () => void;
}

export function VideoPlayer({ onBackPress, thumbnailUri }: VideoPlayerProps) {
  const navigation = useNavigation();
  const dim = useWindowDimensions();
  const videoRef = useRef<VideoRef>(null);

  // --- State ---
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // --- Handlers ---
  const handleLoad = (meta: OnLoadData) => {
    setDuration(meta.duration);
  };

  const handleProgress = (progress: OnProgressData) => {
    setCurrentTime(progress.currentTime);
  };

  const handleSeek = (event: GestureResponderEvent) => {
    if (duration === 0 || progressBarWidth === 0) return;

    const touchX = event.nativeEvent.locationX;
    const progress = touchX / progressBarWidth;
    const newTime = progress * duration;

    videoRef.current?.seek(newTime);
    setCurrentTime(newTime);
  };

  const skipForward = async () => {
    const current = await videoRef.current?.getCurrentPosition() || 0;
    videoRef.current?.seek(current + 10);
  };

  const skipBackward = async () => {
    const current = await videoRef.current?.getCurrentPosition() || 0;
    videoRef.current?.seek(current - 10);
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={[styles.container, { height: dim.width * VIDEO_ASPECT_RATIO }]}>

      {/* 1. WIDEO */}
      <Video
        source={require('@/assets/video/broadchurch.mp4')}
        ref={videoRef}
        style={styles.backgroundVideo}
        resizeMode="contain"
        controls={false}
        onLoad={handleLoad}
        onProgress={handleProgress}
        paused={paused}
        volume={muted ? 0 : 1}
        poster={thumbnailUri}
        posterResizeMode="cover"
      />

      {/* 2. OVERLAY */}
      <View style={styles.overlay}>

        {/* --- Top Controls --- */}
        {/* Z-index zapewnia, że są klikalne */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleBack}>
            <Icon name='leftarrow' color="#FFF" size={18} />
          </TouchableOpacity>

          <View style={styles.topRightControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => setMuted(m => !m)}>
              <Icon name={muted ? 'volume-off' : 'volume'} color="#FFF" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="airplay" color="#FFF" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Center Controls --- */}
        {/* Używamy flex: 1, żeby zajęły środek, ale nie przykryły góry/dołu */}
        <View style={styles.centerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <Icon name='backward' color="#FFF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButtonCircle}
            onPress={() => setPaused(p => !p)}
          >
            <Icon
              name={paused ? "play" : "pause"}
              color="#FFF"
              size={24}
              style={paused ? { marginLeft: 3 } : {}}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <Icon name='forward' color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* --- Bottom Info --- */}
        <View style={styles.bottomInfoRow}>
          <ThemedText style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </ThemedText>

          <TouchableOpacity style={styles.fullscreenButton} onPress={() => videoRef.current?.setFullScreen(true)}>
            <Icon name='fullscreen' color="#FFF" size={18} />
          </TouchableOpacity>
        </View>

      </View>

      {/* 3. PROGRESS BAR */}
      <View style={styles.progressBarContainer}>
        <Pressable
          style={styles.progressBarTouchArea}
          onPress={handleSeek}
          onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
        >
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            <View style={[styles.progressBarKnob, { left: `${progressPercent}%` }]} />
          </View>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    overflow: 'visible',
    position: 'relative',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 10,
  },

  // --- BUTTONS ---
  controlButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  fullscreenButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- TOP ---
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20, // Na wszelki wypadek wyżej niż reszta
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 12,
  },

  // --- CENTER ---
  centerControls: {
    // ZMIANA: Flex 1 sprawia, że ten kontener rozpycha się w pionie,
    // odsuwając górę od dołu, ale nie nakłada się na nie.
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },

  // --- BOTTOM INFO ---
  bottomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  timeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },

  // --- PROGRESS BAR ---
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30, // Najwyżej
    height: 20,
    justifyContent: 'flex-end',
  },
  progressBarTouchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  progressBarTrack: {
    height: 2, // Jeszcze cieńszy pasek (YouTube style)
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF0000',
  },
  progressBarKnob: {
    position: 'absolute',
    height: 12,
    width: 12,
    backgroundColor: '#FF0000',
    borderRadius: 6,
    top: -5,
    marginLeft: -6,
    zIndex: 10,
  },
});
