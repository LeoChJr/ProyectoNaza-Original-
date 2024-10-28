// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC13egxtMiC_611gyNexGAMScfc9YvX9Ow",
  authDomain: "proyecto-905c6.firebaseapp.com",
  projectId: "proyecto-905c6",
  storageBucket: "proyecto-905c6.appspot.com",
  messagingSenderId: "767681703235",
  appId: "1:767681703235:web:a9ee230dfba936efe9d3f6",
  measurementId: "G-Y1EKJ3JN4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export {app, auth, db};