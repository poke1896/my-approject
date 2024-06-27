import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../firebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { collection, updateDoc, query, where, getDocs } from 'firebase/firestore';

const Profile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [newName, setNewName] = useState('');
  const [loadingOperation, setLoadingOperation] = useState(false);

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);

      // Verificar que la nueva contraseña y la confirmación coincidan
      if (newPassword !== confirmNewPassword) {
        setError('Las nuevas contraseñas no coinciden');
        setLoading(false);
        return;
      }

      // Verificar que la nueva contraseña tenga al menos 6 caracteres
      if (newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      // Obtener el usuario actual
      const user = auth.currentUser;

      // Verificar que el usuario tenga un email válido
      if (user && user.email) {
        // Reautenticar al usuario con su contraseña actual
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Actualizar la contraseña
        await updatePassword(user, newPassword);

        // Contraseña actualizada exitosamente
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      } else {
        setError('El usuario no tiene un email válido');
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'La contraseña actual no es correcta');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = async (newName: string) => {
    try {
      // Obtener el usuario actual
      setLoadingOperation(true);
      const user = auth.currentUser;

      if (user) {
        // consulta para encontrar el documento donde el campo "uid" coincida con el UID del usuario
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        // Verificar si se encontró algún documento
        if (!querySnapshot.empty) {
          // Obtener el primer documento encontrado (suponiendo que solo debería haber uno)
          const userDoc = querySnapshot.docs[0];

          // Actualizar el campo de nombre en el documento del usuario
          await updateDoc(userDoc.ref, {
            name: newName
          });

          Alert.alert('Éxito', 'Nombre actualizado correctamente');
        } else {
          Alert.alert('Error', 'No se encontró el documento del usuario');
        }
      }
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      Alert.alert('Error', 'Hubo un error al actualizar el nombre');
    } finally {
      setLoadingOperation(false); // Detener animación de carga
    }
  };
  return (
    <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.container}>
      <Image source={require('../assets/escudoBlanco.png')} style={styles.logo} />
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.userIconContainer}>
        <MaterialIcons name="person" size={65} color="#fff" />
        <Text style={styles.editText}>Editar</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Nombre Completo"
          style={styles.input}
          onChangeText={setNewName}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
          editable={isNameEditable}
        />
        <TouchableOpacity onPress={() => setIsNameEditable(true)}>
          <AntDesign name="form" size={24} color="#000000" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.changeButton} onPress={() => handleNameChange(newName)}>
        <Text style={styles.changeButtonText}>Cambiar nombre</Text>
        {loadingOperation && <ActivityIndicator size="small" color="#ffffff" />} 
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Contraseña Actual"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          editable={isPasswordEditable}
        />
        <TouchableOpacity onPress={() => setIsPasswordEditable(true)}>
          <AntDesign name="form" size={24} color="#000000" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.requestButtonText}>¿Recordar Contraseña?</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Nueva Contraseña"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
          value={newPassword}
          onChangeText={setNewPassword}
          editable={isPasswordEditable}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#000000" style={styles.icon} />
        <TextInput
          placeholder="Repetir Nueva Contraseña"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="rgba(0, 0, 0, 0.44)"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          editable={isPasswordEditable}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator size="large" color="#00ff00" /> : (
        <TouchableOpacity style={styles.acceptButton} onPress={handleUpdatePassword}>
          <Text style={styles.acceptButtonText}>Cambiar contraseña</Text>
        </TouchableOpacity>
      )}
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
  userIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  editText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 18,
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
  editIcon: {
    marginLeft: 'auto',
  },
  input: {
    flex: 1,
    color: 'rgba(0, 0, 0, 0.44)',
  },
  changeButton: {
    backgroundColor: '#04D44B',
    width: '90%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#04D44B',
    width: '90%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  }
});

export default Profile;
