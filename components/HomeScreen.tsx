import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import GroupCarousel from './GroupCarousel';

const HomeScreen: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    setCurrentUser(currentUser);
                    const usersCollectionRef = collection(db, 'users');
                    const q = query(usersCollectionRef, where('email', '==', currentUser.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setCurrentUser(userData);
                    } else {
                        console.error('No se encontró ningún documento con el correo electrónico del usuario.');
                    }
                } else {
                    console.error('No se ha encontrado un usuario autenticado.');
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        fetchUserData();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('email', '==', auth.currentUser?.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const allTasks: any[] = [];
                for (const userDoc of querySnapshot.docs) {
                    const taskSubcollectionRef = collection(userDoc.ref, 'task');
                    const taskQuerySnapshot = await getDocs(taskSubcollectionRef);
                    const tasksData = taskQuerySnapshot.docs.map(taskDoc => taskDoc.data());
                    allTasks.push(...tasksData);
                }
                setTasks(allTasks);
            } else {
                console.error('No se encontraron documentos con el correo electrónico coincidente.');
            }
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    const incompleteTasks = tasks.filter(task => task.state === "incomplete");
    const completedTasks = tasks.filter(task => task.state === "complete");

    return (
        <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.containerHome}>
            <Spinner visible={loading} textContent={'Cargando...'} textStyle={{ color: '#FFF' }} />

            <View style={styles.headerHome}>
                <Icon name="user-circle" size={32} color="#fff" style={styles.userIconHome} />
                <View style={styles.userInfoHome}>
                    <Text style={styles.userNameHome}>{currentUser?.name}</Text>
                    <Text style={styles.userEmailHome}>{currentUser?.email}</Text>
                </View>
                <Icon name="bell" size={32} color="#fff" style={styles.notificationIconHome} />
            </View>

            <Text style={styles.sectionTitleHome}>Tareas Incompletas</Text>
            <ScrollView style={styles.contentHome}>
                {incompleteTasks.map((task, index) => (
                    <View key={index} style={styles.taskContainer}>
                        <View style={styles.taskItemContainer}>
                            <View style={styles.taskContent}>
                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskDateTime}>{task.date}-{task.time}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.taskDetailsButton}>
                                <Icon name="chevron-right" size={24} color="#0EA5E9" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitleHome}>Completadas</Text>
            <ScrollView style={styles.contentHome}>
                {completedTasks.map((task, index) => (
                    <View key={index} style={styles.taskContainer}>
                        <View style={styles.taskItemContainer}>
                            <View style={styles.taskContent}>
                                <View style={styles.taskInfo}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskDateTime}>{task.date}-{task.time}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.taskDetailsButton}>
                                <Icon name="chevron-right" size={24} color="#0EA5E9" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitleHome}>Grupo de Tareas</Text>
            <ScrollView style={styles.contentHome} >
                <GroupCarousel />
            </ScrollView>
        </LinearGradient>
    );
};

export default HomeScreen;
