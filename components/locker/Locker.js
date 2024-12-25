import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    Alert, TouchableWithoutFeedback, ActivityIndicator, ScrollView, StatusBar, TextInput
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import StorageUtil from '../utilities/StorageUtil';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import fetchUserId from "../utilities/FetchUserId";

const { width } = Dimensions.get('window');

const DOCUMENT_TYPES = [
    "Aadhaar Card",
    "Passport",
    "PAN Card",
    "Voter ID",
    "Driving License"
];

const Images = {
    "Aadhaar Card": require('../../assets/images/logo1.png'),
    "Passport": require('../../assets/images/passport.jpg'),
    "Driving License": require('../../assets/images/Ministry_of_Road_Transport_and_Highways.png'),
    "PAN Card": require('../../assets/images/Logo_of_Income_Tax_Department_India.png'),
    "Voter ID": require('../../assets/images/passport.jpg') // Suggest using a distinct image
};

const LockerComponent = ({ navigation }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const apiBaseUrl = Constants.expoConfig.extra.API_URL;
    const [isUploadModalVisible, setUploadModalVisible] = useState(false);
    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [displayUploadSection,setDisplayUploadSection] = useState(false)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileCategory, setFileCategory] = useState('');



    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const userId = await fetchUserId();
            if (!userId) {
                Alert.alert('Error', 'User ID not found');
                return;
            }

            const response = await axios.get(`${apiBaseUrl}/digiLoker/documents/${userId}`);
            setDocuments(response.data.documents || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
            Alert.alert('Error', 'Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!documentToDelete) return;

        try {
            setLoading(true);

            // Remove the document from local state
            setDocuments(currentDocs =>
                currentDocs.filter(doc => doc.id !== documentToDelete)
            );

            setDeleteModalVisible(false);
            setDocumentToDelete(null);

            Alert.alert('Success', 'Document deleted successfully');
        } catch (error) {
            console.error('Delete document error:', error);
            Alert.alert('Error', 'Failed to delete document');
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentClick = (documentId) => {
        navigation.navigate('DocumentScreen', { documentId });
    };

    const confirmDeleteDocument = (documentId) => {
        setDocumentToDelete(documentId);
        setDeleteModalVisible(true);
    };

    const renderDocumentCard = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => handleDocumentClick(item.id)}
                onLongPress={() => confirmDeleteDocument(item.id)}
            >
                <View style={styles.cardContent}>
                    <Image
                        source={Images[item.title] || Images['Aadhaar Card']} // Use dynamic icon
                        style={styles.documentLogo}
                    />
                    <Text style={styles.documentName} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.documentDate}>
                        {new Date(item.uploadDate).toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Ensure only PDF files are selected
                copyToCacheDirectory: true,
            });

            if (result.type !== 'cancel') {
                setSelectedFile({
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType || 'application/pdf',
                });
                setDisplayUploadSection(true);
            } else {
                Alert.alert('No Document Selected', 'Please select a valid document.');
            }
        } catch (error) {
            console.error('Document pick error:', error);
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const uploadDocument = async () => {
        if (!selectedFile) {
            Alert.alert('Error', 'Please select a document first');
            return;
        }

        if (!documentType || !title || !description || !fileCategory) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setLoading(true);

            const userId = await fetchUserId(); // Fetch the user's ID
            if (!userId) {
                Alert.alert('Error', 'User ID not found');
                return;
            }

            const formData = new FormData();
            formData.append('file', {
                uri: selectedFile.uri
            });
            formData.append('userId', userId);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('fileType', 'pdf');
            formData.append('source', 'external');
            formData.append('category', fileCategory);

            console.log('FormData:', formData);

            const response = await axios.post(`${apiBaseUrl}/digiLoker/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload Response:', response.data);
            Alert.alert('Success', 'Document uploaded successfully');
            setUploadModalVisible(false);
            setSelectedFile(null);
            fetchDocuments(); // Refresh document list
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to upload document. Please try again later.'
            );
        } finally {
            setDisplayUploadSection(false);
            setLoading(false);
        }
    };




    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <View style={styles.container}>
        <ScrollView
    style={[styles.container, { paddingTop: 16}]}
    contentContainerStyle={styles.scrollViewContent}
        >
            <Text style={styles.header}>My Documents</Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading documents...</Text>
                </View>
            ) : documents.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No documents uploaded yet</Text>
                </View>
            ) : (
                <View style={styles.gridContainer}>
                    {documents.map((doc, index) => renderDocumentCard({ item: doc, index }))}
                </View>
            )}


            <Modal visible={isUploadModalVisible} transparent={true} animationType="slide">
                <TouchableWithoutFeedback onPress={() => setUploadModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { /* Prevent closing on inner content touch */ }}>
                            <View style={styles.modalContainer}>
                                {loading && <ActivityIndicator size="large" color="#0000ff" />}

                                <Text style={styles.modalTitle}>Upload Document</Text>

                                <View style={styles.documentTypeContainer}>
                                    <TextInput
                                        style={styles.inputContainer}
                                        placeholder="Title"
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                    <TextInput
                                        style={styles.inputContainer}
                                        placeholder="Description"
                                        value={description}
                                        onChangeText={setDescription}
                                    />
                                    <TextInput
                                        style={styles.inputContainer}
                                        placeholder="Type"
                                        value={fileCategory}
                                        onChangeText={setFileCategory}
                                    />
                                </View>

                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.selectDocumentButton}
                                        onPress={pickDocument}
                                    >
                                        <Text style={styles.selectDocumentButtonText}>Select Document</Text>
                                    </TouchableOpacity>

                                </View>

                                {selectedFile && (
                                    <View style={styles.previewContainer}>
                                        <Image
                                            source={{ uri: selectedFile.uri }}
                                            style={styles.documentPreview}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.documentName}>{selectedFile.name}</Text>
                                    </View>
                                )}

                                {displayUploadSection && (
                                    <View style={styles.modalButtonContainer}>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => {
                                                setUploadModalVisible(false);
                                                setSelectedFile(null);
                                                setDisplayUploadSection(false)
                                            }}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.uploadButton,
                                                !selectedFile && styles.uploadButtonDisabled,
                                            ]}
                                            onPress={uploadDocument}
                                            disabled={!selectedFile}
                                        >
                                            <Text style={styles.uploadButtonText}>Upload</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>



            {/* Delete Confirmation Modal */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Delete Document</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete this document?
                        </Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalDeleteButton}
                                onPress={handleDeleteDocument}
                            >
                                <Text style={styles.modalDeleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    <TouchableOpacity
        style={styles.addDocumentButton}
        onPress={() => setUploadModalVisible(true)}
    >
        <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40, // Add some padding at the bottom
    },
    header: {
        fontSize: 22,
        fontFamily: 'Spartan-Bold',
        marginBottom: 20,
        color: 'rgba(38,68,221,0.87)',
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },


    card: {
        width: (width - 60) / 2, // Two cards per row with padding
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: {
        alignItems: 'center',
        padding: 15,
    },
    documentLogo: {
        resizeMode:"contain",
        width: 80,
        height: 50,
        marginBottom: 10,
    },
    documentName: {
        fontSize: 12,
        fontFamily: 'Spartan-SemiBold',
        textAlign: 'center',
        marginBottom: 5,
    },
    documentDate: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Spartan-Medium',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        shadowColor: '#2e2e2e',
        shadowOpacity: 0.7,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    input: {
        fontFamily:'Spartan-Medium',
        flex: 1,
        height: 50,
    },
    loadingText: {
        fontFamily: 'Spartan-Medium',
        color: '#666',
    },
    cameraButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    cameraButtonText: {
        fontFamily: 'Spartan-Medium',
        color: 'white',
        fontSize: 14,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Spartan-Medium',
        color: '#666',
        fontSize: 16,
    },
    addDocumentButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4D5DFA',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#ececec',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Spartan-Bold',
        marginBottom: 15,
    },
    modalMessage: {
        fontFamily: 'Spartan-Medium',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonContainer: {
        marginVertical:10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalCancelButton: {
        marginRight: 10,
        padding: 10,
    },
    modalCancelButtonText: {
        color: '#4D5DFA',
        fontFamily: 'Spartan-SemiBold',
    },
    modalDeleteButton: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
    },
    modalDeleteButtonText: {
        color: 'white',
        fontFamily: 'Spartan-SemiBold',
    },
    modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', maxWidth: 400,display:"flex",justifyContent:"center",alignContent:"center" },
    previewContainer: { alignItems: 'center', marginBottom: 15 },
    documentPreview: { width: 250, height: 250, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0' },
    documentTypeContainer: { width:"100%",marginBottom: 15},
    label: { fontSize: 14, marginBottom: 10,fontFamily:"Spartan-SemiBold" },
    picker: { height: 50,fontFamily:"Spartan-SemiBold",color:"black" },
    selectDocumentButton: { backgroundColor: '#10B981', padding: 12, borderRadius: 5, alignItems: 'center' ,marginHorizontal:8},
    selectDocumentButtonText: { color: 'white',fontSize: 14, fontFamily:"Spartan-Medium" },
    cancelButton: { backgroundColor: '#EF4444', padding: 12, borderRadius: 5, flex: 1, marginRight: 10, alignItems: 'center' },
    cancelButtonText: { color: 'white', fontFamily:"Spartan-SemiBold" },
    uploadButton: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 5, flex: 1, alignItems: 'center' },
    uploadButtonDisabled: { backgroundColor: '#9CA3AF' },
    uploadButtonText: { color: 'white', fontFamily:"Spartan-SemiBold" },
    listContainer: { paddingBottom: 15 },
});

export default LockerComponent;