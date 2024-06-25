import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainNavigator';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

type TaskDetailsScreenRouteProp = RouteProp<MainStackParamList, 'TaskDetails'>;

const TaskDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TaskDetailsScreenRouteProp>();
  const { task } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const fetchUserDoc = async () => {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', auth.currentUser?.email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  };

  const handleDeleteTask = async () => {
    try {
      const userDoc = await fetchUserDoc();
      if (userDoc) {
        const taskDocRef = doc(userDoc.ref, 'task', task.id);
        await deleteDoc(taskDocRef);
        Alert.alert('Tarea eliminada', 'La tarea ha sido eliminada exitosamente.');
        navigation.goBack();
      } else {
        console.error('No se encontraron documentos con el correo electrónico coincidente.');
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      Alert.alert('Error', 'Hubo un problema al eliminar la tarea.');
    }
  };

  const handleEditTask = async () => {
    try {
      const userDoc = await fetchUserDoc();
      if (userDoc) {
        const taskDocRef = doc(userDoc.ref, 'task', task.id);
        await updateDoc(taskDocRef, {
          title: editedTitle,
          description: editedDescription,
        });
        Alert.alert('Tarea actualizada', 'La tarea ha sido actualizada exitosamente.');
        setIsEditing(false);
      } else {
        console.error('No se encontraron documentos con el correo electrónico coincidente.');
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      Alert.alert('Error', 'Hubo un problema al actualizar la tarea.');
    }
  };

  return (
    <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.containerTask}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Tarea</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Descripción de Tarea</Text>

      <View style={styles.taskTitleContainer}>
        {isEditing ? (
          <TextInput
            style={styles.taskTitle}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Título de la tarea"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        ) : (
          <Text style={styles.taskTitle}>{task.title}</Text>
        )}
      </View>

      <View style={styles.taskInfoContainer}>
        {isEditing ? (
          <TextInput
            style={styles.taskDescription}
            value={editedDescription}
            onChangeText={setEditedDescription}
            placeholder="Descripción de la tarea"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            multiline
          />
        ) : (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}
      </View>

      <View>
        <Text style={styles.taskDateTime}>{task.date} --- {task.time}</Text>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleDeleteTask}>
          <Icon name="trash" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Icon name="pencil" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity onPress={handleEditTask}>
            <Icon name="save" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerTask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 60, 
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 80,
  },
  taskInfoContainer: {
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 20,
    marginTop: 40,
  },
  taskTitleContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 30,
  },
  taskDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 30,
  },
  taskDateTime: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});

export default TaskDetailsScreen;
