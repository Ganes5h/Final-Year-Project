import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { CommonActions } from "@react-navigation/native";
import StorageUtil from "../utilities/StorageUtil";
import { Picker } from '@react-native-picker/picker';

const apiUrl = Constants.expoConfig.extra.API_URL;

const RegisterPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return email.endsWith('@faculties.git.edu');
  };



  const handleRegister = async () => {
    // Validate input fields
    if (!name || !email || !phone || !registrationNumber) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

      if (!validateEmail(email)) {
        Alert.alert('Only college email with @students.git.edu is allowed');
        return;
      }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits.');
      return;
    }

    // Validate registration number (uppercase only)
    if (!/^[A-Z0-9]+$/.test(registrationNumber)) {
      Alert.alert('Error', 'Registration number must be in uppercase.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare request body exactly as specified
      const requestBody = {
        name: name,
        email: email,
        role: "faculty",
        department: department,
        registrationNumber: registrationNumber,
        phone: parseInt(phone)
      };

      const url = `${apiUrl}/admin/register`.replace(/([^:]\/)\/+/g, '$1');

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.log('Error response body:', errorResponse);
        throw new Error(`Registration failed: ${response.status}`);
      }

      const responseData = await response.json();

      Alert.alert(
          'Registration Successful!',
          'An email with further instructions has been sent to your registered email address.'
      );

      // Save response data to local storage
      await StorageUtil.encryptAndStore('UserData', JSON.stringify(responseData));

      // Navigate to Login page
      navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
      );
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Registration Error', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
    );
  };

  return (
      <ScrollView
          style={[styles.container]}
          contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <View style={styles.topSection}>
            <Text style={styles.loginText}>STUDENT REGISTER</Text>
          </View>
          <View style={styles.logoSection}>
            <Image source={require('../../assets/images/logo1.png')} style={styles.logo} />
          </View>
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#888" style={styles.icon} />
              <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#888" style={styles.icon} />
              <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={24} color="#888" style={styles.icon} />
              <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="school-outline" size={24} color="#888" style={styles.icon} />
              <TextInput
                  style={styles.input}
                  placeholder="Registration Number"
                  value={registrationNumber}
                  onChangeText={(text) => setRegistrationNumber(text.toUpperCase())}
                  autoCapitalize="characters"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="book-outline" size={24} color="#888" style={styles.icon} />
              <Picker
                  selectedValue={department}
                  style={styles.picker}
                  onValueChange={(itemValue) => setDepartment(itemValue)}
              >
                <Picker.Item label="Computer Science (CSE)" value="CSE" />
                <Picker.Item label="Information Technology (IT)" value="IT" />
                <Picker.Item label="Electronics (ECE)" value="ECE" />
                <Picker.Item label="Mechanical (ME)" value="ME" />
                <Picker.Item label="Civil (CE)" value="CE" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.loginButton} disabled={isLoading} onPress={handleRegister}>
              {isLoading ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.loginButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
              <Text style={styles.registerText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: Platform.OS==='android'?StatusBar.currentHeight:0,
  },
  topSection: {
    backgroundColor: '#5f0073',
    justifyContent: 'space-between',
  },
  loginText: {
    color: '#fff',
    fontSize: 24,
    margin:20,
    fontFamily:'Spartan-Bold',
  },
  logoSection:{
    backgroundColor: 'rgba(137,162,255,0.1)',
    justifyContent: 'center',    // Centers vertically
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  logo:{
    width:200,
    height:200,
    objectFit: 'contain',
  },
  formSection: {
    backgroundColor: 'rgba(137,162,255,0.1)',
    paddingTop: 5,
    paddingHorizontal: 20,
    height: '100%',
  },
  inputContainer: {
    elevation: 7,
    shadowColor: '#575757',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 28,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontFamily:'Spartan-Medium',
    flex: 1,
    height: 50,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallText: {
    fontFamily:'Spartan-Regular',
    color: '#323232',
    fontSize: 12,
  },
  loginButton: {
    elevation: 7,
    marginTop:20,
    shadowColor: '#5f0073',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: '#5f0073',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Spartan-SemiBold',
  },
  registerText: {
    fontFamily:'Spartan-SemiBold',
    color: '#5f0073',
    fontSize: 16,
  },
  registerButton: {
    elevation: 7,
    shadowColor: '#5f0073',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: '#FFFFFF',  // White background
    borderWidth: 2,              // Thickness of the border
    borderColor: '#D3D3D3',      // Grey border color (Light Grey)
    padding: 13,                 // Padding inside the button
    borderRadius: 18,            // Rounded corners
    alignItems: 'center',        // Center the button content
    marginBottom: 20,            // Space below the button
},

  safetyText: {
    fontFamily:'Spartan-Regular',
    color: '#888',
    fontSize: 12,
    marginTop:10,
    textAlign: 'center',
  },
  policyText: {
    fontFamily:'Spartan-Regular',
    color: '#5f0073',
    fontSize: 12,
    marginTop:8,
    textAlign: 'center',
  },
  footerText: {
    position: 'absolute', // Fixes the position
    bottom: 20, // Distance from the bottom of the screen
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  
});

export default RegisterPage;