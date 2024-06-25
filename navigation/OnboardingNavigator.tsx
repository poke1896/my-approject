import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../components/WelcomeScreen';
import OnboardingScreen1 from '../components/OnboardingScreen1';
import OnboardingScreen2 from '../components/OnboardingScreen2';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;

};

const OnboardingStack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => (
  <OnboardingStack.Navigator initialRouteName="Welcome">
    <OnboardingStack.Screen 
      name="Welcome" 
      component={WelcomeScreen} 
      options={{ headerShown: false }} 
    />
    <OnboardingStack.Screen 
      name="Onboarding1" 
      component={OnboardingScreen1} 
      options={{ headerShown: false }} 
    />
    <OnboardingStack.Screen 
      name="Onboarding2" 
      component={OnboardingScreen2} 
      options={{ headerShown: false }} 
    />

  </OnboardingStack.Navigator>
);

export default OnboardingNavigator;


