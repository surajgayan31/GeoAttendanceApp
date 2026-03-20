/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigators from './src/routes/navigators';
import { color } from './src/styles/styles';
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      {/* Default status bar for the app (screens can override) */}
      {/* <StatusBar barStyle="dark-content" backgroundColor={color.primary} /> */}
      <StatusBar barStyle="dark-content" backgroundColor={color.primary} translucent={false} />
      <Navigators />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
