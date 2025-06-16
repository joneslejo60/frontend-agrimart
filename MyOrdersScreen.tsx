

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';
import { getOrders, Order } from '../utils/orderStorage';
import { saveCartItems } from '../utils/cartStorage';


type MyOrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyOrders'>;
type MyOrdersScreenRouteProp = RouteProp<RootStackParamList, 'MyOrders'>;


const MyOrdersScreen = () => {
  const navigation = useNavigation<MyOrdersScreenNavigationProp>();
  const route = useRoute<MyOrdersScreenRouteProp>();
  
  const { userName, userPhone } = route.params || {};
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Sample orders as fallback if no real orders exist
  const sampleOrders = [
    {
      id: "sample-1",
      month: 'March',
      year: '2024',
      status: 'delivered' as const,
      date: '15/03/24',
      orderId: '#ORD12345',
      totalAmount: 120,
      address: null,
      items: [{
        id: "sample-item-1",
        name: 'Fresh Organic Tomatoes',
        quantity: 2,
        price: 60,
        image: 'https://via.placeholder.com/60x60/4CAF50/white?text=🍅'
      }]
    },
    {
      id: "sample-2",
      month: 'February',
      year: '2024',
      status: 'delivered' as const,
      date: '28/02/24',
      orderId: '#ORD12343',
      totalAmount: 150,
      address: null,
      items: [{
        id: "sample-item-2",
        name: 'Fresh Broccoli',
        quantity: 1,
        price: 150,
        image: 'https://via.placeholder.com/60x60/4CAF50/white?text=🥦'
      }]
    }
  ];

  // Load orders when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const loadOrders = async () => {
        try {
          const storedOrders = await getOrders();
          setOrders(storedOrders.length > 0 ? storedOrders : sampleOrders);
        } catch (error) {
          console.error('Error loading orders:', error);
          setOrders(sampleOrders); // Fallback to sample orders on error
        }
      };
      
      loadOrders();
    }, [])
  );

  // Group orders by month and year
  const groupedOrders = orders.reduce((acc, order) => {
    const key = `${order.month} ${order.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(groupedOrders).map(([monthYear, orders]) => (
          <View key={monthYear}>
            <Text style={styles.monthYearHeader}>{monthYear}</Text>
            
            {orders.map((order) => (
              <View key={order.id} style={styles.orderContainer}>
                <View style={styles.orderHeader}>
                  <View style={[
                    styles.statusBox,
                    order.status === 'delivered' ? styles.deliveredBox : 
                    order.status === 'processing' ? styles.processingBox : 
                    styles.cancelledBox
                  ]}>
                    <Text style={[
                      styles.statusText,
                      order.status === 'delivered' ? styles.deliveredText : 
                      order.status === 'processing' ? styles.processingText : 
                      styles.cancelledText
                    ]}>
                      {order.status === 'delivered' ? 'Delivered' : 
                       order.status === 'processing' ? 'Processing' : 
                       'Cancelled'}: {order.date}
                    </Text>
                  </View>
                  <Text style={styles.orderIdText}>Order ID: {order.orderId}</Text>
                </View>
                
                <View style={styles.separator} />
                
                <View style={styles.productAndButtonContainer}>
                  {/* Show main item like in original design */}
                  {order.items && order.items.length > 0 && (
                    <View style={styles.productContainer}>
                      <Image 
                        source={
                          typeof order.items[0].image === 'string' 
                            ? { uri: order.items[0].image } 
                            : order.items[0].image
                        } 
                        style={styles.productImage} 
                      />
                      
                      <View style={styles.productDetails}>
                        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                          {order.items[0].name}
                          {order.items.length > 1 ? ` & ${order.items.length - 1} more` : ''}
                        </Text>
                        <Text style={styles.productQuantity}>Qty: {order.items[0].quantity}</Text>
                        <Text style={styles.productPrice}>₹{order.items[0].price}</Text>
                      </View>
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.orderAgainButton} 
                    activeOpacity={0.8}
                    onPress={async () => {
                      // Add all items from this order to cart (keeping the original UI but with enhanced functionality)
                      try {
                        await saveCartItems(order.items);
                        
                        // Navigate to cart using the same navigation approach as the original
                        navigation.reset({
                          index: 0,
                          routes: [{ 
                            name: 'HomeTabs', 
                            params: { userName: userName || '', userPhone: userPhone || '' },
                            state: {
                              routes: [
                                { name: 'Home', params: { userName: userName || '', userPhone: userPhone || '' } },
                                { name: 'Cart', params: { 
                                  userName: userName || '', 
                                  userPhone: userPhone || '',
                                  cartItems: order.items,
                                  selectedAddress: order.address
                                } },
                                { name: 'Profile', params: { userName: userName || '', userPhone: userPhone || '' } }
                              ],
                              index: 1,
                            }
                          }],
                        });
                      } catch (error) {
                        console.error('Error re-ordering:', error);
                      }
                    }}
                  >
                    <Text style={styles.orderAgainText}>Order Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
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
                  routes: [
                    { name: 'Home', params: { userName: userName || '', userPhone: userPhone || '' } },
                    { name: 'Cart', params: { userName: userName || '', userPhone: userPhone || '' } },
                    { name: 'Profile', params: { userName: userName || '', userPhone: userPhone || '' } }
                  ],
                  index: 1, // Cart tab index
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
                  routes: [
                    { name: 'Home', params: { userName: userName || '', userPhone: userPhone || '' } },
                    { name: 'Cart', params: { userName: userName || '', userPhone: userPhone || '' } },
                    { name: 'Profile', params: { userName: userName || '', userPhone: userPhone || '' } }
                  ],
                  index: 2, // Profile tab index
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

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'green', padding: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: { flex: 1, paddingVertical: 20, paddingHorizontal: 0 },

  // 📅 Month-Year Header Styles
  monthYearHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
    paddingHorizontal: 20,
  },

  // 📦 Order Container Styles
  orderContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 0,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },

  // 📋 Order Header Styles
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 5,
  },

  // 📦 Status Box Styles
  statusBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  deliveredBox: {
    backgroundColor: '#E3F2FD', // Light blue background
  },

  cancelledBox: {
    backgroundColor: '#FFEBEE', // Light red background
  },
  
  processingBox: {
    backgroundColor: '#FFF8E1', // Light amber background
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  deliveredText: {
    color: '#1565C0', // Dark blue text
  },

  cancelledText: {
    color: '#C62828', // Dark red text
  },
  
  processingText: {
    color: '#F57F17', // Dark amber text
  },

  orderIdText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  separator: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },

  // 🛍️ Product and Button Container
  productAndButtonContainer: {
    flexDirection: 'column',
    paddingHorizontal: 5,
  },

  // 🛍️ Product Container Styles
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  // 🖼️ Product Image
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: 10,
  },

  // 📝 Product Details
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  productQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  // 🔄 Order Again Button
  orderAgainButton: {
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 6,
  },

  orderAgainText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // 🧭 Bottom Navigation Styles
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