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

export const doCreateGame = args => {
  const name = args.name || randomName();

  return (
    db.collection('games').doc(name).get().then(snap => {
      if (snap.exists) return { success: false, error: 'Name already taken!' }
      db.collection("games").doc(name).set({
        name,
        players: args.players || [],
        double: false,
      })

      return { success: true, id: name };
    })
  )
};

const randomName = () => {
  const rand = array => array[Math.floor(Math.random() * array.length)];
  const names = 'arm can car ear eye fit fur kit leg lit map nit ohm pan pen pin pit ton win wit won zen'.split(' ');
  const number = Math.floor(Math.random() * 100); //[...Array(50).keys()];

  return `${rand(names)}-${number}`;
}
