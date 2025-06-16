import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useRoute, useNavigation, RouteProp, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeTabsParamList, RootStackParamList } from '../navigation/navigation.types';
import { getCartItems, saveCartItems, CartItem } from '../utils/cartStorage';

type CartScreenRouteProp = RouteProp<HomeTabsParamList, 'Cart'>;
type CartScreenNavigationProp = any;

const CartScreen = () => {
  const route = useRoute<CartScreenRouteProp>();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { userName, userPhone, selectedAddress, cartItems: routeCartItems } = route.params || {};

  // Initialize cart items from route params, will be replaced with storage data
  const [cartItems, setCartItems] = useState(routeCartItems || []);
  
  // Load cart items from storage when component mounts
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedCartItems = await getCartItems();
        if (storedCartItems && storedCartItems.length > 0) {
          setCartItems(storedCartItems);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };
    
    loadCartItems();
  }, []);

  // Address state
  const [address, setAddress] = useState(selectedAddress);
  
  // Order success modal state
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Listen for address updates from MyAddress screen
  React.useEffect(() => {
    if (route.params?.selectedAddress) {
      setAddress(route.params.selectedAddress);
    }
  }, [route.params?.selectedAddress]);

  // Track the previous cart items to avoid double processing
  const previousCartItemsRef = React.useRef<any[] | null>(null);
  
  // Listen for cart items updates from other screens
  React.useEffect(() => {
    // Only process if we have cart items in params and they're different from previous
    if (route.params?.cartItems && route.params.cartItems !== previousCartItemsRef.current) {
      // Store reference to current cart items to prevent reprocessing
      previousCartItemsRef.current = route.params.cartItems;
      
      // Get the new items coming in
      const incomingItems = route.params.cartItems;
      
      setCartItems(currentItems => {
        // If we don't have current items, just use incoming items
        if (!currentItems || currentItems.length === 0) {
          return [...incomingItems];
        }
        
        // Create a map for quick lookups using ID as key
        const currentItemsMap = new Map();
        
        // Populate the map with current cart items
        currentItems.forEach(item => {
          currentItemsMap.set(item.id, {...item});
        });
        
        // Process each incoming item
        incomingItems.forEach(newItem => {
          // Check if this item already exists in cart
          if (currentItemsMap.has(newItem.id)) {
            // Get existing item
            const existingItem = currentItemsMap.get(newItem.id);
            
            // Replace with updated quantity (do not add quantities together)
            currentItemsMap.set(newItem.id, {
              ...newItem,
              quantity: newItem.quantity
            });
          } else {
            // Item doesn't exist in cart, add it
            currentItemsMap.set(newItem.id, {...newItem});
          }
        });
        
        // Convert map back to array
        return Array.from(currentItemsMap.values());
      });
    }
  }, [route.params]);

  // Handler to navigate to MyAddress screen and select address
  const handleSelectAddress = () => {
    navigation.navigate('MyAddress', {
      userName,
      userPhone,
      source: 'Cart'
    });
  };

  const updateQuantity = async (id: string, change: number) => {
    // Update cart items in state
    const updatedItems = cartItems.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0);
    
    // Update state
    setCartItems(updatedItems);
    
    // Save to storage
    try {
      await saveCartItems(updatedItems);
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const removeItem = async (id: string) => {
    // Remove item from cart
    const updatedItems = cartItems.filter(item => item.id !== id);
    
    // Update state
    setCartItems(updatedItems);
    
    // Save to storage
    try {
      await saveCartItems(updatedItems);
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      // Check if address is selected
      if (!address) {
        // Show alert or some UI feedback that address is required
        console.error('Please select a delivery address');
        return;
      }
      
      // Import createOrderFromCart here to avoid circular dependencies
      const { createOrderFromCart } = require('../utils/orderStorage');
      
      // Create order from cart items
      await createOrderFromCart(cartItems, total, address);
      
      // Show success modal
      setShowOrderSuccess(true);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handleOrderSuccessClose = async () => {
    setShowOrderSuccess(false);
    
    // Clear cart in state
    setCartItems([]);
    
    // Clear cart in storage
    try {
      await saveCartItems([]);
      // Stay on the current screen as per original design
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const navigateToHome = () => {
    try {
      // Try to navigate to Home tab
      navigation.navigate('Home');
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback: try jumpTo
      if (navigation.jumpTo) {
        navigation.jumpTo('Home');
      }
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cart</Text>
      </View>

      {/* Cart Content */}
      <ScrollView style={styles.content}>
        {cartItems.length > 0 && (
          <>
            {/* Cart Header Info */}
            <View style={styles.cartHeader}>
              <Text style={styles.itemsInCart}>Items in cart: {totalItems}</Text>
              <TouchableOpacity onPress={navigateToHome}
              >
                <Text style={styles.addMore}>Add more</Text>
              </TouchableOpacity>
            </View>

            {/* Cart Items */}
            {cartItems.map((item) => (
          <View key={item.id}>
            <View style={styles.cartItem}>
              {/* Product Image */}
              <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                style={styles.productImage} 
              />
              
              {/* Product Details */}
              <View style={styles.productDetails}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.productPrice}>₹{item.price}</Text>
                
                {/* Quantity Controls */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButtonLeft}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.quantityButtonRight}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Grey Line Separator */}
            <View style={styles.separator} />
          </View>
        ))}

            {/* Subtotal, GST, and Total */}
            <View style={styles.priceDetails}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal:</Text>
                <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>GST:</Text>
                <Text style={styles.priceValue}>₹{gst.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total:</Text>
                <Text style={styles.priceValue}>₹{total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.deliveryAddress}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressLabel}>Delivery Address:</Text>
                <TouchableOpacity onPress={handleSelectAddress}>
                  <Text style={styles.changeButton}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.addressValue}>
                {address ? (
                  `${address.type}\n${address.address}\n${address.pincode}\n${address.phone}`
                ) : 'No address selected'}
              </Text>
            </View>

            {/* Payment Mode */}
            <View style={styles.paymentMode}>
              <Text style={styles.paymentLabel}>Payment Mode:</Text>
              <View style={styles.paymentOption}>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
                <Ionicons name="checkmark-circle" size={20} color="green" />
              </View>
            </View>

            {/* Checkout Button */}
            <View style={styles.checkoutSection}>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <>
            {/* Empty Cart Header Info */}
            <View style={styles.cartHeader}>
              <Text style={styles.itemsInCart}>Items in cart: 0</Text>
            </View>

            {/* Empty Cart Content */}
            <View style={styles.emptyCartContainer}>
              {/* Cart Icon */}
              <View style={styles.emptyCartIcon}>
                <Ionicons name="cart-outline" size={80} color="#ccc" />
              </View>
            </View>

            {/* Check Products Button at Bottom */}
            <View style={styles.checkoutSection}>
              <TouchableOpacity style={styles.checkProductsButton} onPress={navigateToHome}>
                <Text style={styles.checkProductsText}>Check Products</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Order Success Modal */}
      {showOrderSuccess && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleOrderSuccessClose}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="green" />
            </View>
            
            <Text style={styles.successText}>Order Placed Successfully!</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  // 📱 Main container - Clean foundation
  container: { 
    flex: 1, 
    backgroundColor: '#fff'
  },

  // 🎯 Header section - Consistent with app design
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'green',
    padding: 15,
    paddingTop: 20
  },
  backButton: { 
    marginRight: 10,
    padding: 5
  },
  headerText: { 
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1
  },

  // 📋 Content area
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },

  // 🛒 Cart header with items count and add more
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  itemsInCart: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  addMore: {
    fontSize: 16,
    color: 'green',
    fontWeight: '500',
    textDecorationLine: 'underline'
  },

  // 🛍️ Cart item container
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff'
  },
  
  // 🖼️ Product image
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  
  // 📝 Product details section
  productDetails: {
    flex: 1,
    justifyContent: 'space-between'
  },
  
  // 🎯 Product header with name and delete
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  
  // 📝 Product name (2 lines max)
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
    lineHeight: 20
  },
  
  // 🗑️ Delete button
  deleteButton: {
    padding: 4
  },
  
  // 💰 Product price
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  
  // 🔢 Quantity controls container
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'green',
    borderRadius: 6,
    overflow: 'hidden'
  },
  
  // ➖➕ Quantity buttons
  quantityButtonLeft: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  
  quantityButtonRight: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  
  // 📊 Quantity display
  quantityDisplay: {
    backgroundColor: 'green',
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
    height: 32,
    justifyContent: 'center'
  },
  
  quantityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  
  // ➖ Grey separator line
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16
  },

  // 💰 Price details section
  priceDetails: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 16
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },

  // 📍 Delivery address section
  deliveryAddress: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 16
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  changeButton: {
    fontSize: 16,
    color: 'green',
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  addressValue: {
    fontSize: 16,
    color: '#333'
  },

  // 💳 Payment mode section
  paymentMode: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 16
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paymentText: {
    fontSize: 16,
    color: '#333'
  },

  // 🛒 Checkout section (inside scroll)
  checkoutSection: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // 🛒 Checkout button - Primary action
  bottomSummary: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10
  },

  // 📦 Empty cart state
  emptyCartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 80,
    flex: 1
  },
  emptyCartIcon: {
    marginBottom: 40
  },

  // 🛍️ Check Products Button
  checkProductsButton: {
    backgroundColor: 'green',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    alignSelf: 'center',
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkProductsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },

  // 🎉 Order Success Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 280
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5
  },
  successIcon: {
    marginTop: 20,
    marginBottom: 20
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  }
});