import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ title, value }) => {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );
};

const StatsDashboard = ({ stats }) => {
    return (
        <View style={styles.statsContainer}>
            <StatCard
                title="Total Scans"
                value={stats.totalScans || '59'}
            />
            <StatCard
                title="Verified Certificates"
                value={stats.totalVerifiedCertificates || '40'}
            />
            <StatCard
                title="Total Mentees"
                value={stats.totalMentors || '16'}
            />
            <StatCard
                title="Faculty Rating"
                value="4.5/5"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#f4f4f4',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontFamily: 'Spartan-Bold',
        color: '#333',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 12,
        fontFamily: 'Spartan-Medium',
        color: '#666',
        textAlign: 'center',
    },
});

export default StatsDashboard;