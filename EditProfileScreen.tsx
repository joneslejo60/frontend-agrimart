

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Image,
  Alert,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';
import * as ImagePicker from 'react-native-image-picker';


type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
type EditProfileScreenRouteProp = RouteProp<RootStackParamList, 'EditProfile'>;

/**
 * 📝 Edit Profile Screen Component
 * 
 * A comprehensive profile editing interface that allows users to:
 * - Update profile picture via camera or gallery
 * - Edit personal information (name, phone, email)
 * - Save changes with visual feedback
 * - Navigate back to other sections seamlessly
 */
const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const route = useRoute<EditProfileScreenRouteProp>();
  
  // Get user data from route params
  const { userName, userPhone, profileImage: initialProfileImage } = route.params || {};
  
  // State management for form fields
  const [profileImage, setProfileImage] = useState(initialProfileImage || 'https://via.placeholder.com/100');
  const [name, setName] = useState(userName || '');
  const [phone, setPhone] = useState(userPhone || '');
  const [email, setEmail] = useState(''); // New field for email

  /**
   * 📸 Profile Picture Selection Handler
   * 
   * Provides users with options to update their profile picture
   * via camera capture or gallery selection.
   */
  const changeProfilePhoto = () => {
    Alert.alert('Change Profile Picture', 'Select an option', [
      {
        text: 'Camera',
        onPress: () => {
          ImagePicker.launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (!response.didCancel && response.assets?.length && response.assets[0].uri) {
              setProfileImage(response.assets[0].uri);
            }
          });
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (!response.didCancel && response.assets?.length && response.assets[0].uri) {
              setProfileImage(response.assets[0].uri);
            }
          });
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  /**
   * 💾 Save Profile Changes Handler
   * 
   * Processes the updated profile information and navigates back
   * to the profile screen with the new data.
   */
  const handleSaveDetails = () => {
    // Here you would typically make an API call to save the data
    // For now, we'll just navigate back with the updated data
    
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'HomeTabs', 
                params: { userName: name, userPhone: phone },
                state: {
                  routes: [{ name: 'Profile', params: { userName: name, userPhone: phone } }],
                  index: 0,
                }
              }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      {/* 🎯 Header Section - Consistent with app design */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 📸 Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TouchableOpacity style={styles.imageEditButton} onPress={changeProfilePhoto}>
              <Icon name="camera-alt" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 📝 Form Fields Section */}
        <View style={styles.formSection}>
          {/* Username Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
              {name.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={() => setName('')}
                >
                  <Icon name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Phone Number Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
              {phone.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={() => setPhone('')}
                >
                  <Icon name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={() => setEmail('')}
                >
                  <Icon name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 💾 Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
          <Text style={styles.saveButtonText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>

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
    </View>
  );
};

export default EditProfileScreen;

/**
 * 🎨 Styling Configuration - Beautiful & Functional Design
 * 
 * Consistent with the app's design language while providing
 * an intuitive and accessible user experience.
 */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },

  // 🎯 Header styling - matches app design
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'green', 
    padding: 15 
  },
  backButton: { 
    marginRight: 10 
  },
  headerText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },

  // 📄 Content area
  content: { 
    flex: 1,
    padding: 20 
  },

  // 📸 Profile image section
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: { 
    position: 'relative' 
  },
  profileImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  imageEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // 📝 Form section
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    paddingRight: 45, // Make space for the X button
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 💾 Save button
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // 🧭 Bottom navigation - matching original design
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
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