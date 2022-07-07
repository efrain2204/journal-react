import {initializeApp}  from "firebase/app";

import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_y4_jyYxBw4rJU5rEzwgbYuuOsCPsZ5U",
  authDomain: "journal-app-76966.firebaseapp.com",
  projectId: "journal-app-76966",
  storageBucket: "journal-app-76966.appspot.com",
  messagingSenderId: "561905784174",
  appId: "1:561905784174:web:2027276056e287efa79d7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export {
  auth,
  db,
  provider
}
