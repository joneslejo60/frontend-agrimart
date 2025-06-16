import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';

type NotificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotificationScreen'>;

const NotificationScreen = () => {
  const navigation = useNavigation<NotificationScreenNavigationProp>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Sample notification data with dates
  const notifications = [
    {
      id: 1,
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed and is being prepared.',
      time: '2 hours ago',
      date: new Date(),
      isRead: false,
    },
    {
      id: 2,
      title: 'Delivery Update',
      message: 'Your order is out for delivery and will arrive in 30 minutes.',
      time: '1 day ago',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: 3,
      title: 'Special Offer',
      message: 'Get 20% off on your next order. Use code SAVE20.',
      time: '2 days ago',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
    },
    {
      id: 4,
      title: 'New Products Available',
      message: 'Check out our fresh arrivals in the vegetables section.',
      time: '3 days ago',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
    },
  ];

  // Function to format date for grouping
  const formatDateGroup = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(date);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    notificationDate.setHours(0, 0, 0, 0);
    
    if (notificationDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (notificationDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return notificationDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups: { [key: string]: typeof notifications }, notification) => {
    const dateGroup = formatDateGroup(notification.date);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(notification);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="green" barStyle="light-content" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-slash" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>You'll see your notifications here when you receive them</Text>
          </View>
        ) : (
          Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
            <View key={dateGroup} style={styles.dateGroup}>
              {/* Date Header */}
              <Text style={styles.dateHeader}>{dateGroup}</Text>
              
              {/* Notifications for this date */}
              {groupNotifications.map((notification) => (
                <TouchableOpacity key={notification.id} style={styles.notificationItem}>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.isRead && styles.unreadTitle
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    <Text style={[
                      styles.notificationMessage,
                      !notification.isRead && styles.unreadMessage
                    ]}>
                      {notification.message}
                    </Text>
                  </View>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

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
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  dateGroup: {
    marginBottom: 20,
  },

  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },

  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },

  notificationItem: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  notificationContent: {
    flex: 1,
  },

  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  unreadTitle: {
    fontWeight: 'bold',
    color: '#000',
  },

  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },

  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  unreadMessage: {
    color: '#333',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginLeft: 10,
  },
});