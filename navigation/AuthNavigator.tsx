import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/LoginScreen';
import SignUpScreen from '../components/SignUpScreen';
import ForgotPasswordScreen from '../components/ForgotPasswordScreen';


export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  
 
};


const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator >
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
    <AuthStack.Screen name="SignUp" component={SignUpScreen}  options={{ headerShown: false }} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen}  options={{ headerShown: false }} />
  </AuthStack.Navigator>
);

export default AuthNavigator;
