import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';
import { Task } from './TaskScreen';
import { stylesModal } from './stylesmodal';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

interface GroupModalProps {
  isGroupModalVisible: boolean;
  setGroupModalVisible: (visible: boolean) => void;
  groupTasks: string[];
  addGroupTaskInput: () => void;
  tasks: Task[];
}

const GroupModal: React.FC<GroupModalProps> = ({
  isGroupModalVisible,
  setGroupModalVisible,
  groupTasks,

  tasks
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [emailInputs, setEmailInputs] = useState<string[]>([...groupTasks]);
  const [userList, setUserList] = useState<{ name: string; email: string }[]>([]);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => doc.data() as { name: string; email: string });
        setUserList(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const addGroupTaskInput = () => {
    setEmailInputs(groupTasks => [...groupTasks, '']);
  };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    toggleDropdown();
  };

  const saveGroupDataToFirebase = async () => {
    try {
      if (!selectedTask) {
        throw new Error('No se ha seleccionado ninguna tarea.');
      }

      const userEmail = auth.currentUser?.email;
      const lowerCaseEmailInputs = emailInputs.map(email => email.toLowerCase());

      // Validar que todos los correos electrónicos ingresados están en la lista de usuarios
      for (const email of lowerCaseEmailInputs) {
        if (!userList.some(user => user.email.toLowerCase() === email)) {
          throw new Error(`El correo ${email} no pertenece a un usuario registrado.`);
        }
      }

      const groupData = {
        title: selectedTask.title,
        userData: {
          userEmail: userEmail
        },
        otherEmails: lowerCaseEmailInputs,
        tasks: [{
          date: selectedTask.date,
          time: selectedTask.time,
          description: selectedTask.description,
          id: selectedTask.id,
          state: selectedTask.state
        }]
      };

      await addDoc(collection(db, 'group'), groupData);
      console.log('Datos del grupo guardados en Firebase');
      setGroupModalVisible(false);
      Alert.alert('Éxito', 'El grupo se creó exitosamente');
    } catch (error) {
      console.error('Error al guardar datos del grupo:', error);

    }
  };

  const removeEmailInput = (indexToRemove: number) => {
    setEmailInputs(emailInputs.filter((_, index) => index !== indexToRemove));
  };

  const handleEmailInputChange = (value: string, index: number) => {
    const updatedEmails = [...emailInputs];
    updatedEmails[index] = value;

    // Filtrar usuarios que coincidan con el valor ingresado
    const matchedUsers = userList.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );

    // Obtener solo los correos únicos basados en las sugerencias
    const uniqueSuggestions = Array.from(new Set(matchedUsers.map(user => user.email)));

    // Mostrar solo las primeras 5 sugerencias
    const suggestions = uniqueSuggestions.slice(0, 5);

    // Actualizar el estado para mostrar las sugerencias
    setEmailSuggestions(suggestions);
    setEmailInputs(updatedEmails);
  };

  const selectSuggestion = (suggestion: string, index: number) => {
    const updatedEmails = [...emailInputs];
    updatedEmails[index] = suggestion;
    setEmailSuggestions([]); // Limpiar sugerencias después de seleccionar
    setEmailInputs(updatedEmails);
  };


  return (
    isGroupModalVisible && (
      <View style={styles.modalContainerTask}>
        <View style={styles.modalTask}>
          <Text style={styles.modalTitleTask}>Nuevo Grupo</Text>
          <View style={styles.modalRowTask}>
            <View style={styles.modalItemTask}>
              <TouchableOpacity onPress={toggleDropdown}>
                <View style={styles.groupInputContainerTask}>
                  <Icon name="th-list" size={20} color="#00C0F3" />
                  <Text style={styles.modalButtonTextTask}>{selectedTask ? selectedTask.title : 'Tarea'}</Text>
                  <Icon name="angle-down" size={20} color="#00C0F3" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={isDropdownVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleDropdown}
          >
            <View style={[stylesModal.modalDropdown, { top: 378, left: 10 }]}>
              <ScrollView>
                {tasks.map(task => (
                  <TouchableOpacity key={task.id} style={stylesModal.dropdownItem} onPress={() => selectTask(task)}>
                    <Text style={stylesModal.dropdownItemText}>{task.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>


          <ScrollView style={{ maxHeight: 200 }}>
            {emailInputs.map((email, index) => (
              <View key={index} style={styles.groupTaskInputContainerTask}>
                <Icon name="envelope" size={20} color="#00C0F3" />
                <TextInput
                  style={styles.groupTaskInputTask}
                  placeholder="Correo"
                  placeholderTextColor="#00C0F3"
                  value={email}
                  onChangeText={(value) => handleEmailInputChange(value, index)}
                />
                <TouchableOpacity onPress={() => removeEmailInput(index)}>
                  <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
       
          <FlatList
            data={emailSuggestions}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => selectSuggestion(item, index)}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
          />

          <TouchableOpacity style={styles.addGroupTaskButtonTask} onPress={addGroupTaskInput}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.modalRowTask}>
            <TouchableOpacity style={[styles.modalButtonTask, { backgroundColor: '#fff', borderColor: '#00C0F3' }]} onPress={() => setGroupModalVisible(false)}>
              <Text style={[styles.modalButtonTextTask, { color: '#00C0F3' }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButtonTask, { backgroundColor: '#00C0F3' }]} onPress={saveGroupDataToFirebase}>
              <Text style={[styles.modalButtonTextTask, { color: '#fff' }]}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
};

export default GroupModal;
