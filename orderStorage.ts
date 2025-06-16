import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cartStorage';

export interface Order {
  id: string;
  orderId: string;
  date: string;
  month: string;
  year: string;
  status: 'delivered' | 'processing' | 'cancelled';
  items: CartItem[];
  totalAmount: number;
  address: any;
}

const ORDERS_STORAGE_KEY = '@orders';

// Generate a random order ID
export const generateOrderId = (): string => {
  const randomNum = Math.floor(Math.random() * 100000);
  return `#ORD${randomNum.toString().padStart(5, '0')}`;
};

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersData = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    return ordersData ? JSON.parse(ordersData) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Save a new order
export const saveOrder = async (newOrder: Order): Promise<void> => {
  try {
    const currentOrders = await getOrders();
    const updatedOrders = [newOrder, ...currentOrders]; // Add new order at the beginning
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

// Create a new order from cart items
export const createOrderFromCart = async (
  cartItems: CartItem[],
  totalAmount: number,
  address: any
): Promise<Order> => {
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(2);
  const monthName = months[now.getMonth()];
  const yearFull = now.getFullYear().toString();
  
  const order: Order = {
    id: Date.now().toString(),
    orderId: generateOrderId(),
    date: `${day}/${month}/${year}`,
    month: monthName,
    year: yearFull,
    status: 'processing',
    items: cartItems,
    totalAmount,
    address
  };
  
  await saveOrder(order);
  return order;
};