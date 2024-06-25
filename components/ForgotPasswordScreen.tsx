import React from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const ForgotPasswordScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#00C0F3', '#005DA4']}
      style={styles.container}
    >
      <Image source={require('../assets/escudoBlanco.png')} style={styles.logo} />
      <Text style={styles.title}>Recuperación de contraseña</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#000000" style={styles.icon} />
        <TextInput 
          placeholder="Correo Institucional" 
          style={styles.input} 
          placeholderTextColor="rgba(0, 0, 0, 0.44)" 
        />
      </View>

      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Solicitud de contraseña</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput 
          placeholder="Contraseña temporal" 
          secureTextEntry={true} 
          style={styles.input} 
          placeholderTextColor="rgba(0, 0, 0, 0.44)" 
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput 
          placeholder="Nueva Contraseña" 
          secureTextEntry={true} 
          style={styles.input} 
          placeholderTextColor="rgba(0, 0, 0, 0.44)" 
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput 
          placeholder="Repetir nueva Contraseña" 
          secureTextEntry={true} 
          style={styles.input} 
          placeholderTextColor="rgba(0, 0, 0, 0.44)" 
        />
      </View>
      
      <Link href="../login/login" style={styles.acceptButton} >
        <Text style={styles.acceptButtonText}>Aceptar</Text>
      </Link>
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
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
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
  requestButton: {
    backgroundColor: '#0EA5E9',
    width: '90%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#04D44B',
    width: '90%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForgotPasswordScreen;
