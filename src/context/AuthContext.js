import React, { useContext, useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    try {
      const authInstance = getAuth();
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Set user display name (optional)
      await updateProfile(user, { displayName: email });

      return user;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const sendPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateEmail = async (email) => {
    try {
      if (currentUser.email === email || !currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        await updateProfile(currentUser, { email });
      } else {
        throw new Error('Email not verified. Please verify your email address.');
      }
    } catch (error) {
      console.error('Error updating email:', error.message);
      throw error;
    }
  };

  const updatePassword = async (password) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { password });
      } else {
        throw new Error('User not signed in.');
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    sendPasswordReset,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
