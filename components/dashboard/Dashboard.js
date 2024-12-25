import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import StorageUtil from "../utilities/StorageUtil";
import axios from 'axios';
import Constants from "expo-constants";

// API URL from Expo config
const apiUrl = Constants.expoConfig.extra.API_URL;

const DigiLockerDashboard = () => {
    const [userData, setUserData] = useState({
        name: '',
        phoneNumber: '',
        profilePicture: null,
        registrationNumber: '',
        userId: ''
    });

    const [statistics, setStatistics] = useState({
        totalActivityPoints: 0,
        totalEventsRegistered: 0,
        eventsAttended: 0,
        totalCertificates: 0,
        activityPointsBreakdown: []
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
                const response = await axios.get(`${apiUrl}/users/${parsedUserData._id}/statistics`);
                setStatistics(response.data.data);
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
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    // Custom Progress Bar Component
    const ActivityPointsProgressBar = ({ points }) => {
        // Clamp points between 0 and 100
        const clampedPoints = Math.min(Math.max(points, 0), 100);
        const screenWidth = Dimensions.get('window').width;
        const progressWidth = (clampedPoints / 100) * (screenWidth - 40);

        return (
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarBackground, { width: progressWidth }]} />
                <Text style={styles.progressBarText}>
                    {clampedPoints} / 100 Activity Points
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

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
            <ScrollView
                contentContainerStyle={styles.dashboardContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['rgba(38,68,221,0.87)']}
                        tintColor="#FFA726"
                    />
                }
            >
                {/* Activity Points Progress Bar */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Activity Points</Text>
                    <ActivityPointsProgressBar points={statistics.totalActivityPoints} />
                </View>

                {/* Events Registered and Attended Pie Chart */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Event Participation</Text>
                    <PieChart
                        data={[
                            {
                                name: 'Registered \n Events',
                                population: statistics.totalEventsRegistered,
                                color: 'rgb(76,92,248)',
                                legendFontColor: '#000000',
                                legendFontSize: 15
                            },
                            {
                                name: 'Attended Events',
                                population: statistics.eventsAttended,
                                color: 'rgb(85,195,122)',
                                legendFontColor: '#000000',
                                legendFontSize: 15
                            }
                        ]}
                        width={320}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#1e2923',
                            backgroundGradientFrom: '#08130D',
                            backgroundGradientTo: '#1e2923',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            }
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        style={{
                            borderRadius: 16,
                        }}
                    />
                    <Text style={styles.summaryText}>Total Events Participated - {statistics.totalEventsRegistered}</Text>
                </View>

                {/* Certificates Section */}
                <View style={styles.certificatesContainer}>
                    <Text style={styles.chartTitle}>Total Certificates: {statistics.totalCertificates}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    progressBarContainer: {
        width: '100%',
        height: 30,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    progressBarBackground: {
        position: 'absolute',
        height: '100%',
        backgroundColor: 'rgb(76,92,248)',
        borderRadius: 15
    },
    progressBarText: {
        alignSelf: 'center',
        color: '#000',
        fontWeight: 'bold',
        zIndex: 1
    },
    userProfileContainer: {
        padding: 16,
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
        fontSize: 18,
        fontFamily:"Spartan-Bold"
    },
    aadharNumber: {
        fontFamily:"Spartan-Medium",
        lineHeight:24,
        fontSize: 14,
        color: '#555',
    },
    dashboardContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily:"Spartan-Bold",
        marginBottom: 16,
    },
    chartContainer: {
        width:"100%",
        marginBottom: 30,
    },
    summaryText: {
        fontSize: 16,
        fontFamily:"Spartan-Bold",
        margin: 8,
    },
    chartTitle: {
        fontSize: 18,
        fontFamily:"Spartan-Bold",
        marginBottom: 8,
    },
    certificatesContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
});

export default DigiLockerDashboard;
