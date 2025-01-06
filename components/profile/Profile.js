import React, { useState, useEffect,useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
  Animated,
  StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StorageUtil from "../utilities/StorageUtil";

const useResponsiveStyles = () => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isTablet = width >= 768;

  const scale = Math.min(width, height) / 375;
  const normalize = (size) => (isWeb ? size : Math.round(scale * size));

  return { isWeb, isTablet, normalize, screenWidth: width };
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const MenuItem = ({ icon, title, badge, onPress }) => (
    <AnimatedTouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color="#5f0073" style={styles.menuIcon} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#A1A1A1" />
      </View>
    </AnimatedTouchableOpacity>
);

export default function Profile({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isWeb, isTablet, normalize } = useResponsiveStyles();
  const [fieldsVisible, setFieldsVisible] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    phoneNumber: '',
    profilePicture:require('../../assets/images/profile.png') ,
    registrationNumber:''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await StorageUtil.retrieveAndDecrypt('user');
        const parsedUserData = typeof storedUserData === "string"
            ? JSON.parse(storedUserData)
            : storedUserData;
        console.log("userdata"+storedUserData)
        if (parsedUserData) {
          setUserData({
            registrationNumber:parsedUserData.registrationNumber,
            name: parsedUserData.name,
            phoneNumber: parsedUserData.email,
            profilePicture: require('../../assets/images/profile.png') // Assuming this is a static image
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);
  const handleLogout = useCallback(async () => {
    try {
      // Wrap all async operations in Promise.all for parallel execution
      await Promise.all([
        StorageUtil.removeData("userToken"),
        StorageUtil.removeData("user")
      ]);

      // Navigate after all storage operations are complete
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally handle error - show alert, etc.
    }
  }, [navigation]); // Add navigation to dependencies

  const handleMenuPress = (menuItem) => {
    switch (menuItem) {
      case 'My Mentees':
        // Navigate to the logs page or perform the action
        console.log('Opening Help and Support');
        break;
      case 'My Certificates':
        // Navigate to help or support
        console.log('Opening Help and Support');
        break;
      case 'Raise an Issue':
        // Navigate to the issue page or show a dialog
        console.log('Navigating to Raise an Issue');
        break;
      case 'About Us':
        // Show about us information
        console.log('Showing About Us information');
        break;
      case 'Terms and Conditions':
        // Show terms and conditions
        console.log('Showing Terms and Conditions');
        break;
      default:
        console.log('Unknown action');
    }
  };


  return (
      <ScrollView
          style={[styles.container, { paddingTop: isWeb ? normalize(20) : insets.top + StatusBar.currentHeight }]}
          contentContainerStyle={styles.scrollViewContent}
      >
          <View style={[styles.header, isTablet && styles.tabletHeader]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarInner}>
                <View style={styles.avatar}>
                  <Image
                      source={userData.profilePicture}
                      style={styles.avatar}
                  />
                </View>

                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={normalize(20)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userId}>{userData.registrationNumber}</Text>
              <Text style={styles.username}>{userData.name || 'Prof. Sagar Pujar'}</Text>
              <Text style={styles.collegeName}>{userData.phoneNumber}</Text>
            </View>

            <TouchableOpacity onPress={() => setFieldsVisible(!fieldsVisible)} style={styles.toggleButton}>
              <Text style={styles.toggleText}>{fieldsVisible ? 'Hide Details' : 'Show Details'}</Text>
            </TouchableOpacity>

            {fieldsVisible && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>Additional Info 1</Text>
                  <Text style={styles.detailsText}>Additional Info 2</Text>
                </View>
            )}

            <View style={[styles.buttonContainer, isTablet && styles.tabletButtonContainer]}>
              {['Edit Profile', 'Settings', 'Share'].map((text, index) => (
                  <TouchableOpacity key={text} style={styles.button}>
                    <Ionicons name={['create', 'settings', 'share'][index]} size={normalize(18)} color='#5f0073' />
                    <Text style={styles.buttonText} onPress={handleLogout}>{text}</Text>
                  </TouchableOpacity>
              ))}
            </View>

            {/* Only keep this block, remove duplicate below */}
            <View style={styles.menu}>
              <MenuItem
                  icon="card"
                  title="My Mentees"
                  onPress={() => navigation.navigate("MyEvents")}
              />
              <MenuItem
                  icon="help-circle"
                  title="My Certificates"
                  onPress={() => handleMenuPress('My Certificates')}
              />
              <MenuItem
                  icon="warning"
                  title="Raise an Issue"
                  onPress={() => handleMenuPress('Raise an Issue')}
              />
              <MenuItem
                  icon="information-circle"
                  title="About Us"
                  onPress={() => handleMenuPress('About Us')}
              />
              <MenuItem
                  icon="document-text"
                  title="Terms and Conditions"
                  onPress={() => handleMenuPress('Terms and Conditions')}
              />
            </View>


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={normalize(24)} color="#FFFFFF" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30, // Add some padding at the bottom
  },
  content: {
    padding: 40,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  tabletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatarInner: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderColor:"#5f0073",
    backgroundColor: 'rgba(255,255,255,0)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5f0073',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 15px #5f0073',
      },
    }),
  },
  userInfo: {
    alignItems: 'center',
  },
  userId: {
    fontSize: 12,
    fontFamily:'Spartan-Medium',
    color: '#A1A1A1',
  },
  username: {
    fontSize: 14,
    fontFamily:'Spartan-Bold',
  },
  collegeName: {
    fontSize: 12,
    fontFamily:'Spartan-Medium',
    color: '#A1A1A1',
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleText: {
    fontFamily:'Spartan-Medium',
    color: '#5f0073',
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  detailsText: {
    fontFamily:'Spartan-Medium',
    fontSize: 12,
  },
  buttonContainer: {

    marginHorizontal: -20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  tabletButtonContainer: {
    justifyContent: 'flex-start',
  },
  button: {
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',      // Center the content vertically
    justifyContent: 'center',  // Center the content horizontally
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5f0073',
    borderRadius: 10,
    padding: 10,
    flex: 1,                  // Make the button expand to fill available space
    maxWidth: '30%',           // Optional: Maintain button size consistency
  },
  buttonText: {
    fontSize: 10,
    fontFamily: 'Spartan-SemiBold',
    marginLeft: 5,
    color: '#5f0073',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },

  menu: {
    marginTop: 20,
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontFamily:'Spartan-Medium',
    fontSize: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  logoutButton: {
    display:'flex',
    alignContent:"center",
    justifyContent:"center",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5f0073',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '60%',
  },
  logoutText: {
    fontFamily:'Spartan-Medium',
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 12,
  },
});
