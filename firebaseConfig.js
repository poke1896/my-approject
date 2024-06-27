// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , onAuthStateChanged } from 'firebase/auth';
import { getFirestore, getDocs, collection, updateDoc, deleteDoc, doc, query, where,getDoc} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX0BTO0RP6vWtZD01T0qY7i7FEbi2C8aU",
  authDomain: "planificador-ucr.firebaseapp.com",
  projectId: "planificador-ucr",
  storageBucket: "planificador-ucr.appspot.com",
  messagingSenderId: "922473695678",
  appId: "1:922473695678:web:f493f0c35888776ca1d1ef",
  measurementId: "G-ZG12B5BH6L"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUserEmail = '';

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
  } else {
    currentUserEmail = '';
  }
});


export const fetchGroups = async () => {
  try {
    // Construir la consulta para obtener los grupos filtrados
    const q1 = query(collection(db, 'group'), where('userData.userEmail', '==', currentUserEmail));
    const q2 = query(collection(db, 'group'), where('otherEmails', 'array-contains', currentUserEmail));
    
    // Ejecutar ambas consultas y combinar los resultados
    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);
    

    // Combinar los resultados de ambas consultas
    const groupData1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const groupData2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));


    // Unificar los resultados y eliminar duplicados
    const groupData = [...groupData1, ...groupData2];
    const uniqueGroups = groupData.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return uniqueGroups; // Devuelve los datos de los grupos con sus IDs
  } catch (error) {
    console.error('Error al obtener datos de Firebase:', error);
    throw error; // Lanza el error para que pueda ser manejado externamente
  }
};

export const fetchGroupsOther = async () => {
  try {
    // Construir la consulta para obtener los grupos filtrados
    const q2 = query(collection(db, 'group'), where('otherEmails', 'array-contains', currentUserEmail));
    
    // Ejecutar ambas consultas y combinar los resultados
    const [querySnapshot2] = await Promise.all([
      getDocs(q2),
    ]);
    // Combinar los resultados de ambas consultas
    const groupData2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Unificar los resultados y eliminar duplicados
    const groupData = [ ...groupData2];
    const otherGroups = groupData.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return otherGroups; // Devuelve los datos de los grupos con sus IDs
  } catch (error) {
    console.error('Error al obtener datos de Firebase:', error);
    throw error; // Lanza el error para que pueda ser manejado externamente
  }
};
// Función para eliminar un grupo por su ID de documento
export const deleteGroupById = async (groupId) => {
  try {
    const groupDocRef = doc(db, 'group', groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (!groupDocSnapshot.exists()) {
      console.error(`El grupo con ID ${groupId} no existe.`);
      return;
    }

    const groupData = groupDocSnapshot.data();

    // Verificar si currentUserEmail está en userData.userEmail
    if (groupData.userData && groupData.userData.userEmail === currentUserEmail) {
      await deleteDoc(groupDocRef);
      console.log(`Grupo con ID ${groupId} eliminado correctamente.`);
      return;
    }

    // Si no está en userData.userEmail, revisar en otherEmails
    if (groupData.otherEmails && groupData.otherEmails.includes(currentUserEmail)) {
      const updatedOtherEmails = groupData.otherEmails.filter(email => email !== currentUserEmail);
      await updateDoc(groupDocRef, { otherEmails: updatedOtherEmails });
      console.log(`Correo ${currentUserEmail} eliminado del grupo con ID ${groupId}.`);
      return;
    }

    console.error(`El usuario ${currentUserEmail} no tiene permiso para eliminar este grupo.`);
  } catch (error) {
    console.error('Error al eliminar el grupo:', error);
    throw error;
  }
};

export { auth, db };
