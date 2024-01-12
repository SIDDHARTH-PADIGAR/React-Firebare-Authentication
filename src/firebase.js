import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDrVIfvNw54qURCdSjuW8k9329-4Lnyyek",
  authDomain: "authentication-developem-37219.firebaseapp.com",
  projectId: "authentication-developem-37219",
  storageBucket: "authentication-developem-37219.appspot.com",
  messagingSenderId: "662661288736",
  appId: "1:662661288736:web:e9ef7ff84b3d5b60037d45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed up:", user);
    return user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
}

export { auth, signup };
export default app;
