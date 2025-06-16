import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';
// Removed LinearGradient import and type due to native module linking issues

type ClimateScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ClimateScreen = () => {
  const navigation = useNavigation<ClimateScreenNavigationProp>();
  
  // Sample hourly weather data
  const hourlyWeather = [
    { time: 'Now', icon: 'sun-o', temp: '24°C' },
    { time: '1hr', icon: 'cloud', temp: '25°C' },
    { time: '2hr', icon: 'cloud-rain', temp: '26°C' },
    { time: '3hr', icon: 'cloud-rain', temp: '26°C' },
    { time: '4hr', icon: 'cloud', temp: '25°C' },
    { time: '5hr', icon: 'question-circle', temp: '24°C' },
    { time: '6hr', icon: 'cloud', temp: '23°C' },
    { time: '7hr', icon: 'cloud-rain', temp: '22°C' },
  ];
  
  // Sample forecast data
  const forecastData = [
    { day: 'Today', icon: 'cloud-rain', highTemp: '26°', lowTemp: '20°' },
    { day: 'Monday', icon: 'cloud', highTemp: '28°', lowTemp: '21°' },
    { day: 'Tuesday', icon: 'sun-o', highTemp: '30°', lowTemp: '22°' },
    { day: 'Wednesday', icon: 'sun-o', highTemp: '32°', lowTemp: '24°' },
    { day: 'Thursday', icon: 'cloud', highTemp: '29°', lowTemp: '23°' },
    { day: 'Friday', icon: 'cloud-rain', highTemp: '27°', lowTemp: '22°' },
    { day: 'Saturday', icon: 'cloud-rain', highTemp: '26°', lowTemp: '21°' },
    { day: 'Sunday', icon: 'question-circle', highTemp: '28°', lowTemp: '22°' },
    { day: 'Monday', icon: 'sun-o', highTemp: '29°', lowTemp: '23°' },
    { day: 'Tuesday', icon: 'sun-o', highTemp: '30°', lowTemp: '24°' },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4a89dc" barStyle="light-content" />
      
      <View style={styles.mainContent}>
        <View
          style={[
            styles.gradientBackground, 
            { 
              backgroundColor: '#4a89dc', // Light blue color
              opacity: 0.9 // Slightly transparent for a softer look
            }
          ]}
        />
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bangalore,KA</Text>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.weatherInfoContainer}>
            <Icon name="cloud" size={80} color="white" style={styles.weatherIcon} />
            <Text style={[styles.weatherDescription, {color: 'white'}]}>Partly Cloudy</Text>
            <Text style={[styles.feelsLike, {color: 'white'}]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
          
          <View style={styles.additionalInfoContainer}>
          <Text style={styles.sectionTitle}>Rainy conditions expected today</Text>
          
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            style={styles.hourlyScrollView}
          >
            {hourlyWeather.map((item, index) => (
              <View key={index} style={styles.hourlyWeatherItem}>
                <Text style={styles.hourlyTime}>{item.time}</Text>
                <Icon 
                  name={item.icon} 
                  size={30} 
                  color={
                    item.icon === 'sun-o' ? '#FFA500' : 
                    item.icon === 'cloud-rain' ? '#4682B4' : 
                    item.icon === 'question-circle' ? '#F08080' : 
                    '#708090'
                  } 
                  style={styles.hourlyIcon} 
                />
                <Text style={styles.hourlyTemp}>{item.temp}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.forecastContainer}>
          <Text style={styles.sectionTitle}>Forecast</Text>
          <Text style={styles.forecastSubtitle}>10-day forecast</Text>
          
          {forecastData.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <View style={styles.forecastIconContainer}>
                <Icon 
                  name={item.icon} 
                  size={24} 
                  color={
                    item.icon === 'sun-o' ? '#FFA500' : 
                    item.icon === 'cloud-rain' ? '#4682B4' : 
                    item.icon === 'question-circle' ? '#F08080' : 
                    '#708090'
                  } 
                />
              </View>
              <View style={styles.forecastDayContainer}>
                <Text style={styles.forecastDay}>{item.day}</Text>
              </View>
              <View style={styles.forecastTempContainer}>
                <Text style={styles.forecastTemp}>{item.highTemp} / {item.lowTemp}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      </View>
      
      {/* 🧭 Bottom Navigation Bar - Matching Original Design */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.tabButton}
          activeOpacity={0.6}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'HomeTabs', 
                params: { userName: '', userPhone: '' },
                state: {
                  routes: [{ name: 'Home', params: { userName: '', userPhone: '' } }],
                  index: 0,
                }
              }],
            });
          }}
        >
          <Ionicons name="home-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton}
          activeOpacity={0.6}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'HomeTabs', 
                params: { userName: '', userPhone: '' },
                state: {
                  routes: [{ name: 'Cart', params: { userName: '', userPhone: '' } }],
                  index: 0,
                }
              }],
            });
          }}
        >
          <Ionicons name="cart-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton}
          activeOpacity={0.6}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'HomeTabs', 
                params: { userName: '', userPhone: '' },
                state: {
                  routes: [{ name: 'Profile', params: { userName: '', userPhone: '' } }],
                  index: 0,
                }
              }],
            });
          }}
        >
          <Ionicons name="person-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 350, // Adjust this value to control how far down the gradient extends
    zIndex: 0,
    // Add a shadow to create a fade effect at the bottom
    shadowColor: '#f8f8f8',
    shadowOffset: { width: 0, height: 150 },
    shadowOpacity: 1,
    shadowRadius: 75,
    elevation: 0, // No elevation to keep the shadow effect clean
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 5,
    elevation: 8,
    shadowColor: '#000',           // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  
  tabButton: {
    alignItems: 'center',          // Center icon and text
    justifyContent: 'center',      // Center content vertically
    flex: 1,                       // Equal width distribution
  },
  
  tabLabel: {
    fontSize: 12,                  // Small text like original tabs
    color: 'gray',                 // Match inactive tint color
    marginTop: 2,                  // Small gap between icon and text
  },
  header: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1, // Ensure content is above the gradient
  },
  weatherInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weatherIcon: {
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 20,
    color: '#555',
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 16,
    color: '#777',
  },
  additionalInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  hourlyScrollView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  hourlyWeatherItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    width: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hourlyTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  hourlyIcon: {
    marginBottom: 5,
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  hourlyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  hourlyDetailLabel: {
    fontSize: 12,
    color: '#777',
  },
  hourlyDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  forecastContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  forecastSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: -10,
    marginBottom: 15,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  forecastIconContainer: {
    width: '10%',
    marginRight: 10,
  },
  forecastDayContainer: {
    width: '30%',
  },
  forecastDay: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  forecastTempContainer: {
    width: '60%',
    alignItems: 'flex-end',
  },
  forecastTemp: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ClimateScreen;