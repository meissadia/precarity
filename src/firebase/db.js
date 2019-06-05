import { db } from './firebase';

/* Firebase Users Collection API */

export const doCreateUser = (id, email, extraState = {}) =>
  db.collection("users").doc(id).set({
    profile: {
      id,
      email,
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


export const dbResetUser = player => {
  return db.collection('users').doc(player.id).set({
    player: {
      ...player,
      game: null,
      score: 0,
    }
  });
};

export const dbLeaveGame = (player, game) => {
  const docRef = db.collection('games').doc(game.name);

  return docRef.get().then(doc => {
    if (!doc.exists) return null;
    const data = doc.data();

    /* Remove player from list */
    const newPlayerList = data.players.filter(p => p !== player.id);

    /* Delete the game when there are no players active */
    if (newPlayerList.length === 0) {
      return docRef.delete()
        .then(() => ({ success: true }))
        .catch(e => ({ success: false, error: e.message }))
    }

    /* Update the game's player list */
    return docRef.set(
      {
        ...data,
        players: newPlayerList,
      }
    ).then(() => ({ success: true })
    ).catch(e => ({ success: false, error: e.message }));
  });
};
