import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StartPage = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Array of images for the carousel
  const carouselItems = [
    { img: require("../../assets/images/logo1.png") },
    { img: require("../../assets/images/logo1.png") },
  ];

  const handleStarted = () => {
    navigation.replace('Login');
  };

  // Automatically scroll every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselItems.length; // Loop back to the first image
      setActiveIndex(nextIndex);

      // Scroll to the next image
      scrollViewRef.current.scrollTo({ x: nextIndex * screenWidth, animated: true });
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [activeIndex]);

  // Function to update the active index based on manual scroll position
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(slideIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Secure PII - A Masking Companion</Text>

      {/* Custom carousel using ScrollView */}
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16} // Adjust for better performance
        style={styles.carouselContainer} // Ensure ScrollView does not add any extra padding
      >
        {carouselItems.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={item.img} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Carousel indicators */}
      <View style={styles.indicatorContainer}>
        {carouselItems.map((_, index) => (
          <View key={index} style={[styles.indicator, index === activeIndex ? styles.activeIndicator : null]} />
        ))}
      </View>

      <Text numberOfLines={4} style={styles.paraText}>
        Innovative solution for detecting, protecting, and managing personally identifiable information across digital platforms. Our platform helps organizations maintain compliance, enhance data security, and build trust with advanced privacy tools.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleStarted} >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
            © 2024 Team Tech Elites. All rights reserved.
          </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical:20,
    fontFamily:'Spartan-Bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#533CEE',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  carouselContainer: {
    marginHorizontal:8,
    borderStyle: "solid",
    borderColor: "#533CEE",
    borderWidth: 2, // Set the width of the border
    borderRadius: 22,
    flexGrow: 0,
    marginBottom: 20,
  },

  slide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: screenWidth * 0.6,
    resizeMode: 'contain', // Ensure images fit without adding extra space
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    margin: 5,
  },
  activeIndicator: {
    backgroundColor: '#533CEE',
  },
  paraText: {
    fontFamily:'Spartan-Medium',
    lineHeight: 24,
    paddingHorizontal: 15,
    width: '100%',
    color: '#000000',
    fontSize: 16,
    textAlign: "left",
    marginTop:10,
    marginBottom: 20, // Add space between text and button
  },
  button: {
    elevation: 17,
    shadowColor: '#533CEE',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    width: '90%',
    backgroundColor: '#533CEE',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginTop:30,
    marginBottom: 20, // Add space from the bottom of the screen
  },
  buttonText: {
    fontFamily:'Spartan-Medium',
    color: '#fff',
    fontSize: 16,

  },
  footerText: {
    position: 'absolute', // Fixes the position
    bottom: 20, // Distance from the bottom of the screen
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});

export default StartPage;
