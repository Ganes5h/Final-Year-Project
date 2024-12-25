import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Clipboard
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ContentCopyIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StorageUtil from "../utilities/StorageUtil";
import fetchUserId from "../utilities/FetchUserId";

// Utility imports


const SharedDocumentsManagement = () => {
    const [sharedLinks, setSharedLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    // Fetch user ID and access token
    const initializeUserData = useCallback(async () => {
        try {
            const retrievedUserId = await fetchUserId();
            const retrievedAccessToken = StorageUtil.retrieveAndDecrypt("userToken");
            console.log("here "+userId)
            setUserId(retrievedUserId);
            setAccessToken(retrievedAccessToken);
        } catch (error) {
            console.error('Failed to initialize user data', error);
            setLoading(false);
        }
    }, []);

    // Fetch shared documents
    const fetchSharedDocuments = useCallback(async () => {

        if (!userId) {
            setLoading(false);
            return;
        }
        console.log(userId)

        try {
            const response = await axios.get(
                `https://niraj.site/api/secure/share/documents/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('Shared documents response:', response.data);
            setSharedLinks(response.data.sharedLinks);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch documents', error);
            Alert.alert(
                'Failed to Fetch Documents',
                error.response?.data?.message || 'Something went wrong'
            );
            setLoading(false);
        }
    }, [userId, accessToken]);

    // Initialize on component mount
    useEffect(() => {
        initializeUserData();
    }, [initializeUserData]);

    // Fetch shared documents when user ID is available
    useEffect(() => {
        if (userId) {
            fetchSharedDocuments();
        }
    }, [userId, fetchSharedDocuments]);

    // Revoke share link
    const handleRevokeLink = async (shareLink) => {
        Alert.alert(
            'Are you sure?',
            'Do you want to revoke this share link?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Revoke!',
                    onPress: async () => {
                        try {
                            await axios.post(
                                'https://niraj.site/api/secure/share/revoke',
                                {
                                    userId,
                                    shareLink,
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                }
                            );

                            Alert.alert(
                                'Share Link Revoked',
                                'The document share link has been successfully revoked.'
                            );

                            // Remove revoked link from state
                            setSharedLinks((prevLinks) =>
                                prevLinks.filter((link) => link.shareLink !== shareLink)
                            );
                        } catch (error) {
                            console.error('Failed to revoke link', error);
                            Alert.alert(
                                'Revocation Failed',
                                error.response?.data?.message || 'Something went wrong'
                            );
                        }
                    },
                },
            ]
        );
    };

    // Copy share link to clipboard
    const handleCopyLink = (shareLink) => {
        const fullLink = `https://niraj.site/view-documents/${shareLink}`;
        Clipboard.setString(fullLink);
        Alert.alert(
            'Link Copied',
            'The share link has been copied to your clipboard.'
        );
    };

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'VERIFIED':
                return styles.successStatus;
            case 'PENDING':
                return styles.warningStatus;
            default:
                return styles.defaultStatus;
        }
    };

    // Format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}:${month}:${day} ${hours}:${minutes}`;
    };

    // Render shared document item
    const renderSharedDocumentItem = ({ item }) => (
        <View style={styles.documentItem}>
            <View style={styles.documentDetails}>
                <Text style={styles.documentType}>{item.documentType}</Text>
                <Text style={styles.shareLink} numberOfLines={1}>
                    {item.shareLink}
                </Text>
                <View style={[styles.statusChip, getStatusColor(item.status)]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <Text style={styles.recipientEmail} numberOfLines={1}>
                    {item.recipientEmail}
                </Text>
                <Text style={styles.viewsText}>
                    {item.currentViews}/{item.maxViews} Views
                </Text>
                <Text style={styles.expirationText}>
                    Expires: {formatDate(item.expiresAt)}
                </Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCopyLink(item.shareLink)}
                >
                    <ContentCopyIcon name="content-copy" size={24} color="#1976d2" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRevokeLink(item.shareLink)}
                >
                    <MaterialIcons name="delete" size={24} color="#d32f2f" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shared Document Management</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : sharedLinks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No shared document links found
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={sharedLinks}
                    renderItem={renderSharedDocumentItem}
                    keyExtractor={(item) => item.shareId.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    header: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily:"Spartan-Bold",
        color: '#0d47a1',
    },
    listContainer: {
        padding: 15,
    },
    documentItem: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    documentDetails: {
        flex: 1,
        marginRight: 15,
    },
    documentType: {
        fontSize: 16,
        fontFamily:"Spartan-Bold",
        color: '#1976d2',
        marginBottom: 5,
    },
    shareLink: {
        color: '#666',
        marginBottom: 5,
    },
    statusChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 5,
    },
    successStatus: {
        backgroundColor: 'rgb(151,255,173)',
    },
    warningStatus: {
        backgroundColor: 'rgba(246,234,105,0.8)',
    },
    defaultStatus: {
        backgroundColor: 'rgba(158, 158, 158, 0.2)',
    },
    statusText: {
        fontSize: 12,
        fontFamily:"Spartan-Bold",
    },
    recipientEmail: {
        fontFamily:"Spartan-Medium",
        color: '#666',
        marginBottom: 5,
    },
    viewsText: {
        fontFamily:"Spartan-Medium",
        color: '#666',
        marginBottom: 5,
    },
    expirationText: {
        fontFamily:"Spartan-Medium",
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'column',
    },
    actionButton: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#666',
        fontSize: 16,
    },
});

export default SharedDocumentsManagement;