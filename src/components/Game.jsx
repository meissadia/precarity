import React from 'react';
import Player from './Player';
import { ScoreController } from './ScoreController';
import { db } from '../firebase/index';
import { db as fdb } from '../firebase/firebase';

export class PlayerFB {
    constructor(args) {
        this._id = args.id;
    }
    get ref() {
        return `/users/${this._id}`;
    }
}

/**
 * Firebase Connected Game
 */
export class FBGame {
    constructor(args = {}) {
        this.update = args.update;
        this.id = args.id;
        this.players = args.players;    // List of player refs
        this.double = args.double;      // Show double score values
    }

    toObj = () => ({
        id: this.id,
        players: this.players,
    })

    /* Initiate and join a game */
    newGame(args) {
        this.cleanup();

        this.closeGameListener =
            db.doCreateGame({ players: args.players })          // Create a new game in the DB
                .then(docRef => {
                    return docRef.onSnapshot(doc => {           // Anytime the game is updated, run this function
                        const game = doc.data();
                        this.id = game.id;
                        this.update({ game });

                        // NOTE: 
                        //  Tried to resolve players here but led to glitchy behavior
                        //  where app state was inconsistent and wouldn't update as expected.  
                    })
                })
    }

    /* Join an in-progress Game */
    joinGame(gameId, playerId) {
        this.cleanup();

        // Add own ID to game's player list
        fdb.collection('games').doc(gameId).get().then(doc => {
            const data = doc.data();

            if (!data.players.includes(playerId)) {
                data.players.push(playerId);
                fdb.collection('games').doc(gameId).update({ players: data.players })
            }
        });

        // Subscribe to game updates
        this.closeGameListener =
            fdb.collection('games').doc(gameId).onSnapshot(doc => {
                const game = { ...doc.data(), id: doc.id };
                this.id = game.id;
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

/**
 * Display Scoreboard and Score controls
 */
export const Game = ({ game, player }) => {
    if (!game) return null;
    return (
        <div id='currentGame'>
            <h2>{game.id}</h2>
            <div id='scoreboard'>
                {game.players.map((player, idx) =>
                    <Player key={idx} player={player} />
                )}
            </div>
            <ScoreController
                player={player}
                game={game}
            />
        </div>
    )
}

export default Game;