// Import responsive dimensions for component scaling across devices
 

// Import Alert for displaying pop-up messages
import {Alert, Text, View} from 'react-native';

// Import Moment.js for date and time formatting


// AsyncStorage for persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key used to store user data
const USER_DATA_KEY = 'USER_DATA';

// Utility class to handle common operations
export const Utils = {
  /* ......................Regex Patterns........................ */
  // Pattern for validating mobile numbers (6 to 14 digits)
  exp_pattern_mobile: /^[0-9]{6,14}$/,

  // Pattern for validating email addresses
  exp_pattern_email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  // Pattern for validating URLs
  exp_pattern_url:
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,

  // Pattern for validating Aadhaar number (India-specific format)
  exp_adhar_number: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,

  // Pattern for validating license strings (alphanumeric and spaces)
  exp_pattern_license: /^[a-zA-Z0-9 ]*$/,

  // Pattern for validating IFSC code format
  ifscCodePattern: /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/,

  // Symbol for representing rupees (Indian currency)
  rupees: '₹',
 
  /*.................Responsive Dimensions.....................*/
  // Calculate responsive height based on design reference height of 812
  calculateHeight(componentHeight: number) {
    return (componentHeight * 812) / 100;
  },

  // Calculate responsive width based on design reference width of 375
  calculateWidth(componentWidth: number) {
    return (componentWidth * 375) / 100;
  },

  /*.................Generate Random IDs.....................*/
  // Generate a random identifier with hexadecimal segments
  _getRandomId() {
    const S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4();
  },

  /*.................Data Handling Through AsyncStorage.....................*/
  // Retrieve user ID from AsyncStorage
  async _getUserId() {
    try {
      const json = await AsyncStorage.getItem(USER_DATA_KEY);
      const user = json ? JSON.parse(json) : null;
      return user?.user?.userId ?? user?.userId ?? null;
    } catch (e) {
      console.warn('Error reading user id from storage', e);
      return null;
    }
  },

  // Retrieve token from AsyncStorage
  async _getToken() {
    try {
      const json = await AsyncStorage.getItem(USER_DATA_KEY);
      const user = json ? JSON.parse(json) : null;
      return user?.token ?? null;
    } catch (e) {
      console.warn('Error reading token from storage', e);
      return null;
    }
  },

  // Save user data to AsyncStorage
  async _setUserData(userData: any) {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn('Error saving user data', e);
    }
  },

  async _removeUserData() {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (e) {
      console.warn('Error removing user data', e);
    }
  },

  // Retrieve user data from AsyncStorage
  async _getUserData() {
    try {
      const json = await AsyncStorage.getItem(USER_DATA_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.warn('Error reading user data', e);
      return null;
    }
  },

  // Handle user logout with confirmation prompt
 
  emptyComponent(text: string) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        {/* <Text style={defaultStyles.headingText}>{text}</Text> */}
      </View>
    );
  },
};
