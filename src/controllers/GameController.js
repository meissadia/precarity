import { db } from '../firebase/index';
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
    /* FIXME: refactor as updateMultiplier? */
    static toggleDouble(gameId, double) {
        if (!gameId) return;
        fdb.collection('games').doc(gameId).update({ double })
    }

    /* Initiate and join a game */
    newGame(args) {
        this.cleanup();

        return db.doCreateGame({                                // Create a new game in the DB
            players: args.players,
            name: args.name,
        })
            .then(status => {
                if (status.success) {
                    const closeGameListener =
                        fdb.collection('games').doc(status.id).onSnapshot(doc => {           // Subscribe to game updates
                            const game = { ...doc.data(), id: doc.id };
                            const error = null;
                            this.update({                   // Cache current game data
                                game,
                                error,
                                showingNewDetails: false,
                            });

                            // NOTE: 
                            //  Tried to resolve players here but it led to glitchy behavior
                            //  where app state was inconsistent and wouldn't update as expected.  
                        });

                    return { success: true, closer: closeGameListener };
                }
                return { success: false, error: status.error }
            })
    }

    /* Join an in-progress Game */
    joinGame(gameId, playerId) {
        this.cleanup();

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

    /* Unregister Event Listeners */
    cleanup() {
        if (this.closeGameListener) {
            this.closeGameListener();
            this.closeGameListener = null;
        }
    }
}

export default GameController