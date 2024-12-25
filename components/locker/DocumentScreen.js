import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal, TouchableWithoutFeedback, Platform
} from 'react-native';


const DocumentScreen = ({ route,navigation }) => {
  // const { documentId } = route.params;
  // const [documentData, setDocumentData] = useState(null);
  // const [documentMetadata, setDocumentMetadata] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const apiBaseUrl = Constants.expoConfig.extra.API_URL;
  // const [showDownloadOriginalDialog, setShowDownloadOriginalDialog] = useState(false);
  // const [showDownloadRedactedDialog, setShowDownloadRedactedDialog] = useState(false);
  // const [isLoading,setIsLoading] = useState(false)
  // const [selectedRedactionPurpose, setSelectedRedactionPurpose] = useState('');
  // const [redactionPurposes, setRedactionPurposes] = useState([]);
  //
  // const handleDownloadOriginal = () => {
  //   setShowDownloadOriginalDialog(true);
  // };
  //
  // const downloadDocument = async (format) => {
  //   try {
  //     // Fetch user ID
  //     const userId = await fetchUserId();
  //
  //     // Prepare download request payload
  //     const downloadPayload = {
  //       userId: userId,
  //       documentId: documentId,
  //       type: 'original',
  //       format: format
  //     };
  //
  //     // Call download API
  //     const response = await axios.post(
  //         `${apiBaseUrl}/wallet/download`,
  //         downloadPayload
  //     );
  //
  //     // Handle document download
  //     const documentBase64 = response.data.document;
  //
  //     const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
  //     const fileName = `${documentMetadata.documentName}_${timestamp}.${format}`;
  //     const filePath = `${FileSystem.documentDirectory}${fileName}`;
  //
  //     // Write file based on format
  //     if (format === 'png') {
  //       await FileSystem.writeAsStringAsync(
  //           filePath,
  //           documentBase64.replace(/^data:image\/png;base64,/, ''),
  //           { encoding: FileSystem.EncodingType.Base64 }
  //       );
  //     } else if (format === 'pdf') {
  //       await FileSystem.writeAsStringAsync(
  //           filePath,
  //           documentBase64.replace(/^data:application\/pdf;base64,/, ''),
  //           { encoding: FileSystem.EncodingType.Base64 }
  //       );
  //     }
  //
  //     Alert.alert('Success', `${format.toUpperCase()} document downloaded successfully`);
  //     setShowDownloadOriginalDialog(false);
  //   } catch (error) {
  //     Alert.alert('Error', `Download failed: ${error.message}`);
  //   }
  // };
  //
  // const getPurposesForDocument = (documentName) => {
  //   const matchedDocument = DocumentTypes.documents.find(
  //       (doc) => doc.name === documentName
  //   );
  //
  //   if (matchedDocument) {
  //     return matchedDocument.purposes.map((purpose) => purpose.type);
  //   }
  //
  //   return [];
  // };
  //
  // const handleDownloadRedacted = () => {
  //   const redactionPurposes = getPurposesForDocument(documentMetadata.documentType);
  //
  //   if (redactionPurposes.length > 0) {
  //     setRedactionPurposes(redactionPurposes);
  //     setShowDownloadRedactedDialog(true);
  //   } else {
  //     Alert.alert('Error', 'No redaction purposes found for this document type.');
  //   }
  // };
  //
  //
  //
  // const downloadRedactedDocument = async () => {
  //   console.log("Pu:"+selectedRedactionPurpose)
  //   navigation.navigate("DocumentViewer",{documentId,selectedRedactionPurpose})
  // }
  //
  //
  // const arrayBufferToBase64 = (buffer) => {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   const length = bytes.byteLength;
  //   for (let i = 0; i < length; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // };
  //
  //
  //
  //
  // const getDecryptionKey = async () => {
  //   try {
  //     const storedDecryptionKey = await StorageUtil.retrieveAndDecrypt('decryption_key');
  //     if (storedDecryptionKey) {
  //       return storedDecryptionKey;
  //     }
  //
  //     const userId = await fetchUserId();
  //     const token = await StorageUtil.retrieveAndDecrypt('userToken');
  //     if (!userId || !token) return null;
  //
  //     const response = await axios.post(
  //         `${apiBaseUrl}/decrypt/decryption-key`,
  //         { authType: 'mobile', userId, token },
  //         { headers: { 'Content-Type': 'application/json' } }
  //     );
  //
  //     const decryptionKey = response.data.decryptionKey;
  //     if (decryptionKey) {
  //       await StorageUtil.encryptAndStore('decryption_key', decryptionKey);
  //     }
  //
  //     return decryptionKey;
  //   } catch (error) {
  //     console.error("Error fetching decryption key:", error);
  //     Alert.alert("Error", "Failed to fetch decryption key");
  //     return null;
  //   }
  // };
  //
  // const fetchDocumentData = async () => {
  //   try {
  //     setLoading(true);
  //     const userId = await fetchUserId();
  //     const userDecryptionKey = await getDecryptionKey();
  //
  //     const requestBody = { userId, documentId, userDecryptionKey };
  //     const response = await axios.post(`${apiBaseUrl}/wallet/documents/`, requestBody);
  //
  //     setDocumentData(response.data.documentData);
  //     setDocumentMetadata(response.data.documentMetadata);
  //   } catch (error) {
  //     console.error("Error fetching document data:", error);
  //     Alert.alert("Error", "Failed to fetch document data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //
  // useEffect(() => {
  //   fetchDocumentData();
  // }, [documentId]);
  //
  // const renderImageDetails = () => {
  //   if (!documentMetadata) return null;
  //
  //   return (
  //       <View style={styles.imageDetailsContainer}>
  //         <Text style={styles.imageDetailTitle}>{documentMetadata.documentName || 'Document'}</Text>
  //         <View style={styles.imageDetailRow}>
  //           <Text style={styles.imageDetailText}>Type: {documentMetadata.documentType}</Text>
  //           <Text style={styles.imageDetailText}>Size: {documentMetadata.fileSize || 'N/A'}</Text>
  //         </View>
  //         <View style={styles.imageDetailRow}>
  //           <Text style={styles.imageDetailText}>
  //             Verification Status: {documentMetadata.verificationStatus}
  //           </Text>
  //         </View>
  //         <View style={styles.imageDetailRow}>
  //           <Text style={styles.imageDetailText}>
  //             Uploaded At: {new Date(documentMetadata.uploadedAt).toLocaleString()}
  //           </Text>
  //         </View>
  //       </View>
  //   );
  // };
  //
  // const renderDownloadButtons = () => (
  //     <View>
  //     <TouchableOpacity
  //         style={[styles.loginButton, isLoading && { backgroundColor: '#b0b0ff' }]}
  //         onPress={handleDownloadRedacted}
  //         disabled={isLoading}
  //     >
  //       {isLoading ? (
  //           <ActivityIndicator color="#fff" />
  //       ) : (
  //           <Text style={styles.loginButtonText}>Download Document</Text>
  //       )}
  //     </TouchableOpacity>
  //
  //     </View>
  // );
  //
  // return (
  //     <View style={styles.container}>
  //       {loading ? (
  //           <View style={styles.loadingContainer}>
  //             <ActivityIndicator size="large" color="#0000ff" />
  //             <Text style={styles.loadingText}>Loading document...</Text>
  //           </View>
  //       ) : (
  //           <View style={styles.contentContainer}>
  //             {renderImageDetails()}
  //             <Image
  //                 source={{ uri: documentData }}
  //                 style={styles.documentImage}
  //                 resizeMode="contain"
  //                 onError={(e) => console.error('Image load error', e.nativeEvent.error)}
  //             />
  //             {renderDownloadButtons()}
  //           </View>
  //       )}
  //
  //       <Modal
  //           visible={showDownloadOriginalDialog}
  //           transparent={true}
  //           animationType="slide"
  //       >
  //         <TouchableWithoutFeedback onPress={() => setShowDownloadOriginalDialog(false)}>
  //           <View style={styles.modalOverlay}>
  //             <View style={styles.modalContainer}>
  //               <Text style={styles.modalTitle}>Download Original Document</Text>
  //               <View style={styles.modalButtonContainer}>
  //                 <TouchableOpacity
  //                     style={styles.selectDocumentButton}
  //                     onPress={() => downloadDocument('png')}
  //                 >
  //                   <Text style={styles.selectDocumentButtonText}>Download as PNG</Text>
  //                 </TouchableOpacity>
  //                 <TouchableOpacity
  //                     style={styles.selectDocumentButton}
  //                     onPress={() => downloadDocument('pdf')}
  //                 >
  //                   <Text style={styles.selectDocumentButtonText}>Download as PDF</Text>
  //                 </TouchableOpacity>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableWithoutFeedback>
  //       </Modal>
  //
  //       {/* Redacted Download Modal */}
  //       <Modal
  //           visible={showDownloadRedactedDialog}
  //           transparent={true}
  //           animationType="slide"
  //           statusBarTranslucent={true}
  //           onRequestClose={() => setShowDownloadRedactedDialog(false)}
  //       >
  //         <View style={styles.modalOverlay}>
  //           <View style={styles.modalContainer}>
  //             <Text style={styles.modalTitle}>Redact Document</Text>
  //
  //             <View style={styles.pickerWrapper}>
  //               <Picker
  //                   style={styles.picker}
  //                   selectedValue={selectedRedactionPurpose}
  //                   onValueChange={(itemValue) => setSelectedRedactionPurpose(itemValue)}
  //               >
  //                 <Picker.Item
  //                     label="Select Redaction Purpose"
  //                     value=""
  //                     color="#999"
  //                 />
  //                 {redactionPurposes.map((purpose, index) => (
  //                     <Picker.Item
  //                         key={index}
  //                         label={purpose}
  //                         value={purpose}
  //                     />
  //                 ))}
  //               </Picker>
  //             </View>
  //
  //             <View style={styles.modalButtonContainer}>
  //               <TouchableOpacity
  //                   style={styles.selectDocumentButton}
  //                   onPress={downloadRedactedDocument}
  //                   activeOpacity={0.7}
  //               >
  //                 <Text style={styles.selectDocumentButtonText}>Redact Document</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                   style={styles.cancelButton}
  //                   onPress={() => setShowDownloadRedactedDialog(false)}
  //                   activeOpacity={0.7}
  //               >
  //                 <Text style={styles.cancelButtonText}>Cancel</Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       </Modal>
  //     </View>
  // );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily:"Spartan-Bold",
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontFamily:"Spartan-Medium",
    fontSize: 14,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectDocumentButton: {
    flex: 1,
    backgroundColor: '#533CEE',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  selectDocumentButtonText: {
    fontSize:12,
    color: 'white',
    fontFamily:"Spartan-SemiBold",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize:12,
    fontFamily:"Spartan-SemiBold",
    color: '#533CEE',

  },

  loginButton: {
    elevation: 7,
    shadowColor: '#533CEE',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: '#533CEE',
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

  modalMessage: {
    fontFamily: 'Spartan-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageDetailsContainer: {
    width: '90%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  imageDetailTitle: {
    fontSize: 18,
    fontFamily: 'Spartan-Bold',
    color: '#333',
    marginBottom: 5,
  },
  imageDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageDetailText: {
    fontSize: 14,
    fontFamily: 'Spartan-Regular',
    color: '#666',
  },
  documentImage: {
    width: '90%',
    height: '60%',
    marginBottom: 15,
  },
  downloadButtonContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  downloadButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontFamily: 'Spartan-SemiBold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Spartan-Regular",
  },
  metadataContainer: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
  },
  metadataText: {
    color: "#3B82F6",
    fontSize: 14,
    fontFamily: "Spartan-SemiBold",
    marginBottom: 5,
  },

  pickerPlaceholder: {
    color: '#888',
  },

  disabledButton: {
    backgroundColor: '#cccccc',
  },

});



export default DocumentScreen;