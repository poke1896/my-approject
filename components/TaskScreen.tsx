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

export interface Task {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    state: 'complete' | 'incomplete';
}

type TaskScreenNavigationProp = {
    navigation: StackNavigationProp<MainStackParamList, 'Tasks'>;
};

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

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setCurrentUserUid(currentUser.uid);
        }
    }, []);

    const showDatePicker = useCallback(() => setDatePickerVisibility(true), []);
    const hideDatePicker = useCallback(() => setDatePickerVisibility(false), []);
    const handleConfirmDate = useCallback((date: Date) => {
        setSelectedDate(moment(date).format('DD/MM/YYYY'));
        hideDatePicker();
    }, [hideDatePicker]);

    const showTimePicker = useCallback(() => setTimePickerVisibility(true), []);
    const hideTimePicker = useCallback(() => setTimePickerVisibility(false), []);
    const handleConfirmTime = useCallback((time: Date) => {
        setSelectedTime(moment(time).format('HH:mm'));
        hideTimePicker();
    }, [hideTimePicker]);

    const addGroupTaskInput = () => setGroupTasks([...groupTasks, '']);

    const fetchUserDoc = useCallback(async () => {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('email', '==', auth.currentUser?.email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs[0];
    }, []);

    const handleCreateTask = async () => {
        if (!currentUserUid) {
            console.error("No se ha podido obtener el UID del usuario actual.");
            return;
        }

        try {
            const userDoc = await fetchUserDoc();
            if (userDoc) {
                const taskSubcollectionRef = collection(userDoc.ref, 'task');
                const taskDocRef = await addDoc(taskSubcollectionRef, {
                    title: taskTitle,
                    description: taskDescription,
                    date: selectedDate,
                    time: selectedTime,
                    state: 'incomplete',
                });

                // Reset fields
                setTaskTitle('');
                setTaskDescription('');
                setSelectedDate('');
                setSelectedTime('');
                setModalVisible(false);
                fetchTasks();
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    };

    const fetchTasks = useCallback(async () => {
        try {
            const userDoc = await fetchUserDoc();
            if (userDoc) {
                const taskSubcollectionRef = collection(userDoc.ref, 'task');
                const taskQuerySnapshot = await getDocs(taskSubcollectionRef);
                const tasksData = taskQuerySnapshot.docs.map(taskDoc => ({
                    id: taskDoc.id,
                    ...taskDoc.data(),
                })) as Task[];
                setTasks(tasksData);
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
        }
    }, [fetchUserDoc]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleToggleTask = async (index: number) => {
        setLoading(true);
        setLoadingTaskIndex(index);

        try {
            const updatedTasks = [...tasks];
            const currentTask = updatedTasks[index];
            const updatedState = currentTask.state === 'complete' ? 'incomplete' : 'complete';
            updatedTasks[index] = { ...currentTask, state: updatedState };
            setTasks(updatedTasks);

            const userDoc = await fetchUserDoc();
            if (userDoc) {
                const taskSubcollectionRef = collection(userDoc.ref, 'task');
                const taskDocRef = doc(taskSubcollectionRef, tasks[index].id);

                await updateDoc(taskDocRef, { state: updatedState });
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);

            const revertedTasks = [...tasks];
            revertedTasks[index] = { ...tasks[index], state: tasks[index].state === 'complete' ? 'incomplete' : 'complete' };
            setTasks(revertedTasks);
        } finally {
            setLoading(false);
            setLoadingTaskIndex(null);
        }
    };

    const handleTaskDetails = (index: number) => {
        navigation.navigate('TaskDetails', { task: tasks[index] });
    };

    const handleSearch = (text: string) => {
        setSearchTerm(text);
    };

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