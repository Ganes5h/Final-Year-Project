import React, { } from 'react';
import { View, Text, Image, StyleSheet, Linking, Animated, ScrollView, TouchableOpacity,Dimensions  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Data for team members
const teamMembers = [
  {
    name: 'Niraj Vernekar',
    role: 'Backend Developer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQEnER56cE93eA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720375471643?e=1733961600&v=beta&t=Y0R5KRV5U6yB9ewTif9WJSBHH58XyWJDBQR3mM2wbBI',
    github: 'https://github.com/nirajvernekar02',
    linkedin: 'https://www.linkedin.com/in/niraj-vernekar-691875196/',
    twitter: 'https://twitter.com/niraj',
  },
  {
    name: 'Avinash Pauskar',
    role: 'Mobile App Developer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQGnSeIGhsbB2A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730264201672?e=1738800000&v=beta&t=jRH5GVpqWlNgvDb9Lan1ngvJYFOZoFj6nxabKG0HAQ4',
    github: 'https://github.com/avinash-p05',
    linkedin: 'https://linkedin.com/in/avinash-pauskar',
    twitter: 'https://twitter.com/avinash_pauskar',
  },
  {
    name: 'Ganesh Kugaji',
    role: 'Frontend Developer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQFzgmLfwH1jvg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1704341115201?e=1733961600&v=beta&t=Kt5PZUnqTaU_DDPqgZbChDR9bpFkqOWOV7KZUUrz7nY',
    github: 'https://github.com/Ganes5h',
    linkedin: 'https://in.linkedin.com/in/ganesh-kugaji05',
    twitter: 'https://twitter.com/ganesh',
  },
  {
    name: 'Keerti Patil',
    role: 'Research Head',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQEXltPB-tH33g/profile-displayphoto-shrink_400_400/B56ZOYAax_GwAo-/0/1733422068126?e=1738800000&v=beta&t=LO783tGLi8GS9s6S1w_IS1rVKhV9qUYpCSqiI61mxsY', // Ensure this path is correct
    github: 'https://github.com/avinash-p05',
    linkedin: 'https://linkedin.com/in/avinash-pauskar',
    twitter: 'https://twitter.com/avinash_pauskar',
  },
  {
    name: 'Om Vasudev',
    role: 'Frontend Developer',
    image: "https://media.licdn.com/dms/image/v2/D5603AQHuTtlTgxTsqA/profile-displayphoto-shrink_800_800/B56ZOYBV1zGwAc-/0/1733422310567?e=1738800000&v=beta&t=e63bB8n-jjFpYD4-HWQ4UUWpFxsvB-7iBcHhDEIujzI", // Ensure this path is correct
    github: 'https://github.com/OmVasudev',
    linkedin: 'https://www.linkedin.com/in/om-vasudev-a14109244',
    twitter: 'https://x.com/OmVasudev3',
  },
  {
    name: 'Shriram Naik',
    role: 'AI/ML and Python Developer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQGY_Juo2KXoZg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715614078291?e=1738800000&v=beta&t=FJmAPj5WyItLRH2SUhtvLhD_m-YbwukZX-CuVEACpHA', // Ensure this path is correct
    github: 'https://github.com/Shriram-11',
    linkedin: 'https://www.linkedin.com/in/shriram-naik-01b4641a9/',
    twitter:'https://twitter.com/Shriram_Naik_',
  }
];

// Developers Component
export default function Developers() {
  // Social Media Icon Component
  const SocialIcon = ({ name, url }) => (
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Icon name={name} size={18} color="#4D5DFA" style={styles.icon} />
      </TouchableOpacity>
  );

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Meet the Developers</Text>
        <View style={styles.gridContainer}>
          {teamMembers.map((member, index) => (
              <View key={index} style={styles.card}>
                <Image
                    source={typeof member.image === 'string' ? { uri: member.image } : member.image}
                    style={styles.image}
                />
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.role}>{member.role}</Text>

                {/* Social Media Icons */}
                <View style={styles.socialIcons}>
                  <SocialIcon name="github" url={member.github} />
                  <SocialIcon name="linkedin" url={member.linkedin} />
                  <SocialIcon name="twitter" url={member.twitter} />
                </View>
              </View>
          ))}
        </View>
      </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(137,162,255,0.1)',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Spartan-Bold',
    marginBottom: 20,
    color: 'rgba(38,68,221,0.87)',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 15,
    alignItems: 'center',
    width: (width - 40) / 2, // Two cards per row with some padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#4D5DFA',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Spartan-SemiBold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  role: {
    fontSize: 12,
    color: '#555',
    marginBottom: 15,
    fontFamily: 'Spartan-Medium',
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    width: '100%',
  },
  icon: {
    marginHorizontal: 15,
    borderRadius: 50,
    padding: 6,
    backgroundColor: '#EFEFF5',
    elevation: 2,
  },
});
