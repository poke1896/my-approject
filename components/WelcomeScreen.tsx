import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>(); 

  const navigateToOnboardingScreen1 = () => {
    navigation.navigate('Onboarding1'); 
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={navigateToOnboardingScreen1} style={styles.container}>
     
        <>
          <Image source={require('../assets/escudo.png')} style={styles.logo} />
          <Text style={styles.subtitle}>Planificador</Text>
          <View style={styles.footer}>
            <Image source={require('../assets/ucr_logo.png')} style={styles.ucrLogo} />
            <Text style={styles.footerText}>v 1.0.0</Text>
            <Text style={styles.footerText}>By Poke</Text>
          </View>
        </>
   
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 450,
    height: 350,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 30,
    color: '#8ED8F8',
    textAlign: 'center',
    marginVertical: 5,
    marginBottom: 200,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '145%',
    backgroundColor: '#00C0F3',
    alignItems: 'center',
    paddingVertical: 50,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
  },
  ucrLogo: {
    width: 130,
    height: 120,
    resizeMode: 'contain',
  },
  footerText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
});
