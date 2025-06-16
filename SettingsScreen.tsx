

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';


type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;


const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.option}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={20} color="#000" />
            <Text style={styles.label}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.option}>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={20} color="#000" />
            <Text style={styles.label}>Location access</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={locationEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

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
    </View>
  );
};

export default SettingsScreen;


const styles = StyleSheet.create({
  // 📱 Main container - Clean foundation for our content
  container: { 
    flex: 1, 
    backgroundColor: '#fff'  // Pure white for clarity and focus
  },

  // 🎯 Header section - Brand consistency and clear navigation
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'green',  // Brand color for recognition
    padding: 15                // Comfortable touch targets
  },
  backButton: { 
    marginRight: 10  // Breathing room between back button and title
  },
  headerText: { 
    color: '#fff',           // High contrast for readability
    fontSize: 20,            // Clear hierarchy - this is important
    fontWeight: 'bold'       // Emphasis for screen identification
  },

 
  content: {
    flex: 1,                 // Take up available space
    padding: 16,             // Consistent spacing from edges
    backgroundColor: '#ffffff', // Ensure clean background
  },

  option: {
    flexDirection: 'row',           // Icon + text on left, control on right
    justifyContent: 'space-between', // Push elements to opposite ends
    alignItems: 'center',           // Vertical alignment for visual harmony
    paddingVertical: 14,            // Generous touch targets for accessibility
    borderBottomWidth: 1,           // Subtle separation between options
    borderColor: '#eee',            // Light gray - visible but not distracting
  },
  
  row: {
    flexDirection: 'row',    // Icon beside text
    alignItems: 'center',    // Vertical alignment
  },

  label: {
    fontSize: 16,            // Comfortable reading size
    marginLeft: 10,          // Space between icon and text
    color: '#000',           // High contrast for accessibility
  },

  navBar: {
    flexDirection: 'row',           // Horizontal layout
    justifyContent: 'space-around', // Even distribution of icons
    paddingBottom: 5,               // Match original bottom tab padding
    paddingTop: 5,                  // Match original bottom tab padding
    height: 60,                     // Match original bottom tab height
    borderTopWidth: 1,              // Visual separation from content
    borderColor: '#ccc',            // Subtle border for definition
    backgroundColor: '#fff',        // Ensure clean background
    elevation: 8,                   // Android shadow
    shadowColor: '#000',            // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  tabButton: {
    alignItems: 'center',           
    justifyContent: 'center',       
    flex: 1,                        
  },
  
  tabLabel: {
    fontSize: 12,                   
    color: 'gray',                  
    marginTop: 2,                   
  }
});
