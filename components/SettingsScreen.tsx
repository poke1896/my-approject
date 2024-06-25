import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles'; 
import { MainStackParamList } from '../navigation/MainNavigator'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../firebaseConfig'; // Importa auth desde tu configuración de Firebase
import { RootStackParamList } from '../navigation/RootNavigator'; 


type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
};


const SettingsScreen: React.FC <LoginScreenProps>= ({ navigation }) => {

  const handlePerfile = () => {
    navigation.navigate('Perfile');
  };
  
  const handleLogout = () => {
    auth.signOut().then(() => {
      // Cerrar sesión exitosamente
      Alert.alert('Cerrar sesión', 'Se ha cerrado sesión exitosamente.');
     
      navigation.navigate('Auth', { screen: 'Login' });
    }).catch((error) => {
      
      console.error('Error al cerrar sesión:', error.message);
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    });
  };

  return (
    <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.containerSettings}>
      <Text style={styles.titleSettings}>Ajustes</Text>

      <TouchableOpacity onPress={handlePerfile} style={styles.settingItemSettings}>
        <View style={styles.flexRowSettings}>
          <Icon name="user-circle" size={24} color="#ffffff" />
          <Text style={styles.settingTextSettings}>Perfil</Text>
        </View>
        <TouchableOpacity  style={styles.flexRowSettings}>
          <Icon name="angle-right" size={34} color="#86DAED" />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.dividerSettings} />

      <View style={styles.settingItemSettings}>
        <View style={styles.flexRowSettings}>
          <Icon name="comment" size={24} color="#ffffff" />
          <Text style={styles.settingTextSettings}>Correos institucionales</Text>
        </View>
        <View style={styles.flexRowSettings}>
          <Icon name="angle-right" size={34} color="#86DAED" />
        </View>
      </View>

      <View style={styles.dividerSettings} />

      <View style={styles.settingItemSettings}>
        <View style={styles.flexRowSettings}>
          <Icon name="cogs" size={24} color="#ffffff" />
          <Text style={styles.settingTextSettings}>Proyectos</Text>
        </View>
        <View style={styles.flexRowSettings}>
          <Icon name="angle-right" size={34} color="#86DAED" />
        </View>
      </View>

      <View style={styles.dividerSettings} />

      <View style={styles.settingItemSettings}>
        <View style={styles.flexRowSettings}>
          <Icon name="search" size={24} color="#ffffff" />
          <Text style={styles.settingTextSettings}>Términos y condiciones</Text>
        </View>
        <View style={styles.flexRowSettings}>
          <Icon name="angle-right" size={34} color="#86DAED" />
        </View>
      </View>

      <View style={styles.dividerSettings} />

 <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonSettings}>
        <Icon name="sign-out" size={24} color="#DC4343" />
        <Text style={styles.logoutButtonTextSettings}>Cerrar sesión</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SettingsScreen;

