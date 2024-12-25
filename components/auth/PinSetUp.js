import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import StorageUtil from "../utilities/StorageUtil";
import Constants from "expo-constants";
import fetchUserId from "../utilities/FetchUserId";
const apiUrl = Constants.expoConfig.extra.API_URL;

const PinSetupComponent = ({ navigation, route }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isConfirmingPin, setIsConfirmingPin] = useState(false);

    const handleNumberPress = (number) => {
        if (!isConfirmingPin && pin.length < 6) {
            setPin(prevPin => prevPin + number);
        } else if (isConfirmingPin && confirmPin.length < 6) {
            setConfirmPin(prevConfirmPin => prevConfirmPin + number);
        }
    };

    const handleDeletePress = () => {
        if (!isConfirmingPin) {
            setPin(prevPin => prevPin.slice(0, -1));
        } else {
            setConfirmPin(prevConfirmPin => prevConfirmPin.slice(0, -1));
        }
    };

    const proceedToConfirmPin = () => {
        if (pin.length === 6) {
            setIsConfirmingPin(true);
        }
    };

    const setupPin = async () => {
        if (pin !== confirmPin) {
            Alert.alert('Error', 'PINs do not match. Please try again.');
            setPin('');
            setConfirmPin('');
            setIsConfirmingPin(false);
            return;
        }
        console.log(await fetchUserId)

        const requestBody = {userId: await fetchUserId, pin:pin}
        console.log(requestBody)

        try {
            // Retrieve the temporary login token stored during initialization

            // Call the PIN setup API
            const response = await axios.post(`${apiUrl}/mobile/setup-pin`, {
                userId: await fetchUserId(),
                pin: pin
            });
            console.log(response.data)

            if (response.data) {
                // Store the user token


                // Navigate to the main screen
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }]
                });
            } else {
                // Handle PIN setup failure
                Alert.alert('Setup Failed', 'Unable to set up PIN. Please try again.');
                setPin('');
                setConfirmPin('');
                setIsConfirmingPin(false);
            }
        } catch (error) {
            console.error('PIN Setup Error:', error);
            Alert.alert('Error', 'Unable to set up PIN. Please try again.');
            setPin('');
            setConfirmPin('');
            setIsConfirmingPin(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {!isConfirmingPin ? 'Create PIN' : 'Confirm PIN'}
            </Text>

            <Text style={styles.subtitleText}>
                {!isConfirmingPin
                    ? 'Choose a 6-digit PIN to secure your account'
                    : 'Confirm your PIN'}
            </Text>

            <View style={styles.pinDisplay}>
                {[...Array(6)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pinDot,
                            {
                                backgroundColor: !isConfirmingPin
                                    ? (index < pin.length ? '#000' : '#E0E0E0')
                                    : (index < confirmPin.length ? '#000' : '#E0E0E0'),
                                opacity: !isConfirmingPin
                                    ? (index < pin.length ? 1 : 0.5)
                                    : (index < confirmPin.length ? 1 : 0.5)
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

            {!isConfirmingPin && pin.length === 6 && (
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={proceedToConfirmPin}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            )}

            {isConfirmingPin && confirmPin.length === 6 && (
                <TouchableOpacity
                    style={styles.setupButton}
                    onPress={setupPin}
                >
                    <Text style={styles.setupButtonText}>Set Up PIN</Text>
                </TouchableOpacity>
            )}
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
        marginBottom: 10,
    },
    subtitleText: {
        fontFamily:"Spartan-SemiBold",
        fontSize: 16,
        color: '#666',
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
        backgroundColor: '#E0E0E0',
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
        fontSize: 24,
        color: '#000',
    },
    deleteText: {
        fontSize: 24,
        color: '#000',
    },
    nextButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily:"Spartan-SemiBold",
    },
    setupButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    setupButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily:"Spartan-SemiBold",
    },
});

export default PinSetupComponent;