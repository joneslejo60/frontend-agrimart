import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';

type EnterNameNavProp = NativeStackNavigationProp<RootStackParamList, 'EnterName'>;
type EnterNameRouteProp = RouteProp<RootStackParamList, 'EnterName'>;

const EnterNameScreen = ({ route }: { route: EnterNameRouteProp }) => {
  const [name, setName] = useState('');
  const navigation = useNavigation<EnterNameNavProp>();

  // Only allow alphabetic characters and spaces
  const handleNameChange = (text: string) => {
    // Replace any non-alphabetic character or space with empty string
    const alphabeticValue = text.replace(/[^a-zA-Z\s]/g, '');
    setName(alphabeticValue);
  };

  const handleNext = () => {
    if (name.trim().length > 0) {
      // Placeholder for backend name saving API call
      navigation.replace('HomeTabs', {
        userName: name,
        userPhone: route.params.phoneNumber
      });
    } else {
      // Show alert if name is empty
      Alert.alert('Validation Error', 'Please enter your name');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" translucent={false} />
      <Image source={require('../../assets/splash2.png')} style={styles.logo} />
      <Text style={styles.title}>Your Name!</Text>
      <Text style={styles.subtitle}>
        Enter your name to customize service preferences
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={handleNameChange}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EnterNameScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  logo: { width: 150, height: 50, resizeMode: 'contain', alignSelf: 'flex-start' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 30 },
  subtitle: { fontSize: 14, color: 'gray', marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
  },
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
