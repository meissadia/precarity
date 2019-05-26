import { db } from './firebase';

// User API

export const doCreateUser = (id, email) =>
  db.collection("users").doc(id).set({
    id,
    email
  })

// db.ref(`users/${id}`).set({
//   email,
// });

// export const doCreateUser = (id, email) =>
//   db.ref(`users/${id}`).set({
//     email,
//   });

// export const onceGetUsers = () =>
//   db.ref('users').once('value');

// export const doUpdateUser = (id, state) =>
//   db.ref(`users/${id}`).update({
//     state,
//   });

export const doGetUser = (id) =>
  db.collection("users").doc(id).get()
  // db.ref(`users/${id}`).once('value');
