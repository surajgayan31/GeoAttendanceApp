import React, {  } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import navigationService from './navigationService';
import { RootStack } from './stacks';

 
 


const Navigator = () => {

  return (
    <NavigationContainer
      ref={navigatorRef => {
        navigationService.setTopLevelNavigator(navigatorRef);
      }}>
     <RootStack/>
    </NavigationContainer>
  );
};

export default Navigator;
