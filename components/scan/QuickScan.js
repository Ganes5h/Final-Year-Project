import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    Button,
    Dimensions,
    Animated,
    ActivityIndicator,
    Alert,
    Modal,
    TouchableOpacity
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import Constants from "expo-constants";
import {CommonActions} from "@react-navigation/native";

const { width } = Dimensions.get('window');
const scannerWidth = width * 0.7;
const scannerHeight = scannerWidth;
const apiUrl = Constants.expoConfig.extra.API_URL;

export default function CertificateScanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [certificateData, setCertificateData] = useState(null);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const scanLineAnimation = new Animated.Value(0);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getCameraPermissions();
    }, []);

    useEffect(() => {
        if (!scanned) {
            animateScanLine();
        }
    }, [scanned]);

    const animateScanLine = () => {
        scanLineAnimation.setValue(0);
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnimation, {
                    toValue: scannerHeight,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const extractVerificationHash = (qrData) => {
        try {
            const hash = qrData.replace('https://secureCertify.edu/verify/', '');
            console.log("hash "+hash);
            return hash;
        } catch (err) {
            return qrData;
        }
    };

    const verifyCertificate = async (qrData) => {
        try {
            setLoading(true);
            setError(null);

            const verificationHash = extractVerificationHash(qrData);
            const response = await fetch(`${apiUrl}/certificate/verify-certificate/${verificationHash}`);
            const result = await response.json();

            if (result.status === "success") {
                setCertificateData(result.data);
                setShowDetails(true);
            } else {
                Alert.alert(
                    "Verification Failed",
                    result.message || "Failed to verify certificate",
                    [{
                        text: "OK",
                        onPress: () => resetScanner()
                    }]
                );
                setError(result.message || "Failed to verify certificate");
            }
        } catch (err) {
            Alert.alert(
                "Error",
                "Failed to connect to server",
                [{
                    text: "OK",
                    onPress: () => resetScanner()
                }]
            );
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const handleBarcodeScanned = async ({ data }) => {
        setScanned(true);
        console.log("data "+data);
        await verifyCertificate(data);
    };

    const handleRevokeCertificate = () => {
        Alert.alert(
            "Revoke Certificate",
            "Are you sure you want to revoke this certificate? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Revoke",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            // Add your revoke API call here
                            const response = await fetch(`${apiUrl}/certificate/revoke/${certificateData.certificateId}`, {
                                method: 'POST'
                            });
                            const result = await response.json();

                            if (result.status === "success") {
                                Alert.alert("Success", "Certificate has been revoked successfully");
                                resetScanner();
                            } else {
                                Alert.alert("Error", result.message || "Failed to revoke certificate");
                            }
                        } catch (err) {
                            Alert.alert("Error", "Failed to connect to server");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const resetScanner = () => {
        setScanned(false);
        setCertificateData(null);
        setError(null);
        setShowDetails(false);
    };

    if (hasPermission === null) {
        return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text style={styles.permissionText}>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {!showDetails ? (
                <>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr", "pdf417"],
                        }}
                        style={StyleSheet.absoluteFillObject}
                    />

                    <View style={styles.overlay}>
                        <View style={styles.scannerContainer}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />

                            {!scanned && (
                                <Animated.View
                                    style={[
                                        styles.scanLine,
                                        {
                                            transform: [{ translateY: scanLineAnimation }],
                                        },
                                    ]}
                                />
                            )}
                        </View>

                        {!scanned && (
                            <Text style={styles.instructionText}>
                                Align QR code within the frame
                            </Text>
                        )}
                    </View>
                </>
            ) : (
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>Certificate Details</Text>
                    <View style={styles.detailsContent}>
                        <View style={styles.detailsItem}>
                            <Text style={styles.detailsLabel}>Student Name:</Text>
                            <Text style={styles.detailsValue}>{certificateData.studentName}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                            <Text style={styles.detailsLabel}>USN:</Text>
                            <Text style={styles.detailsValue}>{certificateData.usn}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                            <Text style={styles.detailsLabel}>Event:</Text>
                            <Text style={styles.detailsValue}>{certificateData.eventName}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                            <Text style={styles.detailsLabel}>Points:</Text>
                            <Text style={styles.detailsValue}>{certificateData.activityPoints}</Text>
                        </View>
                        <View style={styles.detailsItem}>
                            <Text style={styles.detailsLabel}>Issued:</Text>
                            <Text style={styles.detailsValue}>
                                {new Date(certificateData.issuedDate).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={handleRevokeCertificate
                            }
                        >
                            <Text style={styles.registerText}>Revoke Certificate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={resetScanner
                            }
                        >
                            <Text style={styles.loginButtonText}>Scan Another</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )}

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#1a73e8" />
                    <Text style={styles.loadingText}>Processing...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerContainer: {
        width: scannerWidth,
        height: scannerHeight,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#5f0073',
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    scanLine: {
        height: 2,
        width: '100%',
        backgroundColor: '#5f0073',
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    permissionText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    detailsTitle: {
        fontSize: 18,
        fontFamily:'Spartan-Bold',
        color: '#5f0073',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailsContent: {
        flex: 1,
    },
    registerButton: {
        elevation: 7,
        shadowColor: '#ec563c',
        shadowOpacity: 0.7,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: '#ee573c',
        padding: 15,
        borderRadius: 18,
        alignItems: 'center',
        marginTop:0,
        marginBottom: 16,
    },
    loginButtonText: {
        color: '#5f0073',
        fontSize: 14,
        fontFamily:'Spartan-SemiBold',
    },
    loginButton: {
        elevation: 7,
        shadowColor: '#533CEE',
        shadowOpacity: 0.7,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: '#FFFFFF',  // White background
        borderWidth: 2,              // Thickness of the border
        borderColor: '#D3D3D3',      // Grey border color (Light Grey)
        padding: 13,                 // Padding inside the button
        borderRadius: 18,            // Rounded corners
        alignItems: 'center',        // Center the button content
        marginBottom: 28,
    },
    registerText: {
        fontFamily:'Spartan-SemiBold',
        color: '#ffffff',
        fontSize: 14,
        textAlign: 'center',
    },
    detailsItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    detailsLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    detailsValue: {
        fontSize: 14,
        color: '#333',
        fontFamily:'Spartan-SemiBold',
    },
    buttonContainer: {
        paddingHorizontal:20,

        marginBottom: 40,
    },
    buttonSpacer: {
        height: 10,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily:'Spartan-Regular',
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
});