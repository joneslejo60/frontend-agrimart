import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';

type MyAddressScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyAddress'>;
type MyAddressScreenRouteProp = RouteProp<RootStackParamList, 'MyAddress'>;

interface AddressData {
  type: string;
  address: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

const MyAddressScreen = () => {
  const navigation = useNavigation<MyAddressScreenNavigationProp>();
  const route = useRoute<MyAddressScreenRouteProp>();
  
  const { userName, userPhone, addressData, source } = route.params || {};

  const [addresses, setAddresses] = useState([
    {
      type: 'Home',
      address: '123 Green Valley Street, Apartment 4B\nSector 15, Electronic City\nBangalore, Karnataka',
      pincode: '560100',
      phone: userPhone || '+91 9123456789',
      isDefault: true
    }
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (addressData) {
        // Check if this is a new address or an existing one being edited
        if (route.params?.isNewAddress) {
          // Add new address to the list
          const newAddress = { ...addressData, isDefault: false };
          setAddresses(prevAddresses => [
            ...prevAddresses,
            newAddress
          ]);
          
          // If user came from Cart, immediately navigate back with the selected address
          if (source === 'Cart') {
            // We need to delay this slightly to ensure state is updated
            setTimeout(() => {
              navigation.navigate('HomeTabs', {
                userName: userName || '',
                userPhone: userPhone || '',
                screen: 'Cart',
                params: {
                  userName: userName || '',
                  userPhone: userPhone || '',
                  selectedAddress: newAddress
                }
              });
            }, 100);
          }
        } else {
          // Update existing address using the addressIndex from route params
          setAddresses(prevAddresses => {
            const updatedAddresses = [...prevAddresses];
            const indexToUpdate = route.params?.addressIndex !== undefined ? route.params.addressIndex : -1;
            
            if (indexToUpdate >= 0 && indexToUpdate < updatedAddresses.length) {
              // Preserve the isDefault status of the address being updated
              const isDefault = updatedAddresses[indexToUpdate].isDefault;
              updatedAddresses[indexToUpdate] = { ...addressData, isDefault };
              
              // If user came from Cart, immediately navigate back with the updated address
              if (source === 'Cart') {
                setTimeout(() => {
                  navigation.navigate('HomeTabs', {
                    userName: userName || '',
                    userPhone: userPhone || '',
                    screen: 'Cart',
                    params: {
                      userName: userName || '',
                      userPhone: userPhone || '',
                      selectedAddress: { ...addressData, isDefault }
                    }
                  });
                }, 100);
              }
            }
            
            return updatedAddresses;
          });
        }
      }
    }, [addressData, route.params?.isNewAddress, route.params?.addressIndex, source, navigation, userName, userPhone])
  );
  


  const handleSelectAddress = (address: AddressData, index: number) => {
    // Only navigate to Cart if the user came from Cart
    if (source === 'Cart') {
      // Navigate back to Cart with the selected address
      navigation.navigate('HomeTabs', {
        userName: userName || '',
        userPhone: userPhone || '',
        screen: 'Cart',
        params: {
          userName: userName || '',
          userPhone: userPhone || '',
          selectedAddress: address
        }
      });
    } else {
      // Set this address as default
      setAddresses(prevAddresses => {
        return prevAddresses.map((addr, idx) => ({
          ...addr,
          isDefault: idx === index
        }));
      });
      
      // Show feedback
      Alert.alert("Default Address", `${address.type} address set as default.`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Address</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {addresses.map((address, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleSelectAddress(address, index)} 
            style={{width: '100%', marginBottom: 10}}
          >
            <View style={styles.addressSection}>
              <View style={styles.addressHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.sectionTitle}>{address.type}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditAddress', {
                    userName: userName,
                    userPhone: userPhone,
                    addressData: address,
                    addressIndex: index,
                    source: source  // Pass the source parameter
                  })}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addressContentRow}>
                <Icon name="location-pin" size={20} color="gray" style={styles.pinIcon} />
                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                  {address.address}, {address.pincode}
                </Text>
              </View>
              <View style={styles.addressContentRow}>
                <Text style={styles.phoneText}>{address.phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.addAddressButton} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('EditAddress', {
            userName: userName,
            userPhone: userPhone,
            addressData: {
              type: 'Home',
              address: '',
              pincode: '',
              phone: userPhone || '',
              isDefault: false
            },
            isNewAddress: true
          })}
        >
          <Icon name="add" size={24} color="white" style={styles.addIcon} />
          <Text style={styles.addAddressText}>Add New Address</Text>
        </TouchableOpacity>
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
                params: { userName: userName || '', userPhone: userPhone || '' },
                state: {
                  routes: [{ name: 'Home', params: { userName: userName || '', userPhone: userPhone || '' } }],
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
                params: { userName: userName || '', userPhone: userPhone || '' },
                state: {
                  routes: [{ name: 'Cart', params: { userName: userName || '', userPhone: userPhone || '' } }],
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
                params: { userName: userName || '', userPhone: userPhone || '' },
                state: {
                  routes: [{ name: 'Profile', params: { userName: userName || '', userPhone: userPhone || '' } }],
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

export default MyAddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'green', padding: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: { flex: 1 },
  contentContainer: { width: '100%' },
  
  addressSection: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333',
    marginRight: 8,
    marginLeft: 28, /* This aligns with the text after the location icon */
  },
  
  defaultBadge: {
    backgroundColor: '#ffebee', // Light red background
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  defaultBadgeText: {
    color: '#f44336', // Red text
    fontSize: 12,
    fontWeight: '500',
  },

  editButton: {
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },

  editButtonText: {
    color: 'green',
    fontSize: 12,
    fontWeight: '500',
  },
  
  addressContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  pinIcon: {
    marginRight: 8,
  },
  
  addressText: { 
    flex: 1,
    fontSize: 13, 
    color: 'gray',
    marginBottom: 2,
  },
  
  phoneText: {
    flex: 1,
    fontSize: 13,
    color: 'gray',
    fontWeight: '500',
    marginLeft: 28, /* This aligns with the text after the location icon */
  },

  bottomSection: {
    paddingVertical: 10,
  },

  addAddressButton: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  addIcon: {
    marginRight: 8,
  },

  addAddressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

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
