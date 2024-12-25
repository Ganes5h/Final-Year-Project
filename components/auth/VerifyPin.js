import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import StorageUtil from "../utilities/StorageUtil";
import Constants from "expo-constants";
import deviceId from "./DeviceId";
import fetchUserId from "../utilities/FetchUserId";

const apiUrl = Constants.expoConfig.extra.API_URL;


const VerifyPinComponent = ({ navigation }) => {
    const [pin, setPin] = useState('');

    const handleNumberPress = (number) => {
        if (pin.length < 6) {
            setPin(prevPin => prevPin + number);
        }
    };

    const handleDeletePress = () => {
        setPin(prevPin => prevPin.slice(0, -1));
    };

    const verifyPin = async () => {
        try {
            // Retrieve the temporary login token stored during initialization
            const tempLoginToken = await StorageUtil.retrieveAndDecrypt('tempLoginToken');

            // Generate device fingerprint similar to the Java example
            const deviceFingerprint = deviceId

            const userId = await fetchUserId();
            console.log(userId);

            console.log("userId: "+userId+// Hardcoded user ID from example
                " pin: "+pin+
                " tempLoginToken: "+tempLoginToken+
                " deviceFingerprint: "+deviceFingerprint)

            // Call the PIN verification API
            const response = await axios.post(`${apiUrl}/mobile/login/verify-pin`, {
                userId: userId, // Hardcoded user ID from example
                pin: pin,
                tempLoginToken: tempLoginToken,
                deviceFingerprint: deviceFingerprint
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message==="Login successful") {
                // Store the user token
                await StorageUtil.encryptAndStore('userToken', response.data.accessToken);

                // Clear the temporary login token
                await StorageUtil.removeData('tempLoginToken');

                // Navigate to the main screen
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }]
                });
            } else {
                // Handle incorrect PIN
                Alert.alert('Incorrect PIN', response.data.message || 'Please try again.');
                setPin('');
                await fetchTempLoginToken
            }
        } catch (error) {
            console.error('PIN Verification Error:', error);
            Alert.alert('Error', 'Unable to verify PIN. Please try again.');
            setPin('');
            await fetchTempLoginToken
        }
    };


    const fetchTempLoginToken = async () => {
        try {
            // Fetch the user ID
            const userId = await fetchUserId();
            console.log('Fetched User ID:', userId);

            // If no user ID, throw an error to handle redirection
            if (!userId) {
                throw new Error('User ID not found. Redirecting to Login.');
            }

            // Call login initialization API
            const loginInitResponse = await axios.post(`${apiUrl}/mobile/login/init`, {
                userId,
                deviceId,
            });

            if (loginInitResponse.data) {
                const { tempLoginToken } = loginInitResponse.data;
                // Store temp login token securely
                await StorageUtil.encryptAndStore('tempLoginToken', tempLoginToken);
                console.log('Temporary Login Token:', tempLoginToken);
                return
            }
            // If response lacks required data
            throw new Error('Login initialization response missing required data.');
        } catch (error) {
            console.error('Error fetching temp login token:', error.message);
            throw error; // Rethrow for calling code to handle
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Verify PIN</Text>

            <View style={styles.pinDisplay}>
                {[...Array(6)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pinDot,
                            {
                                backgroundColor: index < pin.length ? '#000' : '#E0E0E0',
                                opacity: index < pin.length ? 1 : 0.5
                            }
                        ]}
                    />
                ))}
            </View>

            <View style={styles.numberPad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <TouchableOpacity
                        key={number}
                        style={styles.numberButton}
                        onPress={() => handleNumberPress(number.toString())}
                    >
                        <Text style={styles.numberText}>{number}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.numberButton} onPress={() => {}} />

                <TouchableOpacity
                    style={styles.numberButton}
                    onPress={() => handleNumberPress('0')}
                >
                    <Text style={styles.numberText}>0</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.numberButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.deleteText}>⌫</Text>
                </TouchableOpacity>
            </View>

            {pin.length === 6 && (
                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={verifyPin}
                >
                    <Text style={styles.verifyButtonText}>Verify PIN</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.forgotPinButton}
                onPress={() => navigation.navigate('ForgotPin')}
            >
                <Text style={styles.forgotPinText}>Forgot PIN?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    titleText: {
        fontSize: 24,
        fontFamily:"Spartan-SemiBold",
        marginBottom: 30,
    },
    pinDisplay: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4d5df8',
        marginHorizontal: 10,
    },
    numberPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 300,
    },
    numberButton: {
        width: '33.33%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        fontFamily:"Spartan-SemiBold",
        fontSize: 24,
        color: '#000',
    },
    deleteText: {
        fontSize: 24,
        color: '#000',
    },
    verifyButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily:"Spartan-SemiBold",
    },
    forgotPinButton: {
        marginTop: 20,
    },
    forgotPinText: {
        color: '#007BFF',
        fontSize: 16,
        fontFamily:"Spartan-SemiBold",
    },
});

export default VerifyPinComponent;