import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    Clipboard,
    RefreshControl
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { Calendar, Clock, MapPin, PhoneCallIcon } from 'lucide-react-native';
import fetchUserId from "../utilities/FetchUserId";

// Event Card Component
const EventCard = ({ event, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => onPress(event)}
        >
            <View style={styles.cardContent}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                </Text>
                <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>
                        {event.club.name}
                    </Text>
                </View>
                <View style={styles.eventMetaContainer}>
                    <View style={styles.eventMeta}>
                        <Calendar size={16} color="#666" />
                        <Text style={styles.eventMetaText}>
                            {new Date(event.startDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.eventMeta}>
                        <Clock size={16} color="#666" />
                        <Text style={styles.eventMetaText}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const onRefresh = async () => {
    setRefreshing(true); // Start the refresh indicator
    await fetchData();  // Re-fetch data
    setRefreshing(false); // End the refresh indicator
};
// Event Detail Modal Component
const EventDetailModal = ({
                              event,
                              visible,
                              onClose,
                              onRegister
                          }) => {
    if (!event) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    <Text style={styles.modalTitle}>{event.title}</Text>

                    <View style={styles.modalDetailSection}>
                        <MapPin size={20} color="#007bff" />
                        <Text style={styles.modalDetailText}>
                            {event.venue}
                        </Text>
                    </View>

                    <View style={styles.modalDetailSection}>
                        <Calendar size={20} color="#007bff" />
                        <Text style={styles.modalDetailText}>
                            {new Date(event.startDate).toLocaleDateString()} -
                            {new Date(event.endDate).toLocaleDateString()}
                        </Text>
                    </View>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>
                        {event.description}
                    </Text>

                    <View style={styles.eventStatsContainer}>
                        <View style={styles.eventStatItem}>
                            <Text style={styles.eventStatValue}>
                                {event.maxParticipants}
                            </Text>
                            <Text style={styles.eventStatLabel}>Max Participants</Text>
                        </View>
                        <View style={styles.eventStatItem}>
                            <Text style={styles.eventStatValue}>
                                {event.activityPoints}
                            </Text>
                            <Text style={styles.eventStatLabel}>Points</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={onRegister}
                    >
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// Main Events Screen
export default function EventsScreen() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isWhatsappModalVisible, setIsWhatsappModalVisible] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const apiUrl = Constants.expoConfig.extra.API_URL;

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${apiUrl}/event/AllEvents`);
                setEvents(response.data.data.events);
            } catch (error) {
                Alert.alert('Error', 'Unable to fetch events');
            }
        };

        fetchEvents();
    }, []);

    // Placeholder for fetchUserId - replace with actual implementation

    // Handle event registration
    const handleRegistration = async () => {
        if (!selectedEvent) return;

        try {
            const userId = await fetchUserId();
            const response = await axios.post(
                `${apiUrl}/event/participate/${selectedEvent._id}/${userId}`
            );

            // Set WhatsApp link and show WhatsApp modal
            setWhatsappLink(selectedEvent.whatsappLink);
            setIsModalVisible(false);

            // Show WhatsApp link modal
            setIsWhatsappModalVisible(true);
        } catch (error) {
            Alert.alert('Registration Error', error.response?.data?.message || 'Registration failed');
        }
    };

    // Copy WhatsApp link to clipboard
    const copyWhatsappLink = () => {
        Clipboard.setString(whatsappLink);
        setIsWhatsappModalVisible(false)
        Alert.alert('Copied', 'WhatsApp link copied to clipboard');
    };

    // WhatsApp Link Modal
    const WhatsappLinkModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isWhatsappModalVisible}
            onRequestClose={() => setIsWhatsappModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.whatsappModalContainer}>
                    <PhoneCallIcon size={50} color="#25D366" style={styles.whatsappIcon} />
                    <Text style={styles.whatsappModalTitle}>Event Group Link</Text>

                    <View style={styles.whatsappLinkContainer}>
                        <Text
                            style={styles.whatsappLinkText}
                            numberOfLines={1}
                        >
                            {whatsappLink}
                        </Text>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={copyWhatsappLink}
                        >
                            <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Upcoming Events</Text>

            <ScrollView
                vertical
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['rgba(38,68,221,0.87)']} // Spinner colors for Android
                        tintColor="#FFA726" // Spinner color for iOS
                    />
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {events.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onPress={(selectedEvent) => {
                            setSelectedEvent(selectedEvent);
                            setIsModalVisible(true);
                        }}
                    />
                ))}
            </ScrollView>

            <EventDetailModal
                event={selectedEvent}
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onRegister={() => {
                    Alert.alert(
                        'Confirm Registration',
                        'Are you sure you want to register for this event?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel'
                            },
                            {
                                text: 'Register',
                                onPress: handleRegistration
                            }
                        ]
                    );
                }}
            />

            <WhatsappLinkModal />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
        display:"flex",
        paddingHorizontal:2,
        alignItems:"center",
        justifyContent:"center",
    },
    screenTitle: {
        fontSize: 24,
        fontFamily:"Spartan-Bold",
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    scrollViewContent: {
        paddingHorizontal: 10,
    },
    eventCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: "100%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 10,
    },
    cardContent: {
        padding: 15,
    },
    eventTitle: {
        fontSize: 16,
        fontFamily:"Spartan-SemiBold",
        marginBottom: 8,
    },
    clubInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    clubName: {
        fontSize: 14,
        fontFamily:"Spartan-SemiBold",
        color: '#007bff',
    },
    eventMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventMetaText: {
        marginLeft: 5,
        fontFamily:"Spartan-Regular",
        fontSize: 12,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        maxHeight: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#666',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily:"Spartan-Bold",
        marginBottom: 15,
        textAlign: 'center',
    },
    modalDetailSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalDetailText: {
        fontFamily:"Spartan-SemiBold",
        marginLeft: 10,
        fontSize: 12,
    },
    descriptionTitle: {
        fontSize: 16,
        fontFamily:"Spartan-SemiBold",
        marginTop: 15,
        marginBottom: 8,
    },
    description: {
        fontFamily:"Spartan-Medium",
        lineHeight:20,
        fontSize: 14,
        color: '#333',
        marginBottom: 15,
    },
    eventStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    eventStatItem: {
        alignItems: 'center',
    },
    eventStatValue: {
        fontSize: 18,
        fontFamily:"Spartan-Bold",
    },
    eventStatLabel: {
        fontFamily:"Spartan-SemiBold",
        fontSize: 12,
        color: '#666',
    },
    registerButton: {
        backgroundColor: '#007bff',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily:"Spartan-SemiBold",
    },
    whatsappModalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    whatsappIcon: {
        marginBottom: 15,
    },
    whatsappModalTitle: {
        fontSize: 20,
        fontFamily:"Spartan-SemiBold",
        marginBottom: 15,
    },
    whatsappLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        width: '100%',
    },
    whatsappLinkText: {
        flex: 1,
        marginRight: 10,
        fontSize: 14,
    },
    copyButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    copyButtonText: {
        color: 'white',
        fontFamily:"Spartan-SemiBold",
    },
    closeWhatsappModal: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
    },
    closeWhatsappModalText: {
        color: '#333',
        fontWeight: 'bold',
    },
});

