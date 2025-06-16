// src/screens/OrderNowScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';

type OrderNowScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderNow'>;
type OrderNowScreenRouteProp = RouteProp<RootStackParamList, 'OrderNow'>;

interface OrderItem {
  id: string;
  productName: string;
  quantity: string;
  units: string;
}

const OrderNowScreen = () => {
  const navigation = useNavigation<OrderNowScreenNavigationProp>();
  const route = useRoute<OrderNowScreenRouteProp>();
  const { userName = '', userPhone = '' } = route.params || {};
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '1', productName: '', quantity: '', units: '' }
  ]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const addNewRow = () => {
    const newId = (orderItems.length + 1).toString();
    setOrderItems([...orderItems, { id: newId, productName: '', quantity: '', units: '' }]);
  };

  const removeRow = (id: string) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmitOrder = () => {
    setShowOrderSuccess(true);
  };

  const handleOrderSuccessClose = () => {
    setShowOrderSuccess(false);
  };

  const isProductNamePresent = () => {
    return orderItems.some(item => item.productName.trim() !== '');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manual Order</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell1}>S.N</Text>
          <Text style={styles.headerCell2}>Product Name</Text>
          <Text style={styles.headerCell3}>Qty</Text>
          <Text style={styles.headerCell4}>Units</Text>
          <Text style={styles.headerCell5}>Action</Text>
        </View>

        {orderItems.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <View style={styles.cell1}>
              <Text style={styles.serialNumber}>{index + 1}</Text>
            </View>
            <View style={styles.cell2}>
              <TextInput
                style={styles.input}
                placeholder="Enter the product name"
                value={item.productName}
                onChangeText={(text) => updateItem(item.id, 'productName', text)}
              />
            </View>
            <View style={styles.cell3}>
              <TextInput
                style={styles.input}
                value={item.quantity}
                onChangeText={(text) => updateItem(item.id, 'quantity', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.cell4}>
              <TextInput
                style={styles.input}
                value={item.units}
                onChangeText={(text) => updateItem(item.id, 'units', text)}
              />
            </View>
            <View style={styles.cell5}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeRow(item.id)}
                disabled={orderItems.length === 1}
              >
                <Icon 
                  name="delete" 
                  size={20} 
                  color={orderItems.length === 1 ? '#ccc' : '#555'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addNewRow}>
          <Icon name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add New Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: isProductNamePresent() ? 'green' : 'grey' }]}
          onPress={handleSubmitOrder}
          disabled={!isProductNamePresent()}
        >
          <Text style={styles.submitButtonText}>Submit Order</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('HomeTabs', { userName, userPhone })}
        >
          <Ionicons name="home-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('HomeTabs', { userName, userPhone })}
        >
          <Ionicons name="cart-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('HomeTabs', { userName, userPhone })}
        >
          <Ionicons name="person-outline" size={24} color="gray" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

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

export default OrderNowScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'green', padding: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  headerCell1: { flex: 0.8, textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#555' },
  headerCell2: { flex: 3, textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#555', paddingHorizontal: 5 },
  headerCell3: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#555' },
  headerCell4: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#555' },
  headerCell5: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#555' },
  cell1: { flex: 0.8, alignItems: 'center', justifyContent: 'center' },
  cell2: { flex: 3, paddingHorizontal: 5 },
  cell3: { flex: 1, paddingHorizontal: 2 },
  cell4: { flex: 1, paddingHorizontal: 2 },
  cell5: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  serialNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    backgroundColor: 'transparent',
    minHeight: 32,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#888',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30, // Increased marginBottom for more space
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 15, // Existing margin for vertical spacing
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 280,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  successIcon: {
    marginTop: 20,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
