import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import Headers from "../../../component/header/Header";
import { color } from '../../../styles/styles';

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* <Headers title="Profile" showBack={false} /> */}
      <StatusBar barStyle="dark-content" backgroundColor={color.primary} translucent={false} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🔥 HEADER */}
        <View style={styles.headerCard}>
          <Text style={styles.name}>Suraj Gayan</Text>
          <Text style={styles.role}>React Native Developer</Text>
          <Text style={styles.contact}>📧 surajgayan31@gmail.com</Text>
          <Text style={styles.contact}>📞 9079626031</Text>
        </View>

        {/* 🔥 ABOUT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.desc}>
            React Native Developer with 1.5+ years of experience building
            high-performance mobile applications. Skilled in Redux, Firebase,
            real-time features, and creating pixel-perfect UI with smooth
            navigation and performance optimization.
          </Text>
        </View>

        {/* 🔥 EXPERIENCE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.bold}>Soft Futura</Text>
          <Text style={styles.light}>React Native Developer (June 2024 - Present)</Text>

          <Text style={styles.list}>• Cross-platform app development</Text>
          <Text style={styles.list}>• Redux & API optimization</Text>
          <Text style={styles.list}>• Firebase (Auth, Firestore, FCM)</Text>
          <Text style={styles.list}>• Real-time tracking & background tasks</Text>
        </View>

        {/* 🔥 PROJECTS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Projects</Text>

          <Text style={styles.project}>🚀 ClinicZones</Text>
          <Text style={styles.descSmall}>Real-time healthcare mission tracking app</Text>

          <Text style={styles.project}>🍔 Zery</Text>
          <Text style={styles.descSmall}>15-min food delivery app with live tracking</Text>

          <Text style={styles.project}>🎉 Eventlane</Text>
          <Text style={styles.descSmall}>Event hosting & management platform</Text>

          <Text style={styles.project}>🏍 Wheelsz</Text>
          <Text style={styles.descSmall}>Two-wheeler loan application</Text>
        </View>

        {/* 🔥 SKILLS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills</Text>

          <View style={styles.skillsWrap}>
            {[
              "React Native", "JavaScript", "Redux",
              "Firebase", "Google Maps", "API Integration",
              "Reanimated", "Lottie", "Git"
            ].map((skill, index) => (
              <View key={index} style={styles.skillBox}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 🔥 EDUCATION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Education</Text>

          <Text style={styles.bold}>MCA</Text>
          <Text style={styles.light}>Rajasthan Technical University</Text>

          <Text style={styles.bold}>BCA</Text>
          <Text style={styles.light}>Kota University</Text>
        </View>

      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  headerCard: {
    backgroundColor: color.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  role: {
    fontSize: 14,
    color: '#EAF2FF',
    marginTop: 4,
  },

  contact: {
    fontSize: 12,
    color: '#EAF2FF',
    marginTop: 2,
  },

  card: {
    backgroundColor: '#fff',
    margin: 14,
    borderRadius: 14,
    padding: 15,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },

  desc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  descSmall: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },

  bold: {
    fontWeight: '700',
    fontSize: 13,
    marginTop: 6,
  },

  light: {
    fontSize: 12,
    color: '#777',
  },

  list: {
    fontSize: 12,
    marginTop: 4,
    color: '#444',
  },

  project: {
    fontWeight: '700',
    marginTop: 6,
    fontSize: 13,
  },

  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  skillBox: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 4,
  },

  skillText: {
    fontSize: 11,
    color: '#007AFF',
  },
});
export default Profile;