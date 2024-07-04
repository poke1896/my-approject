import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { styles } from './styles';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import TaskModal from './TaskModal';
import GroupModal from './GroupModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/MainNavigator';
import GroupCarousel from './GroupCarousel';

// Define la interfaz para las tareas
export interface Task {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    state: 'complete' | 'incomplete';
}

// Define las propiedades de navegación para la pantalla de tareas
type TaskScreenNavigationProp = {
    navigation: StackNavigationProp<MainStackParamList, 'Tasks'>;
};

// Componente principal de la pantalla de tareas
const TaskScreen: React.FC<TaskScreenNavigationProp> = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isGroupModalVisible, setGroupModalVisible] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [groupTasks, setGroupTasks] = useState<string[]>([]);
    const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingTaskIndex, setLoadingTaskIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); 

// Efecto para obtener las tareas al enfocar la pantalla
    useFocusEffect(
        useCallback(() => {
            fetchTasks(); // Llama a la función para obtener las tareas
        }, [])
    );

    // Efecto para obtener el UID del usuario actual
    useEffect(() => {
        const currentUser = auth.currentUser; // Obtiene el usuario actual
        if (currentUser) {
            setCurrentUserUid(currentUser.uid);// Establece el UID del usuario actual
        }
    }, []);

    // Funciones para controlar la visibilidad del selector de fecha
    const showDatePicker = useCallback(() => setDatePickerVisibility(true), []);
    const hideDatePicker = useCallback(() => setDatePickerVisibility(false), []);

    // Maneja la confirmación de la fecha seleccionada
    const handleConfirmDate = useCallback((date: Date) => {
        setSelectedDate(moment(date).format('DD/MM/YYYY')); // Formatea y establece la fecha seleccionada
        hideDatePicker(); // Oculta el selector de fecha
    }, [hideDatePicker]);

      // Funciones para controlar la visibilidad del selector de hora
    const showTimePicker = useCallback(() => setTimePickerVisibility(true), []);
    const hideTimePicker = useCallback(() => setTimePickerVisibility(false), []);

     // Maneja la confirmación de la hora seleccionada
    const handleConfirmTime = useCallback((time: Date) => {
        setSelectedTime(moment(time).format('HH:mm'));// Formatea y establece la hora seleccionada
        hideTimePicker();
    }, [hideTimePicker]);

     // Agrega un campo de entrada para tareas de grupo
    const addGroupTaskInput = () => setGroupTasks([...groupTasks, '']);

    // Obtiene el documento del usuario actual en la base de datos
    const fetchUserDoc = useCallback(async () => {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('email', '==', auth.currentUser?.email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs[0];
    }, []);

    // Maneja la creación de una nueva tarea
    const handleCreateTask = async () => {
        if (!currentUserUid) {
            console.error("No se ha podido obtener el UID del usuario actual.");
            return;
        }

        try {
            const userDoc = await fetchUserDoc(); // Obtiene el documento del usuario
            if (userDoc) {
                const taskSubcollectionRef = collection(userDoc.ref, 'task'); // Referencia a la subcolección de tareas
                const taskDocRef = await addDoc(taskSubcollectionRef, {
                    title: taskTitle,
                    description: taskDescription,
                    date: selectedDate,
                    time: selectedTime,
                    state: 'incomplete',
                });

                // Resetea los campos del formulario
                setTaskTitle('');
                setTaskDescription('');
                setSelectedDate('');
                setSelectedTime('');
                setModalVisible(false);// Oculta el modal de creación de tarea
                fetchTasks();// Vuelve a obtener las tareas
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    };

    // Obtiene las tareas del usuario actual
    const fetchTasks = useCallback(async () => {
        try {
            const userDoc = await fetchUserDoc();// Obtiene el documento del usuario
            if (userDoc) {
                const taskSubcollectionRef = collection(userDoc.ref, 'task');
                const taskQuerySnapshot = await getDocs(taskSubcollectionRef);
                const tasksData = taskQuerySnapshot.docs.map(taskDoc => ({
                    id: taskDoc.id,
                    ...taskDoc.data(),
                })) as Task[];
                setTasks(tasksData);// Establece las tareas en el estado
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
        }
    }, [fetchUserDoc]);
    // Obtiene las tareas al montar el componente
    useEffect(() => {
        fetchTasks();// Llama a la función para obtener las tareas
    }, [fetchTasks]);

    // Maneja el cambio de estado de una tarea (completa/incompleta)
    const handleToggleTask = async (index: number) => {
        setLoading(true);// Muestra el indicador de carga
        setLoadingTaskIndex(index);// Establece el índice de la tarea en carga

        try {
            const updatedTasks = [...tasks]; // Crea una copia de las tareas
            const currentTask = updatedTasks[index];// Obtiene la tarea actual
            const updatedState = currentTask.state === 'complete' ? 'incomplete' : 'complete';// Alterna el estado de la tarea
            updatedTasks[index] = { ...currentTask, state: updatedState };// Actualiza la tarea en la copia
            setTasks(updatedTasks);// Establece las tareas actualizadas en el estado

            const userDoc = await fetchUserDoc();// Obtiene el documento del usuario
            if (userDoc) {
                const taskSubcollectionRef = collection(userDoc.ref, 'task'); // Referencia a la subcolección de tareas
                const taskDocRef = doc(taskSubcollectionRef, tasks[index].id); // Referencia al documento de la tarea

                await updateDoc(taskDocRef, { state: updatedState });// Actualiza el estado de la tarea en la base de datos
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);

            const revertedTasks = [...tasks];// Crea una copia de las tareas para revertir cambios
            revertedTasks[index] = { ...tasks[index], state: tasks[index].state === 'complete' ? 'incomplete' : 'complete' };
            setTasks(revertedTasks);// Establece las tareas revertidas en el estado
        } finally {
            setLoading(false);// Oculta el indicador de carga
            setLoadingTaskIndex(null);
        }
    };

     // Navega a los detalles de la tarea
    const handleTaskDetails = (index: number) => {
        navigation.navigate('TaskDetails', { task: tasks[index] });
    };

     // Maneja la búsqueda de tareas
    const handleSearch = (text: string) => {
        setSearchTerm(text);
    };

    // Filtra las tareas según el término de búsqueda
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.containerTask}>
            <Spinner visible={loading} textContent={'Cargando...'} textStyle={{ color: '#FFF' }} />
            <View style={styles.searchContainerTask}>
                <Icon name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIconTask} />
                <TextInput
                    placeholder="Buscar por título de tarea"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    style={styles.searchInputTask}
                    onChangeText={handleSearch} // Actualiza el término de búsqueda
                />
            </View>

            <View style={styles.headerTask}>
                <Text style={styles.headerTextTask}>Lista de tareas</Text>
                <View style={styles.sortContainerTask}>
                    <Icon name="sort-amount-asc" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.sortIconTask} />
                    <Text style={styles.sortTextTask}>Ordenar:</Text>
                    <Icon name="angle-down" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.angleDownIconTask} />
                </View>
                <TouchableOpacity style={styles.addButtonTask} onPress={() => setModalVisible(true)}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.contentTask}>
                {filteredTasks.map((task, index) => (
                    <View key={task.id} style={styles.taskContainer}>
                        <View style={styles.taskItemContainer}>
                            <View style={styles.taskContent}>
                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskDateTime}>{task.date}-{task.time}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleTaskDetails(index)} style={styles.taskDetailsButton}>
                                <Icon name="chevron-right" size={24} color="#0EA5E9" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleToggleTask(index)} style={styles.taskCheckbox}>
                            {loading && loadingTaskIndex === index ? (
                                <ActivityIndicator size="large" color="#FFFFFF" />
                            ) : (
                                task.state === 'complete' ? (
                                    <Icon name="check-square" size={54} color="#FFFFFF" />
                                ) : (
                                    <Icon name="square" size={54} color="#FFFFFF" />
                                )
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footerTask}>
                <Text style={styles.footerTextTask}>Grupo de Tareas</Text>
                <TouchableOpacity style={styles.footerAddButtonTask} onPress={() => setGroupModalVisible(true)}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>


            </View>

            <ScrollView style={styles.contentHome2} >
                <GroupCarousel />
            </ScrollView>
            
            {isModalVisible && (
                <TaskModal
                    isModalVisible={isModalVisible}
                    setModalVisible={setModalVisible}
                    taskTitle={taskTitle}
                    setTaskTitle={setTaskTitle}
                    taskDescription={taskDescription}
                    setTaskDescription={setTaskDescription}
                    selectedDate={selectedDate}
                    showDatePicker={showDatePicker}
                    handleConfirmDate={handleConfirmDate}
                    isDatePickerVisible={isDatePickerVisible}
                    hideDatePicker={hideDatePicker}
                    selectedTime={selectedTime}
                    showTimePicker={showTimePicker}
                    handleConfirmTime={handleConfirmTime}
                    isTimePickerVisible={isTimePickerVisible}
                    hideTimePicker={hideTimePicker}
                    handleCreateTask={handleCreateTask}
                />
            )}

            {isGroupModalVisible && (
                <GroupModal
                    isGroupModalVisible={isGroupModalVisible}
                    setGroupModalVisible={setGroupModalVisible}
                    groupTasks={groupTasks}
                    addGroupTaskInput={addGroupTaskInput}
                    tasks={tasks}
                />
            )}
        </LinearGradient>
    );
};

export default TaskScreen;