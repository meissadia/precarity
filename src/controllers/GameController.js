import { db } from '../firebase/index';
import { db as fdb } from '../firebase/firebase';

/**
 * Firebase Connected Game Controller
 * Collections: games, users
 * Note: 
 *  Call #cleanup on componentWillUnmount to unregister Firestore listeners.
 */
class GameController {
    static MAX_PLAYERS = 3;

    constructor(args = {}) {
        this.update = args.update;
        this.players = args.players;    // List of player refs
        this.double = args.double;      // Show double score values
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

        db.doCreateGame({ players: this.players })       // Create a new game in the DB
            .then(docRef => {
                this.closeGameListener =
                    docRef.onSnapshot(doc => {           // Subscribe to game updates
                        const game = { ...doc.data(), id: doc.id };
                        this.update({ game });           // Cache current game data

                        // NOTE: 
                        //  Tried to resolve players here but it led to glitchy behavior
                        //  where app state was inconsistent and wouldn't update as expected.  
                    })
            })
    }

    /* Join an in-progress Game */
    joinGame(gameId, playerId) {
        this.cleanup();

        // Add own ID to game's player list
        fdb.collection('games').doc(gameId).get().then(doc => {
            const { players } = doc.data();

            if (!players.includes(playerId)) {
                players.push(playerId);
                fdb.collection('games').doc(gameId).update({ players })
            }
        });

        // Subscribe to game updates
        this.closeGameListener =
            fdb.collection('games').doc(gameId).onSnapshot(doc => {
                const game = { ...doc.data(), id: doc.id };
                this.update({ game });
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