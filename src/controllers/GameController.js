import { db as fdb } from '../firebase/firebase';

/**
 * Firebase Connected Game Controller
 * Collections: games, users
 * Note: 
 *  Call #cleanup on componentWillUnmount to unregister Firestore listeners.
 */
class GameController {

    constructor(args = {}) {
        this.update = args.update;
        this.players = args.players;    // List of player refs
        this.double = args.double;      // Show double score values
        this.MAX_PLAYERS = 3;
    }

    /* Toggle Double flag for Game */
    /* TODO: New feature: updateMultiplier? */
    static toggleDouble(gameId, double) {
        if (!gameId) return;
        fdb.collection('games').doc(gameId).update({ double })
    }

    /* Join an in-progress Game */
    joinGame(gameId, playerId) {
        // Returns a Promise
        // Add own ID to game's player list
        return fdb.collection('games').doc(gameId).get().then(doc => {
            const doc_data = doc.data();

            /* Game exists */
            if (doc_data) {
                const { players } = doc_data;

                if (!players.includes(playerId)) {              // I'm not in the game
                    if (players.length >= this.MAX_PLAYERS) {   // ...but it's full, sorry.
                        return {
                            success: false,
                            error: 'Sorry, game is full!',
                        };
                    }

                    players.push(playerId);                     // ...so add myself
                    fdb.collection('games').doc(gameId).update({ players })
                }
            }

            /* Game doesn't exist yet */
            if (doc_data === undefined) {
                /* Create it... */
                fdb.collection('games').doc(gameId).set({
                    name: gameId,
                    players: [playerId],
                    double: false,
                })
            }


            // I'm in the game
            // ...subscribe to game updates to know when players join/leave.
            const closeGameListener =
                fdb.collection('games').doc(gameId).onSnapshot(doc => {
                    const game = { ...doc.data(), id: doc.id };
                    const error = null;
                    this.update({
                        game,
                        error,
                        showingJoinDetails: false,
                    });
                });

            return { success: true, closer: closeGameListener };
        });

    }
}

export default GameController