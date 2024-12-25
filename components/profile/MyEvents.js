import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import axios from 'axios';
import Constants from "expo-constants";
import fetchUserId from "../utilities/FetchUserId";

const apiBaseUrl = Constants.expoConfig.extra.API_URL;


const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const userId = await fetchUserId();
        try {
            const response = await axios.get(`${apiBaseUrl}/users/${userId}/events`);
            if (response.data.status === 'success') {
                setEvents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const openModal = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedEvent(null);
    };

    const renderEvent = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.clubName}>Club: {item.club.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item) => item._id}
                renderItem={renderEvent}
            />

            {selectedEvent && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                            <Text style={styles.modalText}>Club: {selectedEvent.club.name}</Text>
                            <Text style={styles.modalText}>Description: {selectedEvent.description}</Text>
                            <Text style={styles.modalText}>Start Date: {new Date(selectedEvent.startDate).toLocaleString()}</Text>
                            <Text style={styles.modalText}>End Date: {new Date(selectedEvent.endDate).toLocaleString()}</Text>
                            <Text style={styles.modalText}>Venue: {selectedEvent.venue}</Text>
                            <Text style={styles.modalText}>Status: {selectedEvent.status}</Text>
                            <Text style={styles.modalText}>Activity Points: {selectedEvent.activityPoints}</Text>
                            <Button title="Close" onPress={closeModal} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default MyEvents;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontFamily:"Spartan-SemiBold",
        color: '#333',
    },
    clubName: {
        fontSize: 14,
        color: '#555',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily:"Spartan-SemiBold",
        marginBottom: 10,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        fontFamily:"Spartan-Regular",
        marginVertical: 5,
        color: '#555',
    },
});
