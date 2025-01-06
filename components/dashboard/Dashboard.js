import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import StorageUtil from "../utilities/StorageUtil";
import Constants from "expo-constants";
import StatsDashboard from './StatsDashboard'; // Import the new stats component

// API URL from Expo config
const apiUrl = Constants.expoConfig.extra.API_URL;

const DigiLockerDashboard = () => {
    const [userData, setUserData] = useState({
        name: '',
        phoneNumber: '',
        profilePicture: require("../../assets/images/profile.png"),
        registrationNumber: '',
        userId: ''
    });

    const [statsData, setStatsData] = useState({
        totalScans: 0,
        totalVerifiedCertificates: 0,
        totalMentors: 0,
        facultyRating: 0
    });

    const [refreshing, setRefreshing] = useState(false);

    // Fetch user and analytics data
    const fetchData = async () => {
        try {
            const storedUserData = await StorageUtil.retrieveAndDecrypt('user');
            const parsedUserData = typeof storedUserData === "string" ? JSON.parse(storedUserData) : storedUserData;

            if (parsedUserData) {
                setUserData({
                    name: parsedUserData.name,
                    phoneNumber: parsedUserData.email,
                    profilePicture: require('../../assets/images/profile.png'),
                    registrationNumber: parsedUserData.registrationNumber,
                    userId: parsedUserData._id
                });

                // Fetch analytics data
                const response = await fetch(`${apiUrl}/analytics`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${parsedUserData.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const analyticsData = await response.json();
                    setStatsData({
                        totalScans: analyticsData.totalScans || 0,
                        totalVerifiedCertificates: analyticsData.totalVerifiedCertificates || 0,
                        totalMentors: analyticsData.totalMentors || 0,
                        facultyRating: analyticsData.facultyRating || 0
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true); // Start the refresh indicator
        await fetchData();  // Re-fetch data
        setRefreshing(false); // End the refresh indicator
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#9Bd35A', '#689F38']}
                    />
                }
            >
                {/* User Profile Section */}
                <View style={styles.userProfileContainer}>
                    <View style={styles.userInfo}>
                        <Image source={userData.profilePicture} style={styles.profileImage} />
                        <View>
                            <Text style={styles.userName}>{userData.name}</Text>
                            <Text style={styles.aadharNumber}>{userData.phoneNumber}</Text>
                            <Text style={styles.aadharNumber}>{userData.registrationNumber}</Text>

                        </View>
                    </View>
                </View>

                {/* Analytics Dashboard Section */}
                <StatsDashboard stats={statsData} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    userProfileContainer: {
        padding: 16,
        marginTop:20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    userName: {
        fontSize: 14,
        fontFamily:"Spartan-Bold"
    },
    aadharNumber: {
        fontFamily:"Spartan-Medium",
        lineHeight:24,
        fontSize: 12,
        color: '#555',
    },
});

export default DigiLockerDashboard;