import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList, HomeTabsParamList } from '../navigation/navigation.types';
import { getCartItems, saveCartItems, CartItem as CartItemType } from '../utils/cartStorage';

type GroceriesScreenRouteProp = RouteProp<RootStackParamList, 'GroceriesScreen'>;
type GroceriesScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'GroceriesScreen'>,
  BottomTabNavigationProp<HomeTabsParamList>
>;

interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = (screenWidth - 45) / 2; // 45 = padding + gap

const GroceriesScreen = () => {
  const route = useRoute<GroceriesScreenRouteProp>();
  const navigation = useNavigation<GroceriesScreenNavigationProp>();
  const { userName = '', userPhone = '' } = route.params || {};
  
  const [searchText, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart items from storage when component mounts or when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadCartItems = async () => {
        try {
          const storedCartItems = await getCartItems();
          setCartItems(storedCartItems);
        } catch (error) {
          console.error('Error loading cart items:', error);
        }
      };
      
      loadCartItems();
    }, [])
  );

  // Sample grocery products data - replace with your actual data
  const products: Product[] = [
    {
      id: 'groc-1',
      name: 'Fresh Tomatoes',
      price: 50,
      image: require('../../assets/logo.png'), // Replace with actual product image
      description: 'Fresh organic tomatoes'
    },
    {
      id: 'groc-2',
      name: 'Basmati Rice',
      price: 120,
      image: require('../../assets/logo.png'), // Replace with actual product image
      description: 'Premium basmati rice 1kg'
    },
    {
      id: 'groc-3',
      name: 'Fresh Milk',
      price: 60,
      image: require('../../assets/logo.png'), // Replace with actual product image
      description: 'Fresh dairy milk 1L'
    },
    {
      id: 'groc-4',
      name: 'Wheat Flour',
      price: 80,
      image: require('../../assets/logo.png'), // Replace with actual product image
      description: 'Whole wheat flour 1kg'
    },
    {
      id: 'groc-5',
      name: 'Fresh Onions',
      price: 40,
      image: require('../../assets/logo.png'), // Replace with actual product image
      description: 'Fresh red onions 1kg'
    },
    {
      id: 'groc-6',
      name: 'Cooking Oil',
      price: 150,
      image: require('../../assets/logo.png'), // Replace with actual product image
      description: 'Sunflower cooking oil 1L'
    },
  ];

  // Filter products based on search text
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getCartItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = async (product: Product) => {
    try {
      // Get current cart items from storage
      const currentCart = await getCartItems();
      
      // Add source property to identify as groceries
      const productWithSource = { ...product, source: 'groceries' as const };
      
      // Check if item exists
      const existingItem = currentCart.find(item => item.id === product.id);
      
      let updatedCart: CartItem[];
      if (existingItem) {
        // Update quantity of existing item
        updatedCart = currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...currentCart, { ...productWithSource, quantity: 1 }];
      }
      
      // Save updated cart to storage
      await saveCartItems(updatedCart);
      
      // Update local state for UI
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      // Get current cart items from storage
      const currentCart = await getCartItems();
      
      // Find the item
      const existingItem = currentCart.find(item => item.id === productId);
      
      let updatedCart: CartItem[];
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity
        updatedCart = currentCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove item completely
        updatedCart = currentCart.filter(item => item.id !== productId);
      }
      
      // Save to storage
      await saveCartItems(updatedCart);
      
      // Update UI
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const quantity = getCartItemQuantity(item.id);

    return (
      <View style={styles.productCard}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.productPrice, { color: 'black' }]}>₹{item.price}</Text>
        
        {quantity === 0 ? (
          <TouchableOpacity 
            style={styles.addToCartButton} 
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => removeFromCart(item.id)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity.toString().padStart(2, '0')}</Text>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => addToCart(item)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="green" barStyle="light-content" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Groceries</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={16} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search groceries"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.tabButton}
            activeOpacity={0.6}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ 
                  name: 'HomeTabs', 
                  params: { userName, userPhone },
                  state: {
                    routes: [{ name: 'Home', params: { userName, userPhone } }],
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
            onPress={async () => {
              // Get the latest cart items from storage
              const storedCartItems = await getCartItems();
              
              navigation.reset({
                index: 0,
                routes: [{ 
                  name: 'HomeTabs', 
                  params: { userName, userPhone },
                  state: {
                    routes: [{ name: 'Cart', params: { userName, userPhone, cartItems: storedCartItems } }],
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
                  params: { userName, userPhone },
                  state: {
                    routes: [{ name: 'Profile', params: { userName, userPhone } }],
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
    </>
  );
};

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
    paddingVertical: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },

  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'gray',
  },
  productsContainer: {
    padding: 15,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: itemWidth,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    justifyContent: 'space-between',
    minHeight: 250,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    minHeight: 35, // Ensure consistent height
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00AA00',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    marginTop: 'auto', // Push to bottom
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
    height: 46,
    marginTop: 'auto', // Push to bottom
  },
  quantityButton: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 15,
    minWidth: 25,
    textAlign: 'center',
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
  },
});

export default GroceriesScreen;