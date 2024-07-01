import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../components/HomeScreen';
import TaskScreen from '../components/TaskScreen';
import CalendarScreen from '../components/CalendarScreen';
import SettingsScreen from '../components/SettingsScreen';
import TaskDetailsScreen from '../components/TaskDetailsScreen'; 
import Profile from '../components/Perfile';

// Definir el tipo Task
interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  state: 'complete' | 'incomplete';
}

// Typado rutas del stack principal
export type MainStackParamList = {
  Home2: undefined;
  Tasks: undefined;
  Calendar: undefined;
  Settings: undefined;
  TaskDetails: { task: Task }; 
  Perfile: undefined;
  SettingsScreen: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<MainStackParamList>();

const TasksStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tasks" component={TaskScreen} />
    <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
  </Stack.Navigator>
);

const SettingsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Perfile" component={Profile} /> 
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#005DA4',
        borderTopWidth: 0,
      },
      tabBarItemStyle: {
        marginBottom: 10, 
        
      },
      tabBarInactiveTintColor: 'white',
      tabBarActiveTintColor: '#00C0F3',
    }}
  >
    <Tab.Screen
      name="Home  "
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tarea"
      component={TasksStackNavigator} 
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="format-list-checkbox" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Calendario"
      component={CalendarScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="calendar" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Ajustes"
      component={SettingsNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="cog" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainNavigator;
