import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, useColorScheme, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Video, { OnProgressData, VideoRef } from 'react-native-video';
import Icon from './icon';
import { Colors } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625; // 16:9 Aspect Ratio

interface VideoPlayerProps {
  thumbnailUri: string;
  currentTime?: string;
  totalTime?: number;
  onBackPress?: () => void;
}

export function VideoPlayer({
  thumbnailUri,
  currentTime = "0:00",
  totalTime = 0,
  onBackPress
}: VideoPlayerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();
  const videoRef = useRef<VideoRef>(null);
  const background = require('../assets/video/broadchurch.mp4');
  const [progressText, setProgressText] = useState(`${formatTime(0)}/${formatTime(totalTime)}`);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);

  const dim = useWindowDimensions();

  const onProgress = (e: OnProgressData) => {
    setProgressText(`${formatTime(e.currentTime)}/${formatTime(e.playableDuration)}`)
  };


  return (
    <View style={[styles.container, { width: "100%", height: dim.width * 0.5625 }]}>
      {/* Background Thumbnail */}

      <Video
        source={background}
        ref={videoRef}
        style={styles.backgroundVideo}
        controls={false}
        onProgress={onProgress}
        paused={paused}
        volume={muted ? 0 : 1}
      >

      </Video>
      <View style={styles.overlay}>
        <ThemedText style={styles.timeRow} lightColor="white">
          {progressText}
        </ThemedText>

        <View style={styles.topControls}>

          <TouchableOpacity style={styles.iconButton} onPress={() => {
            navigation.goBack();
          }}>

            <Icon name='leftarrow' color={Colors.dark.text} />

          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, { marginLeft: "auto", alignSelf: "flex-end" }]} onPress={() => { setMuted(n => !n) }}>

            <Icon name='volume' color={Colors.dark.text} />

          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton]} onPress={() => {
            videoRef.current?.enterPictureInPicture()
          }}>

            <Icon name="airplay" color={Colors.dark.text} />

          </TouchableOpacity>
        </View>
        <View style={styles.centerControls}>

          <TouchableOpacity style={styles.iconButton} onPress={async () => videoRef.current?.seek(await videoRef.current.getCurrentPosition() - 5)}>

            <Icon name='backward' color={Colors.dark.text} />

          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { width: 50, height: 50 }]} onPress={() => setPaused(n => !n)}>

            <Icon name={paused ? "play" : "pause"} color={Colors.dark.text} style={{ marginLeft: 0 }} />

          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}
            onPress={async () => videoRef.current?.seek(await videoRef.current.getCurrentPosition() + 5)}>

            <Icon name='forward' color={Colors.dark.text} />

          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.iconButton, { position: "absolute", right: 0, bottom: 0, margin: 5, marginLeft: "auto" }]}
          onPress={async () => videoRef.current?.setFullScreen(true)}>

          <Icon name='fullscreen' color={Colors.dark.text} />

        </TouchableOpacity>
      </View>
    </View>
  );
}


const formatTime = (seconds: number) => {
  seconds = Math.round(seconds);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const styles = StyleSheet.create({
  container: {
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  background: {
    width: '100%',
    height: '100%',
    opacity: 0.6, // Dimmed for overlay visibility
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  topControls: {
    position: "absolute",
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    justifyContent: 'center',
    verticalAlign: 'middle',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '100%',
    width: 40,
    height: 40,
  },
  centerControls: {
    flexDirection: 'row',
    marginVertical: "auto",
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
    position: "absolute",
    bottom: 0,
    left: 5,
    margin: 5,
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
  backgroundVideo: {
    position: 'absolute',
    marginHorizontal: "auto",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
