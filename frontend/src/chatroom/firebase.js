// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkkJo0ocStvwXAXprbmSIKco4-Oipbww4",
  authDomain: "se-2023-carpoolchatroom.firebaseapp.com",
  databaseURL: "https://se-2023-carpoolchatroom-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "se-2023-carpoolchatroom",
  storageBucket: "se-2023-carpoolchatroom.appspot.com",
  messagingSenderId: "375653425149",
  appId: "1:375653425149:web:b458a2b214bd13e9478394",
  measurementId: "G-H5CBS9S86X"
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)