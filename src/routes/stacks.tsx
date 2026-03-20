import React from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/auth/Splash';
import Dashboard from '../screens/home/DashBoard/Dashboard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Utils } from '../utils/Utils';
import { color, fontFamily, fontSize } from '../styles/styles';
import Profile from '../screens/home/profile/Profile';
import { SafeAreaView } from 'react-native-safe-area-context';
import History from '../screens/home/history/History';
import Tracking from '../screens/home/Tracking/Tracking';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const routes = {
  NAVIGATION_AUTH_LOADING_STACK: 'NAVIGATION_AUTH_LOADING_STACK',
  Splash: 'Splash',
  Dashboard: 'Dashboard',
  ApplyHistory: 'ApplyHistory',
  Profile: 'Profile',
  TAB_STACK: 'TAB_STACK',
  History: 'History',
  Tracking:'Tracking',
};

const horizontalAnimation = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

export const verticalAnimation = {
  gestureDirection: 'vertical',
  cardStyleInterpolator: (current: any, layouts: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },
};

export const RootStack = () => (
  <Stack.Navigator
    screenOptions={{
      animationTypeForReplace: 'pop',
      headerShown: false,
      animationEnabled: Platform.OS == 'android' ? false : true,
    }}
  >
    <Stack.Screen
      name={routes.NAVIGATION_AUTH_LOADING_STACK}
      component={MyAuthLoadingStack}
    />
     <Stack.Screen
      name={routes.Tracking} component={Tracking}
    />
  </Stack.Navigator>
);

export const MyAuthLoadingStack = () => (
  <Stack.Navigator
    screenOptions={{
      animationTypeForReplace: 'pop',
      headerShown: false,
      animationEnabled: Platform.OS == 'android' ? false : true,
    }}
  >
    <Stack.Screen name={routes.Splash} component={Splash} />
    
     <Tab.Screen
      name={routes.TAB_STACK} component={TAB_STACK}
    />

     <Stack.Screen
      name={routes.Tracking} component={Tracking}
    />
  </Stack.Navigator>
);

export const TAB_STACK = () => (
  <SafeAreaView
    style={{ flex: 1, backgroundColor: color.white }}
    edges={['top','bottom']}
  >
      <StatusBar barStyle="dark-content" backgroundColor={color.primary} translucent={false} />

    <Tab.Navigator
      initialRouteName={'Dashboard'}
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: color.white,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
        // tabBarStyle: { backgroundColor: color.white },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused
              ? require('../assets/images/icon/dashboard.png')
              : require('../assets/images/icon/dashboard.png');
          } 
          // else if (route.name === 'ApplyHistory') {
          //   iconName = focused
          //     ? require('../assets/images/icon/history.png')
          //     : require('../assets/images/icon/history.png');
          // } 
          else if (route.name === 'History') {
            iconName = focused
              ? require('../assets/images/icon/history.png')
              : require('../assets/images/icon/history.png');
          }
          else if (route.name === 'Profile') {
            iconName = focused
              ? require('../assets/images/icon/profile.png')
              : require('../assets/images/icon/profile.png');
          } 

          return (
            <Image
              source={iconName}
              style={{
                width: size,
                height: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          );
        },
        tabBarActiveTintColor: color.primary,
        // tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      {/* <Tab.Screen name="ApplyHistory" component={ApplyHistory} /> */}
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  </SafeAreaView>
);
