import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User signed in, navigate to home screen
      navigation.navigate('Main', { screen: 'Home2' });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  const navigateToForgotPasswordScreen = () => {
    navigation.navigate('Auth', { screen: 'ForgotPassword' });
  };

  const navigateToSignUpScreen = () => {
    navigation.navigate('Auth', { screen: 'SignUp' });
  };

  return (
    <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.container}>
      <Image source={require('../assets/escudoBlanco.png')} style={styles.logo} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.planificadorText}>Planificador UCR</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Correo Institucional"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.forgotPassword} onPress={navigateToForgotPasswordScreen}>
        <Text>¿Recordar contraseña?</Text>  
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        ¿No tienes una cuenta?{' '}
      </Text>

      <TouchableOpacity style={styles.signUpLink} onPress={navigateToSignUpScreen}>
        <Text>Inscribirse</Text> 
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 146,
    height: 121,
    marginBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
  },
  planificadorText: {
    fontSize: 18,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 10, 
    width: '90%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'rgba(0, 0, 0, 0.44)', 
  },
  forgotPassword: {
    marginBottom: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#04D44B',
    width: '90%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 16,
    color: '#fff',
  },
  signUpLink: {
    marginBottom: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default LoginScreen;
