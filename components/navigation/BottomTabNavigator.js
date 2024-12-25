import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // For icons
import Dashboard from "../dashboard/Dashboard"
import Events from "../event/Event";
import Profile from "../profile/Profile";
import Locker from "../locker/Locker";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    }
                    else if (route.name === 'Events') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }else if (route.name === 'Locker') {
                        iconName = focused ? 'lock-closed' : 'lock-closed-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4D5DFA',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    height: 70, // Increase the height here
                    paddingBottom: 12, // Adjust padding for better spacing
                    backgroundColor: '#ffffff', // Optionally change the background color
                },
                tabBarLabelStyle: {
                    fontFamily: 'Spartan-SemiBold',
                    fontSize: 12, // Adjust label size if needed
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Dashboard}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Events"
                component={Events} // Use EventsPage component
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Locker"
                component={Locker} // Use ProfilePage component
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile} // Use ProfilePage component
                options={{ headerShown: false }}
            />

        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
