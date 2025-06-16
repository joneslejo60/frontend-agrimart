import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList, HomeTabsParamList } from '../navigation/navigation.types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type HomeScreenRouteProp = RouteProp<HomeTabsParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { userName = '', userPhone = '' } = route.params || {};
  const [selectedLanguage, setSelectedLanguage] = useState<'E' | 'K'>('E');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { width: screenWidth } = Dimensions.get('window');
  
  // Show status bar when HomeScreen mounts
  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
    
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(false);
    }
  }, []);
  
  // Define a type for banner images that can accept both local and remote images
  type BannerImage = {
    id: number | string;
    source: any; // Can be require() or { uri: string }
  };

  // You can dynamically load images from API or pass them as props
  const [originalImages, setOriginalImages] = useState<BannerImage[]>([
    { id: 1, source: require('../../assets/banner1.png') },
    { id: 2, source: require('../../assets/banner2.png') },
    { id: 3, source: require('../../assets/banner3.png') },
  ]);
  
  // Example of how you could load images from an API
  useEffect(() => {
    // This is just a sample - uncomment and modify when you have an actual API
    /*
    const fetchBannerImages = async () => {
      try {
        const response = await fetch('https://your-api.com/banner-images');
        const data = await response.json();
        
        // Transform API data to match our BannerImage type
        const apiImages: BannerImage[] = data.map((item: any, index: number) => ({
          id: item.id || index,
          source: { uri: item.imageUrl }  // Remote images use { uri: url } format
        }));
        
        setOriginalImages(apiImages);
      } catch (error) {
        console.error('Failed to fetch banner images:', error);
      }
    };
    
    // fetchBannerImages();
    */
  }, []);
  
  // Function to add a new image to the carousel
  const addImage = (newImage: BannerImage) => {
    setOriginalImages(prev => [...prev, newImage]);
  };

  // Recalculate swiperImages whenever originalImages changes
  const swiperImages = useMemo(() => {
    if (originalImages.length === 0) return [];
    return [
      { ...originalImages.slice(-1)[0], id: 'duplicate-start' },
      ...originalImages,
      { ...originalImages.slice(0, 1)[0], id: 'duplicate-end' },
    ];
  }, [originalImages]);

  useEffect(() => {
    if (scrollViewRef.current) {
      const initialPosition = screenWidth * 0.8;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: initialPosition, animated: false });
      }, 100);
    }
  }, [screenWidth]);

  useEffect(() => {
    // Show status bar with green color for HomeScreen
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('green');
    
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(false);
    }
  }, []);

  const handleOrderNow = () => {
    navigation.navigate('OrderNow', { userName, userPhone });
  };

  const handleAddressPress = () => {
    navigation.navigate('MyAddress', { userName, userPhone });
  };

  const handleNotificationPress = () => {
    navigation.navigate('NotificationScreen');
  };

  const handleLanguageToggle = (language: 'E' | 'K') => {
    setSelectedLanguage(language);
  };

  const handleAgriInputsPress = () => {
    navigation.navigate('AgriInputScreen', { userName, userPhone });
  };

  const handleGroceriesPress = () => {
    navigation.navigate('GroceriesScreen', { userName, userPhone });
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const itemWidth = screenWidth * 0.8;
    const pageNum = Math.round(contentOffset.x / itemWidth);
    
    let actualIndex = pageNum - 1;
    if (actualIndex < 0) actualIndex = originalImages.length - 1;
    if (actualIndex >= originalImages.length) actualIndex = 0;
    
    setCurrentImageIndex(actualIndex);
  };

  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const itemWidth = screenWidth * 0.8;
    const pageNum = Math.round(contentOffset.x / itemWidth);
    
    if (pageNum === 0) {
      const targetPosition = originalImages.length * itemWidth;
      scrollViewRef.current?.scrollTo({ x: targetPosition, animated: false });
    } else if (pageNum === swiperImages.length - 1) {
      const targetPosition = itemWidth;
      scrollViewRef.current?.scrollTo({ x: targetPosition, animated: false });
    }
  };

  const [climateData, setClimateData] = useState({
    chanceOfRain: 20,
    weatherDescription: 'Partly Cloudy',
    temperature: 26,
    feelsLike: 20,
    weatherIcon: 'cloud',
  });

  useEffect(() => {
    // Fetch climate data from an API and update state
    // setClimateData(fetchedData);
  }, []);

  const handleClimatePress = () => {
    navigation.navigate('ClimateScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" translucent={false} hidden={false} />
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/splash1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
          <Text style={styles.addressText} numberOfLines={2}>
            123 Main Street, City Name
          </Text>
          <Icon name="chevron-right" size={12} color="white" />
        </TouchableOpacity>

        <View style={styles.languageToggle}>
          <TouchableOpacity 
            style={[
              styles.languageButton, 
              styles.languageButtonLeft,
              selectedLanguage === 'E' ? styles.languageButtonActive : styles.languageButtonInactive
            ]}
            onPress={() => handleLanguageToggle('E')}
          >
            <Text style={[
              styles.languageText,
              selectedLanguage === 'E' ? styles.languageTextActive : styles.languageTextInactive
            ]}>E</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.languageButton, 
              styles.languageButtonRight,
              selectedLanguage === 'K' ? styles.languageButtonActive : styles.languageButtonInactive
            ]}
            onPress={() => handleLanguageToggle('K')}
          >
            <Text style={[
              styles.languageText,
              selectedLanguage === 'K' ? styles.languageTextActive : styles.languageTextInactive
            ]}>K</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
          <Icon name="bell" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.climateBox} onPress={handleClimatePress}>
        <View style={styles.climateTextContainer}>
          <Text style={styles.chanceOfRain}>
            Chance of Rain: {climateData.chanceOfRain}%
          </Text>
          <Text style={styles.weatherDescription}>
            {climateData.weatherDescription}
          </Text>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>
              {climateData.temperature}°C
            </Text>
            <View style={styles.feelsLikeContainer}>
              <Text style={styles.feelsLike}>
                Feels like {climateData.feelsLike}°C {'>'}
              </Text>
            </View>
          </View>
        </View>
        <Icon name={climateData.weatherIcon} size={50} color="white" style={styles.weatherIcon} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.swiperContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            style={styles.imageScrollView}
            snapToInterval={screenWidth * 0.8}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.scrollContentContainer}
          >
            {swiperImages.map((image, index) => (
              <View key={image.id} style={[styles.imageContainer, { width: screenWidth * 0.8 }]}>
                <Image
                  source={image.source}
                  style={styles.swiperImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.dotsContainer}>
            {originalImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentImageIndex === index ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.twoBoxContainer}>
          <TouchableOpacity style={styles.actionBox} onPress={handleAgriInputsPress}>
            <View style={styles.innerBox}>
              <Image 
                source={require('../../assets/banner1.png')}
                style={styles.boxImageFull}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.boxText, styles.leftBoxText]}>Agri Inputs {'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBox} onPress={handleGroceriesPress}>
            <View style={styles.innerBox}>
              <Image 
                source={require('../../assets/banner2.png')}
                style={styles.boxImageFull}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.boxText, styles.rightBoxText]}>Groceries {'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.orderNowButton} onPress={handleOrderNow}>
          <Text style={styles.orderNowText}>Order Now</Text>
        </TouchableOpacity>

        <View style={styles.helpBox}>
          <Icon name="headphones" size={24} color="#CC5500" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.callToShop}>Call to Shop</Text>
            <Text style={styles.helpText}>Get help from us whenever you want!</Text>
          </View>
          <Icon name="phone" size={24} color="#CC5500" style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },

  header: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  logoContainer: {
    marginRight: 10,
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
  },

  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  addressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
    maxWidth: '90%',
  },

  languageToggle: {
    flexDirection: 'row',
    marginRight: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },

  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  languageButtonLeft: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },

  languageButtonRight: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },

  languageButtonActive: {
    backgroundColor: 'white',
  },

  languageButtonInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },

  languageText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  languageTextActive: {
    color: 'green',
  },

  languageTextInactive: {
    color: 'white',
  },

  notificationButton: {
    padding: 8,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    marginTop: -120,
  },
  
  welcome: { 
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  
  info: { 
    fontSize: 16,
    color: 'gray',
    marginBottom: 20
  },

  swiperContainer: {
    width: '100%',
    marginTop: 0,
    marginBottom: 20,
    alignItems: 'center',
  },

  imageScrollView: {
    width: '100%',
  },

  scrollContentContainer: {
    paddingLeft: Dimensions.get('window').width * 0.1,
    paddingRight: Dimensions.get('window').width * 0.1,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  swiperImage: {
    width: '95%',
    height: 120,
    borderRadius: 0,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 6.5,
    elevation: 10,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: 'green',
  },

  inactiveDot: {
    backgroundColor: '#ccc',
  },

  twoBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },

  actionBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },

  innerBox: {
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  
  boxImage: {
    width: 50,
    height: 50,
  },
  
  boxImageFull: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  boxText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  leftBoxText: {
    color: 'green',
  },

  rightBoxText: {
    color: 'blue',
  },

  orderNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1, 
    width: '90%',
    marginBottom: 20,
  },

  orderNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CC5500',
    width: '90%',
    justifyContent: 'space-between',
  },

  icon: {
    marginHorizontal: 10,
  },

  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },

  callToShop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CC5500',
  },

  helpText: {
    fontSize: 14,
    color: '#CC5500',
  },

  climateBox: {
    flexDirection: 'row',
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 5,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 100,
  },
  climateTextContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 5,
    position: 'relative',
  },
  chanceOfRain: {
    fontSize: 16,
    color: 'white',
  },
  weatherDescription: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  temperature: {
    fontSize: 18,
    color: 'white',
    marginRight: 10,
  },
  feelsLikeContainer: {
    position: 'absolute',
    right: 15,
    bottom: 5,
  },
  feelsLike: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
  },
  weatherIcon: {
    marginLeft: 10,
    marginRight: 15,
  },
});
