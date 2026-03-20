import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';
import { color } from '../../styles/styles';
 

const Loader = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={color.buttonColor} />
    </SafeAreaView>
  );
};

export default Loader;
