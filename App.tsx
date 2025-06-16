import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/components/SplashScreen'; 
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OTPScreen'; 
import EnterNameScreen from './src/screens/EnterNameScreen';  
import { RootStackParamList } from './src/navigation/navigation.types'; 
import HomeTabs from './src/navigation/HomeTabs';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import MyAddressScreen from './src/screens/MyAddressScreen';
import EditAddressScreen from './src/screens/EditAddressScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import OrderNowScreen from './src/screens/OrderNowScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import AgriInputScreen from './src/screens/AgriInputScreen';
import GroceriesScreen from './src/screens/Groceriesscreen';
import ClimateScreen from './src/screens/ClimateScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const App: React.FC = () => {
  useEffect(() => {
    // Set white status bar for initial screens
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
    
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(false);
    }
  }, []);

  return (
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="EnterName" component={EnterNameScreen} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="MyAddress" component={MyAddressScreen} />
          <Stack.Screen name="EditAddress" component={EditAddressScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="OrderNow" component={OrderNowScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="AgriInputScreen" component={AgriInputScreen} />
          <Stack.Screen name="GroceriesScreen" component={GroceriesScreen} />
          <Stack.Screen name="ClimateScreen" component={ClimateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
