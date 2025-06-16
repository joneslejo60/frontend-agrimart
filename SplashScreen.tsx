// src/components/SplashScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/navigation.types';

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashNavProp>();
  const [showSecondImage, setShowSecondImage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    // Show first image for 3 seconds
    const timer1 = setTimeout(() => {
      // Show second image
      setShowSecondImage(true);
      
      // First slide from right to left (stop at left position)
      Animated.timing(slideAnim, {
        toValue: -35,  // Move to left position
        duration: 400, // Fast slide in
        useNativeDriver: true,
      }).start(() => {
        // Small pause before sliding to center
        setTimeout(() => {
          // Then slide from left to center quickly and smoothly
          Animated.spring(slideAnim, {
            toValue: 0,    // Center position
            useNativeDriver: true,
            tension: 120,  // Very high tension = very fast animation
            friction: 8,   // Enough friction for smoothness
            velocity: 8,   // High initial velocity for quick start
          }).start(() => {
            // Wait 2 seconds before navigating
            const timer2 = setTimeout(() => {
              navigation.navigate('Onboarding');
            }, 2000);
            
            return () => clearTimeout(timer2);
          });
        }, 200); // 200ms pause
      });
    }, 3000);

    return () => clearTimeout(timer1);
  }, [slideAnim, navigation]);

  // Ensure white status bar
  useEffect(() => {
    // Set white status bar
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
    
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="#ffffff" 
        barStyle="dark-content" 
        translucent={false}
      />
      {/* First image is always visible until second image slides in */}
      {!showSecondImage && (
        <Animated.Image
          source={require('../../assets/splash1.png')}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      )}
      
      {/* Second image slides in from right */}
      {showSecondImage && (
        <Animated.Image
          source={require('../../assets/splash2.png')}
          style={[
            styles.image2, 
            { transform: [{ translateX: slideAnim }] }
          ]}
          resizeMode="contain"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  image2: {
    width: 300,
    height: 300,
  },
});

export default SplashScreen;
