import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ActivityIndicator  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles'; 
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where,doc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

interface Task {
  id: string;
  date: string; // Formato: 'YYYY-MM-DD'
  title: string;

}

const CalendarScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); // Estado para almacenar las tareas
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [shouldRenderCalendar, setShouldRenderCalendar] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
 

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
                const tasksData = taskQuerySnapshot.docs.map(taskDoc => ({
                  ...taskDoc.data(),
                  id: taskDoc.id // Añadido aquí
                }));
                
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

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = (month: number, year: number, tasks: Task[]) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysWithTasks: { [date: string]: number } = {};
  
    tasks.forEach(task => {
      const taskDate = new Date(`${task.date.split('/')[2]}-${task.date.split('/')[1]}-${task.date.split('/')[0]}`);
      const taskDay = taskDate.getDate();
      const taskMonth = taskDate.getMonth();
      const taskYear = taskDate.getFullYear();

  

      const key = `${taskYear}-${taskMonth + 1}-${taskDay + 1}`;
      daysWithTasks[key] = (daysWithTasks[key] || 0) + 1;
    });
  
    const days = [];
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < offset; i++) {
      days.push({ day: null, hasTasks: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const key = `${year}-${month + 1}-${i}`;
      days.push({ day: i, hasTasks: !!daysWithTasks[key] });
    }
    while (days.length % 7 !== 0) {
      days.push({ day: null, hasTasks: false });
    }
    return days;
  };

const handlePreviousMonth = () => {
  setCurrentDate((prevDate) => {
    const prevMonth = prevDate.getMonth() - 1;
    if (prevMonth < 0) {
      return new Date(prevDate.getFullYear() - 1, 11);
    } else {
      return new Date(prevDate.getFullYear(), prevMonth);
    }
  });
  setSelectedDay(null); 
  setShouldRenderCalendar(true); 
};

const handleNextMonth = () => {
  setCurrentDate((prevDate) => {
    const nextMonth = prevDate.getMonth() + 1;
    if (nextMonth > 11) {
      return new Date(prevDate.getFullYear() + 1, 0);
    } else {
      return new Date(prevDate.getFullYear(), nextMonth);
    }
  });
  setSelectedDay(null); 
  setShouldRenderCalendar(true); 
};



  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const calendarDays = generateCalendarDays(currentMonth, currentYear, tasks);



  const handleDayPress = (day: number | null) => {
    if (day !== null) {
      const selectedDate = new Date(currentYear, currentMonth, day);
      const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      const taskForSelectedDay = tasks.find(task => task.date === formattedDate);
      setSelectedTask(taskForSelectedDay || null);
      setSelectedDay(day);
    }
  };

  return (
    <LinearGradient colors={['#00C0F3', '#005DA4']} style={styles.containerCalendar}>
      <Text style={styles.titleCalendar}>Calendario</Text>

      {shouldRenderCalendar && (
      <View style={styles.calendarContainerCalendar}>
        <View style={styles.calendarHeaderCalendar}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButtonCalendar}>
            <Icon name="angle-left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.monthCalendar}>{`${months[currentMonth]} ${currentYear}`}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButtonCalendar}>
            <Icon name="angle-right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>    
        <View style={styles.weekDaysCalendar}>
          <Text style={styles.weekDayCalendar}>Lun</Text>
          <Text style={styles.weekDayCalendar}>Mar</Text>
          <Text style={styles.weekDayCalendar}>Mié</Text>
          <Text style={styles.weekDayCalendar}>Jue</Text>
          <Text style={styles.weekDayCalendar}>Vie</Text>
          <Text style={styles.weekDayCalendar}>Sáb</Text>
          <Text style={styles.weekDayCalendar}>Dom</Text>
        </View>

        <View style={styles.daysContainerCalendar}>
          {calendarDays.map((dayInfo, index) => (
            <TouchableOpacity key={index.toString()} onPress={() => handleDayPress(dayInfo.day)} style={styles.dayWrapperCalendar}>
              {dayInfo.day !== null ? (
                <View style={[
                  styles.dayCircleCalendar,
                  dayInfo.hasTasks && styles.hasTasksCircle 
                ]}>
                  <Text style={[
                    styles.dayNumberCalendar,
                    selectedDay === dayInfo.day && styles.selectedDayNumberCalendar
                  ]}>
                    {dayInfo.day}
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyDayCalendar}></View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
         )}

<View style={styles.taskContainerCalendar}>
  <Text style={styles.taskTextCalendar}>
    Tareas del {selectedDay ? `${selectedDay} de ${months[currentMonth]} ${currentYear}` : `${currentDate.getDate()} de ${months[currentMonth]} ${currentYear}`}
  </Text>
  <View style={styles.infoButtonContainerCalendar}>
    <View style={styles.infoBoxCalendar}>
      {selectedTask ? (
        <Text>{selectedTask.title}</Text>
      ) : (
        <Text>No hay tareas seleccionadas</Text>
      )}
    </View>
    <TouchableOpacity style={styles.accessButtonCalendar}>
      <Text style={styles.accessButtonTextCalendar}>Acceder</Text>
    </TouchableOpacity>
  </View>
</View>
{loading && <ActivityIndicator size="large" color="#ffffff" />}
    </LinearGradient>
  );
};

export default CalendarScreen;
