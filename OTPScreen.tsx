import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation.types';

type OtpScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>;

const OtpScreen = ({ route }: any) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPopup, setShowPopup] = useState(false);
  const { phoneNumber } = route.params;
  const navigation = useNavigation<OtpScreenNavProp>();

  // Handles OTP input changes
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus on next input
    if (text !== '' && index < 3) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  // Verify OTP
  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '1234') {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigation.replace('EnterName', { phoneNumber });
      }, 1500);
    } else {
      Alert.alert('Incorrect OTP', 'Please enter the correct OTP');
    }
  };

  // Array of input refs for auto-focus
  const otpRefs = Array(4)
    .fill(null)
    .map(() => useRef<TextInput>(null));

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" translucent={false} />
      <Image source={require('../../assets/splash2.png')} style={styles.logo} />
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        OTP sent to +91-{phoneNumber.replace(/^(\d{6})/, '******')}
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={otpRefs[index]}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>

      {/* Resend OTP */}
      <TouchableOpacity style={styles.resend}>
        <Text style={styles.resendText}>Not received OTP?</Text>
        <Text style={styles.resendBold}>Resend</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <View style={styles.popupBox}>
            <Image source={require('../../assets/tick.png')} style={styles.tick} />
            <Text style={styles.popupText}>OTP Verified Successfully!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  logo: { 
    width: 150, 
    height: 50, 
    resizeMode: 'contain', 
    alignSelf: 'flex-start',
    marginLeft: 0, // Ensure no left margin
    marginTop: 40, // Add some top margin to match LogoHeader
  },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 14, color: 'gray', marginVertical: 10 },

  // OTP Boxes
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    borderRadius: 8,
  },

  // Resend OTP Centered
  resend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  resendText: { fontSize: 16, color: 'black' },
  resendBold: { fontSize: 16, color: '#222', fontWeight: 'bold', marginLeft: 5 },

  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  popupBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  tick: {
    width: 60,
    height: 60,
  },
});
