
export type RootStackParamList = {
  Splash: undefined;                                    
  Onboarding: undefined;                               // 📖 Feature introduction - standalone experience
  Login: undefined;                                    // 🔐 Phone number entry - fresh start
  Otp: { phoneNumber: string };                        // 📱 SMS verification - needs the phone number
  EnterName: { phoneNumber: string };                  // 👋 Personal greeting setup - carries phone number
  HomeTabs: { userName: string; userPhone: string; screen?: keyof HomeTabsParamList; params?: any };   // 🏠 Main app hub - personalized with user data
  PrivacyPolicy: undefined;                           // 📋 Legal transparency - accessible anytime
  Settings: undefined;                                 // ⚙️ User preferences - standalone configuration
  EditProfile: { userName?: string; userPhone?: string; profileImage?: string }; // ✏️ Profile editing - personalization
  MyAddress: { userName?: string; userPhone?: string; addressData?: any; source?: string; isNewAddress?: boolean; addressIndex?: number }; // 📍 Address management - delivery locations with user data
  EditAddress: { userName?: string; userPhone?: string; addressData?: any; isNewAddress?: boolean; addressIndex?: number; source?: string }; // ✏️ Address editing - modify delivery location
  MyOrders: { userName?: string; userPhone?: string }; // 📦 Order management - purchase history and tracking
  OrderNow: { userName?: string; userPhone?: string }; // 🛒 Order placement - shopping experience
  NotificationScreen: undefined;                       // 🔔 Notifications - user alerts and updates
  AgriInputScreen: { userName?: string; userPhone?: string }; // 🌾 Agricultural inputs - farming supplies
  GroceriesScreen: { userName?: string; userPhone?: string }; // 🛒 Groceries - food and household items
  ClimateScreen: undefined;                                  // 🌤️ Weather and climate information
}

export type HomeTabsParamList = {
  Home: { userName?: string; userPhone?: string };      // 🏡 Main dashboard - user's starting point
  Cart: { userName?: string; userPhone?: string; selectedAddress?: any; cartItems?: any[] };      // 🛒 Shopping experience - manage purchases
  Profile: { userName?: string; userPhone?: string };   // 👤 Personal space - account management with user data
}