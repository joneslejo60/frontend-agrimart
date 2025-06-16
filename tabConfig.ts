
import { ComponentType } from 'react';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';


export interface TabConfig {
  name: keyof import('./navigation.types').HomeTabsParamList;  // Screen identifier
  component: ComponentType<any>;                               // The actual screen component
  iconName: string;                                           // Ionicon name for visual representation
  label: string;                                              // User-friendly display name
}


export const tabConfigs: TabConfig[] = [
  {
    name: 'Home',
    component: HomeScreen,
    iconName: 'home-outline',      // 🏡 Universal symbol for "home base"
    label: 'Home',
  },

  {
    name: 'Cart',
    component: CartScreen,
    iconName: 'cart-outline',      // 🛒 Shopping cart - familiar e-commerce icon
    label: 'Cart',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    iconName: 'person-outline',    // 👤 Personal space indicator
    label: 'Profile',
  },
];


export const tabBarOptions = {
  activeTintColor: 'green',        // 🟢 Brand color for selected tabs - draws attention
  inactiveTintColor: 'gray',       // ⚫ Subtle gray for unselected tabs - reduces visual noise
  style: {
    paddingBottom: 5,              // Comfortable spacing from screen bottom
    paddingTop: 5,                 // Breathing room above icons
    height: 60,                    // Optimal height for thumb-friendly tapping
  },
};