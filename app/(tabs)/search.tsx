import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  View,
  useColorScheme
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { SearchBox } from '@/components/SearchBox'; // Import the new component
import Icon from '@/components/icon';

// --- Mock Data ---
const SECTIONS = [
  {
    title: 'React Native',
    data: [
      { id: '1', title: 'Lorem ipsum dolor sit amet, consectetur...', date: '12.08.2024', image: 'https://img.youtube.com/vi/gvkqT_Uoahw/maxresdefault.jpg' },
      { id: '2', title: 'React Native in 100 seconds', date: '12.08.2024', image: 'https://img.youtube.com/vi/gvkqT_Uoahw/mqdefault.jpg' },
    ]
  },
  {
    title: 'React',
    data: [
      { id: '3', title: 'Introduction to React Hooks', date: '12.08.2024', image: 'https://via.placeholder.com/300x169/282c34/61dafb?text=React+Intro' },
      { id: '4', title: 'React Introduction', date: '12.08.2024', image: 'https://via.placeholder.com/300x169/282c34/61dafb?text=React' },
    ]
  },
  {
    title: 'TypeScript',
    data: [
      { id: '5', title: 'TypeScript Tutorial', date: '12.08.2024', image: 'https://via.placeholder.com/300x169/007acc/FFFFFF?text=TS' },
      { id: '6', title: 'Intro & Setup', date: '12.08.2024', image: 'https://via.placeholder.com/300x169/007acc/FFFFFF?text=Setup' },
    ]
  }
];

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#A1CEDC' : '#1e293b';
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* 
             1. The SearchBox component (exported separately).
             2. "flex: 1" ensures it takes all available space leaving room for the icon.
          */}
          <SearchBox
            placeholder="Search videos"
            style={{ flex: 1 }}
          />

          {/* Cogwheel Icon to the right */}
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name='settings' color={colors.text}></Icon>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {SECTIONS.map((section, index) => (
            <View key={section.title}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <ThemedText type="subtitle" style={{ fontFamily: Fonts.rounded, fontSize: 20 }}>
                  {section.title}
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText style={styles.showMore}>Show more</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Horizontal List */}
              <FlatList
                data={section.data}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                      contentFit="cover"
                      transition={1000}
                    />
                    <ThemedText numberOfLines={2} type="defaultSemiBold" style={styles.cardTitle}>
                      {item.title}
                    </ThemedText>
                    <ThemedText style={styles.cardDate}>
                      {item.date}
                    </ThemedText>
                  </View>
                )}
              />

              {/* Divider (except last item) */}
              {index < SECTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
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
    gap: 12, // Gap between SearchBox and Gear Icon
  },
  settingsButton: {
    width: 38,
    padding: 2,
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
