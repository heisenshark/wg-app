import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* 
        This screen has a dark background, so we force the status bar 
        to be light (white text) 
      */}
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>

        {/* --- Top Section: Logo --- */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('@/assets/logo.png')}
            contentFit='contain'
          />
        </View>

        {/* --- Middle Section: Hero Image/Icon --- */}
        <View style={styles.centerContent}>
          {/* REPLACE THIS WITH YOUR HERO IMAGE */}
          {/* <Image source={require('@/assets/images/hero.png')} style={styles.heroImage} /> */}

          <Image
            style={styles.logo}
            source={require('@/assets/app-icon.png')}
            contentFit='contain'
          />
          {/* Placeholder Icon representing the image in your screenshot */}
          <IconSymbol
            name="play.rectangle.fill"
            size={120}
            color="#2d3345"
          />
        </View>

        {/* --- Bottom Section: Texts & Button --- */}
        <View style={styles.bottomContainer}>

          <ThemedText type="subtitle" style={styles.welcomeText}>
            Welcome to the best{'\n'}
            YouTube-based learning{'\n'}
            application.
          </ThemedText>


          <Link href="/search" style={styles.button}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Log in as guest
            </ThemedText>
          </Link>

          <View style={styles.footerTextContainer}>
            <ThemedText style={styles.footerText}>
              By continuing you agree with{'\n'}

              <Link href="https://example.com" style={styles.linkText}>
                Terms and Conditions
              </Link>
              and
              <Link href="https://example.com" style={styles.linkText}>
                Privacy Policy
              </Link>
            </ThemedText>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8D99AE', // Muted Blue-Gray from screenshot
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  // Logo Styles
  logoContainer: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    paddingHorizontal: 30,
  },
  placeholderLogo: {
    alignItems: 'center',
    // Remove this styling when you add your actual Image component
  },
  logoText: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subLogoText: {
    fontSize: 24,
    color: '#1e293b', // Dark color for "LEARN"
    letterSpacing: 2,
    marginTop: -5,
    alignSelf: 'flex-end', // Aligns closer to the end of YouTube text
  },

  // Center Content
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 200,
    height: 200,
  },

  // Bottom Styles
  bottomContainer: {
    marginBottom: 20,
    gap: 24,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'left',
    lineHeight: 32,
  },
  button: {
    backgroundColor: '#2B2D42', // Dark Navy/Black
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    textAlign: "center",
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  footerTextContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#e2e8f0', // Light gray text
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    color: '#1e293b', // Darker text for links
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  logo: {
    flex: 1,
    width: '100%',
  },
});


