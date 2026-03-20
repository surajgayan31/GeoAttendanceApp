import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Image } from 'react-native';
import { StatusBar } from 'react-native';
import navigationService from '../../routes/navigationService';
import { routes } from '../../routes/stacks';
import { color } from '../../styles/styles';

const Splash = () => {
    useEffect(() => {
      const timer = setTimeout(async () => {
        navigationService.navigate(routes.TAB_STACK);
      }, 2000);
    }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.content} pointerEvents="none">
        <Image
          source={require('../../assets/images/logo/splash.png')}
          style={{ height: 300, width: 300, resizeMode: 'center' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },

  bg1: {
    backgroundColor: '#FF6B6B',
    transform: [{ rotate: '14deg' }],
  },
  bg2: {
    backgroundColor: '#6B8CFF',
    transform: [{ rotate: '-12deg' }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:color.white
  },
  logoText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
  },
});

export default Splash;
