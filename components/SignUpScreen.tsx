import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { RootStackParamList } from '../navigation/RootNavigator'; 
import { StackNavigationProp } from '@react-navigation/stack';

type SignUpScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
};


const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        email: user.email,
      });

      alert('Usuario registrado exitosamente');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };


  const navigateToLoginScreen = () => {
    navigation.navigate('Auth', { screen: 'Login' });

  };
  
  return (
    <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.container}>
      <Image source={require('../assets/escudoBlanco.png')} style={styles.logo} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.planificadorText}>Planificador UCR</Text>
      </View>

      <Text style={styles.createAccountText}>¡Crea una cuenta y únete a nosotras ahora!</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Nombre Completo"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
        />
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

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Repetir Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
        <Text style={styles.loginButtonText}>Registrar</Text>
      </TouchableOpacity>

      <Text style={styles.alreadyHaveAccountText}>
        ¿Ya tienes una cuenta?{' '}
      </Text>

      <TouchableOpacity style={styles.loginLink} onPress={navigateToLoginScreen}>
       <Text> Iniciar sesión</Text>
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
  createAccountText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
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
  alreadyHaveAccountText: {
    fontSize: 16,
    color: '#fff',
  },
  loginLink: {
    marginBottom: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default SignUpScreen;
