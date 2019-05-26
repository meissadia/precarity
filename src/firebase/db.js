import { db } from './firebase';

/* Firebase Users Collection API */

export const doCreateUser = (id, email, extraState = {}) =>
  db.collection("users").doc(id).set({
    profile: {
      id,
      email,
      name: email,
    },
    ...extraState,
  });


export const doGetUser = id => db.collection("users").doc(id).get();

export const doCreateGame = args => (
  db.collection("games").add({
    players: args.players || [],
    double: false,
  })
)

