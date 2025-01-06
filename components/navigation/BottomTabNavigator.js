import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Dimensions } from "react-native";
import Dashboard from "../dashboard/Dashboard"
import Profile from "../profile/Profile";
import QuickScan from "../scan/QuickScan";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const BottomTabNavigator = () => {
    const CustomTabBarButton = ({ children, onPress }) => (
        <TouchableOpacity
            style={{
                display: 'flex',
                alignSelf: 'center', // Centers horizontally in parent
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom:70,
                width: 70,
                height: 70, // Adds space below the element
            }}
            onPress={onPress}
        >
            <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#5f0073',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {children}
            </View>
        </TouchableOpacity>
    );

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: {
                height: 70,
                paddingBottom: 12,
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
            },
                tabBarActiveTintColor: '#5f0073',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: 'Spartan-SemiBold',
            },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Dashboard}
                options={{
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="Scan"
                component={QuickScan}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: () => (
                        <Ionicons
                            name="scan"
                            color="#ffffff"
                            size={30}
                        />
                    ),
                    tabBarButton: (props) => <CustomTabBarButton {...props} />,
                    tabBarLabel: () => null,
                })}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;