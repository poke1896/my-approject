import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { fetchGroups, deleteGroupById  } from '../firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import Icon from 'react-native-vector-icons/FontAwesome';

const GroupCarousel = () => {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    fetchGroups()
      .then((groupData) => {
        setGroups(groupData);
      })
      .catch((error) => {
        console.error('Error al obtener datos de grupos:', error);
      });
  }, []);


  const handleRemoveGroup = async (groupId: string, groupName: string) => {
    // Mostrar alerta para confirmar la eliminación
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el grupo "${groupName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              // Llamar a la función para eliminar el grupo por su ID de documento
              await deleteGroupById(groupId);

              // Actualizar el estado local eliminando el grupo
              const updatedGroups = groups.filter(group => group.id !== groupId);
              setGroups(updatedGroups);
            } catch (error) {
              console.error('Error al eliminar el grupo:', error);
              Alert.alert('Error', 'No se pudo eliminar el grupo.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };


  const renderOtherEmailsIcons = (otherEmails: string[]) => (
    <View style={styles.emailsContainer}>
      {otherEmails.map((email, index) => (
        <TouchableOpacity key={index} onPress={() => alert(email)}>
          <Icon name="user-circle" size={24} color="#000000" style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        {groups.map((group, index) => (
          <View key={index} style={styles.groupBox}>
             <TouchableOpacity style={styles.closeButton} onPress={() => handleRemoveGroup(group.id, group.title)}>
              <Icon name="times" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.taskTitle}>{group.title}</Text>
              {group.tasks.length > 0 && (
                <Text style={styles.taskDate}>{group.tasks[0].date} - {group.tasks[0].time}</Text>
              )}
            </View>
            {renderOtherEmailsIcons(group.otherEmails)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  groupBox: {
    width: 218,
    height: 106,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 14 ,
  },

  
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  taskDate: {
    
    marginHorizontal: 14 ,
  },

  emailsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 14 ,
  },
  icon: {
    marginRight: 5,
  },
});

export default GroupCarousel;
