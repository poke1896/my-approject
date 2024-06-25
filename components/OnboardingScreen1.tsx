import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator'; 

const OnboardingScreen1: React.FC = () => {
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>(); 

  const navigateToOnboardingScreen2 = () => {
    navigation.navigate('Onboarding2'); 
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.gradient}>
        <Image source={require('../assets/chack.png')} style={styles.logo} />
        <Text style={styles.texto}>
          Planifica tus tareas a realizar, así estarás organizado y no te saltarás ninguna
        </Text>
        <View style={styles.rectangulos}>
          <View style={styles.rectangulo1} />
          <View style={styles.rectangulo2} />
        </View>
        <View style={styles.flecha}>
        <TouchableOpacity  onPress={navigateToOnboardingScreen2}>
          <Icon name="arrow-right" size={40} color="#FFFFFF"  />
        </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 300,
    height: 300,
    alignItems: 'center',
    resizeMode: 'contain',
  },
  texto: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    marginBottom:150,
    marginHorizontal: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangulos: {
    position: 'absolute',
    left: 160,
    top: 736,
    width: 91,
    height: 7,
  },
  rectangulo1: {
    position: 'absolute',
    left: 38.29,
    top: 0,
    width: 33.29,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },
  rectangulo2: {
    position: 'absolute',
    left: 10,
    top: 0,
    width: 18,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },
  flecha: {
    position: 'absolute',
    left: 310,
    top: 716,
    borderRadius: 3.5,
   
  },
});

export default OnboardingScreen1;
