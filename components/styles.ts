import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
 //-----------styles Home-------------------------------------------------------
    containerHome: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
      },
      headerHome: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
      },
      userIconHome: {
        marginRight: 10,
      },
      notificationIconHome: {
        marginLeft: 10,
      },
      userInfoHome: {
        flex: 1,
        alignItems: 'center',
      },
      userNameHome: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      userEmailHome: {
        color: '#fff',
        fontSize: 14,
      },
      contentHome: {
        flex: 1,
      },

      contentHome2: {
        flex: 1,
      },

      sectionTitleHome: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
        marginTop: 20,
      },

    //............styles__Task......................
    containerTask: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    searchContainerTask: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 45, 83, 0.8)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    searchIconTask: {
        marginRight: 10,
    },
    searchInputTask: {
        flex: 1,
        color: '#fff',
    },
    headerTask: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTextTask: {
        color: '#fff',
        fontSize: 18,
    },
    sortContainerTask: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 45, 83, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    sortIconTask: {
        marginRight: 5,
    },
    sortTextTask: {
        color: 'rgba(255, 255, 255, 0.6)',
        marginRight: 5,
    },
    angleDownIconTask: {
        marginLeft: 5,
    },
    addButtonTask: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#00C0F3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentTask: {
        flex: 1,
        marginBottom:10,
       
    },
    footerTask: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom:20,
    },
    footerTextTask: {
        color: '#fff',
        fontSize: 16,
    },
    footerAddButtonTask: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#00C0F3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainerTask: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalTask: {
        width: '100%',
        height: 494,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    modalTitleTask: {
        fontSize: 20,
        color: '#00C0F3',
        marginBottom: 30,
        marginTop: 10,
    },
    modalRowTask: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalItemTask: {
        flex: 1,
    },
    modalButtonTask: {
        width: 169,
        height: 42,
        backgroundColor: '#05243E',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    modalButton2Task: {
        width: 169,
        height: 42,
        backgroundColor: '#05243E',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    modalButtonTextTask: {
        color: '#00C0F3',
        marginLeft: 5,
    },
    inputContainerTask: {
        width: 358,
        height: 42,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    inputContainer2Task: {
        width: 358,
        height: 159,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    inputTask: {
        flex: 1,
        color: '#00C0F3',
        marginLeft: 10,
    },
    inputMultilineTask: {
        flex: 1,
        color: '#00C0F3',
        marginLeft: 10,
        textAlignVertical: 'top',
    },
    modalIconTask: {
        color: '#00C0F3',
    },
    groupInputContainerTask: {
        width: 157.29,
        height: 42,
        backgroundColor: '#05243E',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    addGroupTaskButtonTask: {
        width: 37,
        height: 37,
        backgroundColor: '#63D9F3',
        borderRadius: 18.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    groupTaskInputContainerTask: {
        width: 338,
        height: 42,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    groupTaskInputTask: {
        flex: 1,
        color: '#00C0F3',
        marginLeft: 10,
    },
    //-----------------------------------styles__Calendar------------------------------------------
    containerCalendar: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
      },
      titleCalendar: {
        fontSize: 32,
        color: '#ffffff',
        marginBottom: 40,
      },
      calendarContainerCalendar: {
        width: 350,
        height: 340,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
      },
      calendarHeaderCalendar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 40,
      },
      navButtonCalendar: {
        padding: 10,
      },
      monthCalendar: {
        color: '#ffffff',
        fontSize: 18,
      },
      weekDaysCalendar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      weekDayCalendar: {
        color: '#ffffff',
        fontSize: 16,
      },
      daysContainerCalendar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
        
      },
      dayWrapperCalendar: {
        width: '14%',
        alignItems: 'center',
        marginBottom: 10,
        
      },
      dayCircleCalendar: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 15, 
      },
      selectedDayCircleCalendar: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        
      },
      dayNumberCalendar: {
        color: '#ffffff',
        fontSize: 16,
      },
      selectedDayNumberCalendar: {
        color: '#ffffff',
      },
      emptyDayCalendar: {
        width: 30,
        height: 30,
        
      },
      taskContainerCalendar: {
        width: 300,
        height: 120,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      taskTextCalendar: {
        color: '#05243E',
        fontSize: 16,
        marginBottom: 20,
      },
      infoButtonContainerCalendar: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      infoBoxCalendar: {
        width: 180,
        height: 32,
        backgroundColor: '#05243E',
        borderRadius: 10,
        color: '#FFFFFF',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      infoTextCalendar: {
        
        color: '#FFFFFF',
        marginRight: 10,
       
      },
      accessButtonCalendar: {
        width: 80,
        height: 32,
        backgroundColor: '#0EA5E9',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      accessButtonTextCalendar: {
        color: '#ffffff',
        fontSize: 16,
      },  
      
      hasTasksCircle: {
        position: 'absolute',
        width: 30, // Ajusta el tamaño del círculo según sea necesario
        height: 30,
        borderRadius: 15, // Ajusta la mitad del valor de la altura para un círculo perfecto
        backgroundColor: '#17A1FA', // Color del círculo
        zIndex: 1, // Asegura que el círculo esté sobre los números de los días
      },
    
   //--------------------------styles_Settings--------------------------------------
   containerSettings: {
    flex: 1,
    alignItems: 'center',
  
  },
  titleSettings: {
    fontSize: 32,
    color: '#ffffff',
    marginTop:100,
    marginBottom: 100,
  },
  settingItemSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
  },
  settingTextSettings: {
    fontSize: 23,
    color: '#ffffff',
    marginLeft: 10,
  },
  flexRowSettings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerSettings: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 25,
    marginTop: 25,
  },
  logoutButtonSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 226,
    height: 42,
    borderRadius: 20,
    marginTop:30,
    backgroundColor: '#ffffff',
  },
  logoutButtonTextSettings: {
    fontSize: 18,
    color: '#DC4343',
    marginLeft: 10,
  },
//------------------------
taskItemContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 276,
  height: 60,
  marginBottom: 10,
  borderRadius: 30,
  backgroundColor:'#ffffff',
},
taskContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

},
taskContent: {
  marginLeft:10,
  flexDirection: 'row',
  alignItems: 'center',
  color:'FFFFFF',
},
taskInfo: {
  marginLeft: 10,
},
taskTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
taskDescription: {
  fontSize: 16,
},
taskDateTime: {
  fontSize: 14,
  color: 'gray',
},
taskCheckbox: {

  justifyContent: 'center',
  alignItems: 'center',

  

},
taskDetailsButton: {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
},
});
