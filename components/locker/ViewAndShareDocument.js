import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    SafeAreaView,
    Dimensions,
    Platform
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import fetchUserId from '../utilities/FetchUserId';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const apiBaseUrl = Constants.expoConfig.extra.API_URL;

const { width, height } = Dimensions.get('window');

const ViewAndShareDocument = ({ route, navigation }) => {
    const { documentId, selectedRedactionPurpose } = route.params;
    const [imageUri, setImageUri] = useState(null);
    const [filePath, setFilePath] = useState(null);
    const [documentData, setDocumentData] = useState(null);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [validDays, setValidDays] = useState('');
    const [purpose, setPurpose] = useState('');
    const [redactionPurpose, setRedactionPurpose] = useState(selectedRedactionPurpose);

    // Fetch image from the API (same as before)
    const fetchImage = async () => {
        try {
            const userId = await fetchUserId();
            const redactionPayload = {
                userId: userId,
                documentId: documentId,
                type: 'redacted',
                format: 'pdf',
                redactionPurpose: selectedRedactionPurpose,
            };
            console.log(redactionPayload)

            const response = await axios.post(`${apiBaseUrl}/wallet/download`, redactionPayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setDocumentData(response.data.redactedImage);

            if (response.data.redactedImage.startsWith('data:image/png;base64,')) {
                const base64Data = response.data.redactedImage.split(',')[1];
                const fileName = `Redacted_${documentId}_.png`;
                const filePath = `${FileSystem.documentDirectory}${fileName}`;

                await FileSystem.writeAsStringAsync(filePath, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                setImageUri(`file://${filePath}`);
                setFilePath(filePath);
            } else {
                throw new Error('API did not return a valid PNG image in base64 format.');
            }
        } catch (error) {
            console.error('Error fetching and saving the image:', error);
            Alert.alert('Error', `Failed to fetch image: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [selectedRedactionPurpose]);

    // Handle Download
    const handleDownload = async (type) => {
        if (!filePath) {
            Alert.alert('Error', 'No file available to download.');
            return;
        }
        try {
            // Implement actual download logic here
            Alert.alert('Success', `File saved as ${type}`);
        } catch (error) {
            Alert.alert('Error', 'Could not download file');
        }
    };

    // Submit Share API (same as before)
    const handleSubmitShare = async () => {
        try {
            const userId = await fetchUserId();
            const shareData = {
                documentId,
                userId,
                recipientEmail,
                maxViews: parseInt(maxViews, 10),
                validDays: parseInt(validDays, 10),
                purpose,
                redactionPurpose,
            };

            const response = await axios.post(`${apiBaseUrl}/secure/share/create`, shareData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Document shared securely!');
                setModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to share document.');
            }
        } catch (error) {
            console.error('Error sharing document:', error);
            Alert.alert('Error', 'Error while sharing the document.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#f0f4f8', '#ffffff']}
                style={styles.gradientBackground}
            >
                {/* Back Button */}

                <Text style={styles.purposeTitle}>
                    Purpose: {selectedRedactionPurpose}
                </Text>

                {imageUri ? (
                    <View style={styles.container} >
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.documentImage}
                            resizeMode="contain"
                        />

                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleDownload('png')}
                            >
                                <Icon name="download-outline" size={20} color="white" />
                                <Text style={styles.actionButtonText}>PNG</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleDownload('pdf')}
                            >
                                <Icon name="document-outline" size={20} color="white" />
                                <Text style={styles.actionButtonText}>PDF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={() => setModalVisible(true)}
                            >
                                <Icon name="share-social-outline" size={20} color="white" />
                                <Text style={styles.actionButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading Document...</Text>
                    </View>
                )}

                {/* Share Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeModalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="#2644DD" />
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Secure Document Share</Text>

                            {[
                                {
                                    placeholder: "Recipient Email",
                                    value: recipientEmail,
                                    onChangeText: setRecipientEmail,
                                    icon: 'mail-outline'
                                },
                                {
                                    placeholder: "Max Views",
                                    value: maxViews,
                                    onChangeText: setMaxViews,
                                    keyboardType: 'numeric',
                                    icon: 'eye-outline'
                                },
                                {
                                    placeholder: "Valid Days",
                                    value: validDays,
                                    onChangeText: setValidDays,
                                    keyboardType: 'numeric',
                                    icon: 'calendar-outline'
                                },
                                {
                                    placeholder: "Purpose",
                                    value: purpose,
                                    onChangeText: setPurpose,
                                    icon: 'information-circle-outline'
                                },
                            ].map((field, index) => (
                                <View key={index} style={styles.inputContainer}>
                                    <Icon
                                        name={field.icon}
                                        size={20}
                                        color="#2644DD"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholder={field.placeholder}
                                        placeholderTextColor="#888"
                                        value={field.value}
                                        onChangeText={field.onChangeText}
                                        keyboardType={field.keyboardType || 'default'}
                                    />
                                </View>
                            ))}

                            <TouchableOpacity
                                style={styles.submitShareButton}
                                onPress={handleSubmitShare}
                            >
                                <Text style={styles.submitShareButtonText}>
                                    Share Securely
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    gradientBackground: {
        flex: 1,
    },
    purposeTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily:"Spartan-Bold",
        marginTop: Platform.OS === 'ios' ? 60 : 30,
        color: '#4d5df8',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    documentContainer: {
        display:"flex",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    documentImage: {
        width: "90%",
        resizeMode:"contain",
        height: 600,
    },
    actionButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4d5df8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    actionButtonText: {
        color: 'white',
        marginLeft: 5,
        fontFamily:"Spartan-SemiBold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily:"Spartan-Regular",
        fontSize: 14,
        color: '#4d5df8',
    },

    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeModalButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily:"Spartan-Bold",
        color: '#4d5df8',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputField: {
        fontFamily:"Spartan-Medium",
        flex: 1,
        height: 40,
        fontSize: 14,
    },
    submitShareButton: {
        backgroundColor: '#4d5df8',
        width: '100%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
    submitShareButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily:"Spartan-SemiBold"
    },
});

export default ViewAndShareDocument;