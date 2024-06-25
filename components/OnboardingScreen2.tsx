import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type OnboardingScreen2Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Onboarding2'>;
};

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ navigation }) => {

  const navigateToLogin = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <View style={styles.gradient}>
      <LinearGradient
        colors={['#00C0F3', '#005DA4']}
        style={styles.gradient}
      >
        <Image source={require('../assets/grupo.png')} style={styles.logo} />
        <Text style={styles.texto}>Trabaja en equipo, conéctate y trabaja tus tareas con tus compañeros.</Text>
        <View style={styles.rectangulos2}>
          <View style={styles.rectangulo3} />
          <View style={styles.rectangulo4} />
        </View>
        <View style={styles.flecha2}>
          <TouchableOpacity onPress={navigateToLogin}>
            <Icon name="arrow-right" size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

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
    marginBottom: 150,
    marginHorizontal: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rectangulos2: {
    position: 'absolute',
    left: 160,
    top: 736,
    width: 91,
    height: 7,
  },
  rectangulo3: {
    position: 'absolute',
    left: 38.29,
    top: 0,
    width: 33.29,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },
  rectangulo4: {
    position: 'absolute',
    left: 10,
    top: 0,
    width: 18,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },

  flecha2: {
    position: 'absolute',
    left: 310,
    top: 716,
    borderRadius: 3.5,
  },
});

export default OnboardingScreen2;
