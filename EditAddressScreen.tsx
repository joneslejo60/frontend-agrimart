import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// Define the types that aren't exported from the geolocation package
interface GeoPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';

// Get device dimensions for responsive layout
const { width, height } = Dimensions.get('window');

type EditAddressScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditAddress'>;
type EditAddressScreenRouteProp = RouteProp<RootStackParamList, 'EditAddress'>;

const EditAddressScreen = () => {
  const navigation = useNavigation<EditAddressScreenNavigationProp>();
  const route = useRoute<EditAddressScreenRouteProp>();
  
  const { userName, userPhone, addressData } = route.params || {};

  // Check if this is a new address from route params
  const isNewAddress = route.params?.isNewAddress || false;
  
  // For new addresses, use empty strings instead of defaults
  const [addressType, setAddressType] = useState(isNewAddress ? 'Home' : (addressData?.type || 'Home'));
  const [address, setAddress] = useState(isNewAddress ? '' : (addressData?.address || ''));
  const [pincode, setPincode] = useState(isNewAddress ? '' : (addressData?.pincode || ''));
  const [phoneNumber, setPhoneNumber] = useState(isNewAddress ? userPhone || '' : (addressData?.phone || userPhone || ''));

  // State to track if map functionality should be enabled
  const [useMapFunctionality, setUseMapFunctionality] = useState(false);
  const [locationString, setLocationString] = useState('');
  // State to track if map is expanded
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // State for map coordinates
  const [mapCoordinates, setMapCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  
  // Try to load maps only after component is fully mounted
  useEffect(() => {
    // Initialize map with default coordinates
    setMapCoordinates({latitude: 28.6139, longitude: 77.2090}); // Default to Delhi
    setLocationString('Getting your location...');
  }, []);

  // Set address from location string when it changes
  useEffect(() => {
    if (locationString && address === '') {
      setAddress(locationString);
    }
  }, [locationString]);
  
  // Initialize static map when component mounts (no geolocation)
  useEffect(() => {
    // Set default Delhi coordinates
    const latitude = 28.6139;
    const longitude = 77.2090;
    
    // Update the map coordinates
    setMapCoordinates({ latitude, longitude });
    
    // Update the location string
    setLocationString(`Static map location: Delhi (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
    
    console.log('Static map initialized - no geolocation required');
  }, []);

  // Function to show static map location (no geolocation)
  const getCurrentLocation = () => {
    // Use fixed coordinates for Delhi
    const latitude = 28.6139;
    const longitude = 77.2090;
    setMapCoordinates({ latitude, longitude });
    setLocationString(`Using default map location: Delhi (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
    
    // Alert the user that we're using a static location
    Alert.alert(
      "Static Map Location",
      "Using default location (Delhi). No geolocation required.",
      [{ text: "OK" }]
    );
  };

  // Handle get location button press - using static map without geolocation
  const handleGetLocation = () => {
    try {
      // Use fixed coordinates for Delhi
      const latitude = 28.6139;
      const longitude = 77.2090;
      
      // Update the map coordinates
      setMapCoordinates({ latitude, longitude });
      
      // Update the location string
      setLocationString(`Using static map location: Delhi (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
      
      // Alert the user about the static map
      Alert.alert(
        "Static Map",
        "Using a static map with Delhi coordinates. No location permissions required.",
        [{ text: "OK" }]
      );
      
    } catch (error) {
      console.error('Static map error:', error);
      setLocationString('Error displaying static map. Please enter address manually.');
    }
  };

  // Show maps UI (commented out because it causes crashes)
  const enableMaps = () => {
    Alert.alert(
      "Maps Disabled",
      "Maps functionality is temporarily disabled to prevent crashes. Please enter your address manually.",
      [{ text: "OK" }]
    );
  };
  
  const handleSave = () => {
    // Validate all fields are filled
    if (!addressType.trim() || !address.trim() || !pincode.trim() || !phoneNumber.trim()) {
      Alert.alert('Please fill all fields');
      return;
    }
    
    const updatedAddress = {
      type: addressType,
      address: address,
      pincode: pincode,
      phone: phoneNumber
    };

    // Pass back the isNewAddress flag and addressIndex from the route params
    navigation.navigate('MyAddress', {
      userName: userName,
      userPhone: userPhone,
      addressData: updatedAddress,
      isNewAddress: route.params?.isNewAddress,
      addressIndex: route.params?.addressIndex,
      source: route.params?.source  // Pass along the source parameter
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      {/* Fixed position transparent exit button - always visible when map is expanded */}
      {isMapExpanded && (
        <TouchableOpacity 
          style={styles.fixedExitButton}
          onPress={() => setIsMapExpanded(false)}
        >
          <Text style={styles.fixedExitButtonText}>EXIT MAP</Text>
          <Icon name="close" size={20} color="white" style={{marginLeft: 5}} />
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{isNewAddress ? 'Add New Address' : 'Edit Address'}</Text>
        {/* Header exit button removed */}
      </View>
      
      <ScrollView style={[styles.content, isMapExpanded && styles.hiddenContent]} contentContainerStyle={styles.contentContainer}>
        {/* Simple Map with Pointer */}
        <View style={styles.locationContainer}>
          {/* Add simple transparent exit button when map is expanded */}
          {isMapExpanded && (
            <TouchableOpacity 
              style={styles.simpleExitButton}
              onPress={() => setIsMapExpanded(false)}
            >
              <Text style={styles.simpleExitButtonText}>EXIT MAP</Text>
              <Icon name="close" size={20} color="white" style={{marginLeft: 5}} />
            </TouchableOpacity>
          )}
          
          <View 
            style={[
              styles.mapContainerAlt, 
              isMapExpanded && styles.expandedMapContainer
            ]}
          >
            {/* Map content inside a touchable area */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.9}
              onPress={() => setIsMapExpanded(!isMapExpanded)}
            >
              {/* Map placeholder - will be replaced with actual map implementation */}
              <View style={[
                styles.mapPlaceholderAlt,
                isMapExpanded && styles.expandedMapPlaceholder
              ]}>
                <View style={styles.mapContent}>
                  {/* Enhanced static map of Delhi */}
                  <View style={styles.mapBackground}>
                    <View style={styles.mapRoad1} />
                    <View style={styles.mapRoad2} />
                    <View style={styles.mapWater} />
                    <View style={styles.mapGreen1} />
                    <View style={styles.mapGreen2} />
                    
                    {/* Delhi label */}
                    <View style={styles.mapLabelContainer}>
                      <Text style={styles.mapLabelText}>DELHI</Text>
                    </View>
                  </View>
                  
                  {/* Map Marker */}
                  <View style={styles.markerContainer}>
                    <View style={styles.markerShadow} />
                    <View style={styles.markerPin}>
                      <Icon name="location-on" size={36} color="red" />
                    </View>
                    <View style={styles.markerPulse} />
                  </View>
                  
                  {/* Coordinates display */}
                  {mapCoordinates && (
                    <View style={styles.coordinatesContainer}>
                      <Text style={styles.coordinatesText}>
                        Delhi: {mapCoordinates.latitude.toFixed(4)}, {mapCoordinates.longitude.toFixed(4)}
                      </Text>
                    </View>
                  )}
                  

                </View>
              </View>
              
              <View style={styles.mapOverlay}>
                <Text style={styles.mapAddressText}>
                  {isMapExpanded ? 'Tap to collapse map' : 'Tap to expand map'}
                </Text>
              </View>
            </TouchableOpacity>
            
            {/* Map controls when expanded - outside the touchable area */}
            {isMapExpanded && (
              <View style={styles.expandedMapControlsContainer}>
                {/* Title */}
                <View style={styles.mapTitleContainer}>
                  <Text style={styles.mapTitle}>Static Location Map</Text>
                  <Text style={styles.mapSubtitle}>This is a static map (no geolocation)</Text>
                </View>
                
                {/* Default location button */}
                <TouchableOpacity 
                  style={styles.currentLocationButton}
                  onPress={getCurrentLocation}
                >
                  <Ionicons name="location" size={24} color="#333" />
                  <Text style={{fontSize: 10, marginTop: 2, color: '#333'}}>Delhi</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Transparent Exit button at bottom - completely outside touchable area */}
            {isMapExpanded && (
              <TouchableOpacity 
                style={styles.exitMapButton}
                onPress={() => setIsMapExpanded(false)}
              >
                <Text style={styles.exitMapButtonText}>EXIT MAP</Text>
                <Icon name="close" size={20} color="white" style={{marginLeft: 5}} />
              </TouchableOpacity>
            )}
            
            {/* Transparent Exit button at bottom - completely outside touchable area */}
            {isMapExpanded && (
              <TouchableOpacity 
                style={styles.exitMapButton}
                onPress={() => setIsMapExpanded(false)}
              >
                <Text style={styles.exitMapButtonText}>EXIT MAP</Text>
                <Icon name="close" size={20} color="white" style={{marginLeft: 5}} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Address Type</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={addressType}
              onChangeText={setAddressType}
              placeholder="e.g., Farm/Home"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Address</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Street address, area, city"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Pincode</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={pincode}
              onChangeText={setPincode}
              placeholder="6-digit pincode"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="10-digit mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    flex: 1,
  },
  headerExitButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  headerExitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 15,
  },
  contentContainer: {
    paddingTop: 0,
  },
  hiddenContent: {
    opacity: 0,
  },
  locationContainer: {
    marginBottom: 20,
    margin: 0,
    padding: 0,
    marginHorizontal: -15, // Extend beyond parent padding
    width: width, // Full screen width
  },
  locationPlaceholder: {
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationMessage: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
    fontSize: 14,
  },
  locationButtonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  locationButton: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  mapsButton: {
    backgroundColor: '#4285F4',
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  // Map styles
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  mapPlaceholder: {
    backgroundColor: '#eaf5ea',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  mapRoad1: {
    position: 'absolute',
    height: 30,
    width: '100%',
    backgroundColor: '#c0c0c0',
    top: '40%',
  },
  mapRoad2: {
    position: 'absolute',
    width: 30,
    height: '100%',
    backgroundColor: '#c0c0c0',
    left: '30%',
  },
  mapWater: {
    position: 'absolute',
    height: '25%',
    width: '35%',
    backgroundColor: '#b3d9ff',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 50,
  },
  mapGreen1: {
    position: 'absolute',
    height: '20%',
    width: '25%',
    backgroundColor: '#a6d785',
    top: 10,
    left: 10,
    borderRadius: 10,
  },
  mapGreen2: {
    position: 'absolute',
    height: '15%',
    width: '20%',
    backgroundColor: '#a6d785',
    bottom: '30%',
    right: '10%',
    borderRadius: 8,
  },
  mapLabelContainer: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mapLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  staticMapLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  staticMapLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coordinatesContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
  coordinatesText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'monospace',
  },
  simpleExitButton: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  simpleExitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  markerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    zIndex: 3,
  },
  markerShadow: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 3,
    zIndex: 1,
  },
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    bottom: -10,
    zIndex: 2,
    opacity: 0.7,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
  },
  mapAddressText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  // Additional map styles
  mapContainerAlt: {
    marginBottom: 20,
    borderRadius: 0,
    overflow: 'hidden',
    zIndex: 1,
    margin: 0,
    padding: 0,
  },
  expandedMapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60, // Leave space for bottom tab
    zIndex: 500, // Higher z-index to appear above everything
    elevation: 20, // For Android
    marginBottom: 0,
    borderRadius: 0,
    marginHorizontal: 0,
    backgroundColor: '#f0f0f0', // Add background color to make it visible
  },
  mapWrapper: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoading: {
    height: 220,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  mapError: {
    height: 220,
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 15,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  currentLocationButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 200,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  mapHelpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  mapPlaceholderAlt: {
    height: height * 0.25, // 25% of screen height
    backgroundColor: '#f8f8f8',
    borderRadius: 0,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  expandedMapPlaceholder: {
    height: '100%',
    width: '100%',
    borderRadius: 0,
    backgroundColor: '#eef7fe', // Light blue background for the map
  },
  expandedMapControlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Only cover the top portion
    paddingTop: 10,
    zIndex: 1000,
    elevation: 30,
    pointerEvents: 'box-none',
  },
  mapBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  mapTitleContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 150,
  },
  mapTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  mapSubtitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  exitMapButton: {
    position: 'absolute',
    bottom: 20,
    left: 70,
    right: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // Ensure it's above everything
    elevation: 9999, // Ensure it's above everything on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  exitMapButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  tryMapButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tryMapButtonText: {
    color: '#666',
    fontSize: 14,
  },
  androidAddressNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0f0e0',
  },
  androidAddressText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  // Form fields
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  textInput: {
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
  },
  fixedExitButton: {
    position: 'absolute',
    bottom: 100,
    left: 50, 
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  fixedExitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default EditAddressScreen;