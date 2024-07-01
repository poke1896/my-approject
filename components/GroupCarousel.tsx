import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { fetchGroups, deleteGroupById } from '../firebaseConfig';
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
              await deleteGroupById(groupId);
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

  const fetchProfileImage = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      return data.results[0].picture.thumbnail;
    } catch (error) {
      console.error('Error fetching profile image:', error);
      return null;
    }
  };

  const renderOtherEmailsIcons = (otherEmails: string[]) => (
    <View style={styles.emailsContainer}>
      {otherEmails.map((email, index) => (
        <TouchableOpacity key={index} onPress={() => alert(email)}>
          <ProfileImage />
        </TouchableOpacity>
      ))}
    </View>
  );

  const ProfileImage = () => {
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const fetchImage = async () => {
        const imageUrl = await fetchProfileImage();
        setProfileImageUrl(imageUrl);
      };

      fetchImage();
    }, []);

    return profileImageUrl ? (
      <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
    ) : (
      <Icon name="user-circle" size={24} color="#000000" style={styles.icon} />
    );
  };

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
    marginHorizontal: 14,
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
    marginHorizontal: 14,
  },
  emailsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 14,
  },
  icon: {
    marginRight: 5,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
  },
});

export default GroupCarousel;
