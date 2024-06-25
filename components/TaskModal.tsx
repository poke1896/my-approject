import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from './styles'; 
interface TaskModalProps {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  taskTitle: string;
  setTaskTitle: (title: string) => void;
  taskDescription: string;
  setTaskDescription: (description: string) => void;
  selectedDate: string;
  showDatePicker: () => void;
  handleConfirmDate: (date: Date) => void;
  isDatePickerVisible: boolean;
  hideDatePicker: () => void;
  selectedTime: string;
  showTimePicker: () => void;
  handleConfirmTime: (time: Date) => void;
  isTimePickerVisible: boolean;
  hideTimePicker: () => void;
  handleCreateTask: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isModalVisible,
  setModalVisible,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  selectedDate,
  showDatePicker,
  handleConfirmDate,
  isDatePickerVisible,
  hideDatePicker,
  selectedTime,
  showTimePicker,
  handleConfirmTime,
  isTimePickerVisible,
  hideTimePicker,
  handleCreateTask
}) => {
  const taskInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  return (
    isModalVisible && (
      <View style={styles.modalContainerTask}>
        <View style={styles.modalTask}>
          <Text style={styles.modalTitleTask}>Nueva Tarea</Text>
          <View style={styles.modalRowTask}>
            <View style={styles.modalItemTask}>
              <TouchableOpacity style={styles.modalButton2Task} onPress={showDatePicker}>
                <Icon name="calendar" size={20} color="#00C0F3" />
                <Text style={styles.modalButtonTextTask}>{selectedDate || 'Fecha'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalItemTask}>
              <TouchableOpacity style={styles.modalButton2Task} onPress={showTimePicker}>
                <Icon name="clock-o" size={20} color="#00C0F3" />
                <Text style={styles.modalButtonTextTask}>{selectedTime || 'Hora'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
          />

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
          />

          <TouchableOpacity style={styles.inputContainerTask} onPress={() => taskInputRef.current?.focus()}>
            <Icon name="check-square-o" size={20} style={styles.modalIconTask} />
            <TextInput
              ref={taskInputRef}
              style={styles.inputTask}
              placeholder="Tarea"
              placeholderTextColor="#00C0F3"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputContainer2Task} onPress={() => descriptionInputRef.current?.focus()}>
            <Icon name="align-left" size={20} style={styles.modalIconTask} />
            <TextInput
              ref={descriptionInputRef}
              style={styles.inputMultilineTask}
              placeholder="Descripción"
              placeholderTextColor="#00C0F3"
              multiline={true}
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
          </TouchableOpacity>

          <View style={styles.modalRowTask}>
            <TouchableOpacity style={[styles.modalButtonTask, { backgroundColor: '#fff', borderColor: '#00C0F3' }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonTextTask, { color: '#00C0F3' }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateTask} style={[styles.modalButtonTask, { backgroundColor: '#00C0F3' }]}>
              <Text style={[styles.modalButtonTextTask, { color: '#fff' }]}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
};

export default TaskModal;
