import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  deleteUser as authDeleteUser,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { 
  getFirestore,
  collection, 
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPsUhrvZBUfmaWxYczHiqcAjZgXGAlQbM",
  authDomain: "sitioweb2024-c2912.firebaseapp.com",
  projectId: "sitioweb2024-c2912",
  storageBucket: "sitioweb2024-c2912.appspot.com",
  messagingSenderId: "271974207450",
  appId: "1:271974207450:web:c032e6f5063c0203d33ae3",
  measurementId: "G-TQ0ZB8QGVP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export const registerauth = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const verification = () =>
  sendEmailVerification(auth.currentUser);

export const loginauth = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleauth = (provider) =>
  signInWithPopup(auth, provider);

export const facebookauth = (provider) =>
  signInWithPopup(auth, provider);

export function userstate(){
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      window.location.href='../index.html';
    }
  });
}

export const recoverypass = (email) =>
  sendPasswordResetEmail(auth, email);

export const loginout = () =>
  signOut(auth);

export async function EliminarUsuario() {
  console.log('Función EliminarUsuario llamada');
  const user = auth.currentUser;
  try {
    await authDeleteUser(user);
    console.log('Usuario eliminado de la autenticación');
  } catch (error) {
    console.error('Error al eliminar el usuario de la autenticación', error);
    throw error;
  }
  
  try {
    const userSnapshot = await query(collection(db, "Usuarios"), where("email", "==", user.email)).get();
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      await deleteDoc(doc(db, 'Usuarios', userDoc.id));
      console.log('Usuario eliminado de Firestore');
    }
  } catch (error) {
    console.error('Error al eliminar el usuario de Firestore', error);
    throw error;
  }
}


export const setregister = (nombres, apellidos, fecha, cedula, estado, rh, genero, telefono, direccion, email, tipoCuenta) => 
  setDoc(doc(db, "Usuarios", cedula), {  
    nombres, 
    apellidos, 
    fecha, 
    cedula, 
    estado, 
    rh, 
    genero, 
    telefono, 
    direccion, 
    email, 
    tipoCuenta
  });

export const Getregister = (cedula) => 
  getDoc(doc(db, "Usuarios", cedula));

export const addregister = (nombres, apellidos, fecha, cedula, estado, rh, genero, telefono, direccion, email, tipoCuenta) =>
  addDoc(collection(db, "Usuarios"), {
    nombre: nombres,
    apellido: apellidos,
    fecha: fecha,
    cedula: cedula,
    estado: estado,
    rh: rh,
    genero: genero,
    telefono: telefono,
    direccion: direccion,
    email: email,
    tipoCuenta: tipoCuenta
  });

export const viewproducts = () =>
  getDocs(collection(db, "Usuarios"));

export async function eliminarUsuarios(docId) {
  if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
    try {
      await deleteDoc(doc(db, 'Usuarios', docId));
      console.log('Usuario eliminado de Firestore');
    } catch (error) {
      console.error('Error al eliminar el usuario de Firestore:', error);
      throw error;
    }
  }
}

export const logout = () =>
  signOut(auth);


export const deleteuser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) {
      await authDeleteUser(user);
      const userRef = doc(db, "Usuarios", user.uid);
      await deleteDoc(userRef);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function actualizarUsuario(cedula, data) {
  try {
      const userRef = doc(db, "Usuarios", cedula); 
      await updateDoc(userRef, data);
      console.log('Usuario actualizado correctamente');
  } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
  }
}
