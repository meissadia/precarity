import { auth } from './firebase';

// Sign Up with Email
export const createEmailUser = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In with Email
export const signinEmailUser = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);
