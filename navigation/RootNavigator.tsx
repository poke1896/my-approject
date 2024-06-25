import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: { screen: string; }; 
  Main: { screen: string; }; 
  Onboarding2:undefined;
  LoginScreen:undefined;
  SignUp:undefined;
  Perfile:undefined;
  Settings:undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <RootStack.Navigator initialRouteName="Onboarding">
      <RootStack.Screen 
        name="Onboarding" 
        component={OnboardingNavigator} 
        options={{ headerShown: false }} 
      />
      <RootStack.Screen 
        name="Auth" 
        component={AuthNavigator} 
        options={{ headerShown: false }} 
      />
      <RootStack.Screen 
        name="Main" 
        component={MainNavigator} 
        options={{ headerShown: false }} 
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;

