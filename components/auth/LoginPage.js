
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import Constants from "expo-constants";
import StorageUtil from "../utilities/StorageUtil";

const apiUrl = Constants.expoConfig.extra.API_URL;

const LoginPage = ({ navigation }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState({ errorMessage: null });

  const initiateLogin = async () => {
    setIsLoading(true);
    setLoginState({ errorMessage: null });
    console.log(`${apiUrl}/admin/login`)

    try {
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        await StorageUtil.encryptAndStore('userToken',data.token);
        await StorageUtil.encryptAndStore('user',JSON.stringify(data.user));

        // Navigate to the Main or Start component
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main'}],
            })
        );
      } else {
        // Handle error
        setLoginState({ errorMessage: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginState({ errorMessage: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginContent = () => (
      <>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#8888" style={styles.icon} />
          <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={formData.email}
              onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#8888" style={styles.icon} />
          <TextInput
              style={styles.input}
              placeholder="Enter Password"
              value={formData.password}
              onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry={!showPassword}
              autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#8888"
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me and Forgot Password */}
        <View style={styles.rememberForgotContainer}>
          <TouchableOpacity>
            <Text style={styles.smallText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.smallText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>



        {/* Login Button */}
        <TouchableOpacity
            style={[styles.loginButton, isLoading && { backgroundColor: '#b0b0ff' }]}
            onPress={initiateLogin}
            disabled={isLoading}
        >
          {isLoading ? (
              <ActivityIndicator color="#fff" />
          ) : (
              <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </>
  );

  return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.loginText}>LOGIN</Text>
        </View>

        <View style={styles.logoSection}>
          <Image
              source={require('../../assets/images/logo1.png')}
              style={styles.logo}
          />
        </View>

        <View style={styles.formSection}>
          {/* Error Message Display */}
          {loginState.errorMessage && (
              <Text style={styles.errorText}>{loginState.errorMessage}</Text>
          )}

          {renderLoginContent()}

          {/* Register Button */}
          <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                  navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Register' }],
                      })
                  )
              }
          >
            <Text style={styles.registerText}>Register Now</Text>
          </TouchableOpacity>

          {/* Additional Info */}
          <Text style={styles.safetyText}>
            Your personal details are safe with us
          </Text>
          <Text style={styles.policyText}>
            Read our Privacy Policy and Terms and Conditions
          </Text>
        </View>
      </View>
  );
};

// Existing styles remain the same as in your original code
const styles = StyleSheet.create({
  // ... (all previous styles)
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    backgroundColor: '#5f0073',
    // height: '30%',
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    justifyContent: 'space-between',
    elevation: 7,
    shadowColor: '#5f0073',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  loginText: {
    fontFamily:'Spartan-Bold',
    color: '#fff',
    fontSize: 24,
    margin: 20,
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
  logoSection:{
    backgroundColor: 'rgba(137,162,255,0.1)',
    justifyContent: 'center',    // Centers vertically
    alignItems: 'center',
  },
  logo:{
    width:250,
    height:250,
    objectFit: 'contain',
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
    color: '#2e2e2e',
    fontSize: 12,
  },
  loginButton: {
    elevation: 7,
    shadowColor: '#5f0073',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: '#5f0073',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginTop:30,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Spartan-SemiBold',
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
    marginBottom: 20,
  },
  registerText: {
    fontFamily:'Spartan-SemiBold',
    color: '#5f0073',
    fontSize: 16,
    textAlign: 'center',
  },
  safetyText: {
    fontFamily:'Spartan-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  policyText: {
    fontFamily:'Spartan-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#888',
  },

  // Add this new style for error messages
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Spartan-Regular'
  }
});

export default LoginPage;