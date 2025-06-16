import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, HomeTabsParamList } from '../navigation/navigation.types';
import * as ImagePicker from 'react-native-image-picker';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;
type ProfileScreenRouteProp = RouteProp<HomeTabsParamList, 'Profile'>;


const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
  
  const { userName, userPhone } = route.params || {};
  
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');
  const [name, setName] = useState(userName || 'User Name');
  const [phone, setPhone] = useState(userPhone || '+91 9123456789');

  const options: Array<{
    id: string;
    label: string;
    icon: string;
    color: string;
    action?: () => void;
  }> = [
    { 
      id: '1', 
      label: 'My Orders', 
      icon: 'shopping-cart', 
      color: 'black',
      action: () => navigation.navigate('MyOrders', {
        userName: name,
        userPhone: phone,
      }),
    },
    { 
      id: '2', 
      label: 'My Address', 
      icon: 'location-on', 
      color: 'black',
      action: () => navigation.navigate('MyAddress', {
        userName: name,
        userPhone: phone,
        addressData: undefined, // Will use default address data
      }),
    },
    { 
      id: '3', 
      label: 'Settings', 
      icon: 'settings', 
      color: 'black',
      action: () => navigation.navigate('Settings'),
    },
    {
      id: '4',
      label: 'Privacy Policy',
      icon: 'lock',
      color: 'black',
      action: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: '5',
      label: 'Logout',
      icon: 'exit-to-app',
      color: 'red',
      action: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Splash' }],
        });
      },
    },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity style={styles.imageEditButton} onPress={changeProfilePhoto}>
            <Icon name="camera-alt" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phone}>{phone}</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditProfile', {
              userName: name,
              userPhone: phone,
              profileImage: profileImage
            })}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={item.action}>
            <Icon name={item.icon} size={24} color={item.color} style={styles.optionIcon} />
            <Text style={[styles.optionText, { color: item.color }]}>{item.label}</Text>
            <Icon name="chevron-right" size={24} color="gray" style={styles.arrowIcon} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'green', padding: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  profileContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  imageEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'green',
    padding: 6,
    borderRadius: 15,
  },

  profileDetails: { marginLeft: 15, flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  phone: { fontSize: 16, color: 'gray', marginBottom: 10 },

  editButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  editButtonText: { color: '#fff', fontSize: 16 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  optionIcon: { marginRight: 10 },
  optionText: { fontSize: 16, flex: 1 },
  arrowIcon: { marginLeft: 'auto' },
});
