import React from 'react';
import Player from './Player';
import { ScoreController } from './ScoreController';
import { db } from '../firebase/index';

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

    newGame(args) {
        this.closeGameListener =
            db.doCreateGame({ players: args.players })          // Create a new game in the DB
                .then(docRef => {
                    return docRef.onSnapshot(doc => {           // Anytime the game is updated, run this function
                        const game = doc.data();
                        this.id = game.id;
                        this.update({ game });

                        // NOTE: 
                        //  Tried to resolve players here but led to glitchy behavior
                        //  where app state was inconsistent.  
                        //  Don't Do It.
                    })
                })
    }

    cleanup() {
        if (this.closeGameListener) {
            this.closeGameListener();
            this.closeGameListener = null;
        }
    }
}


export const Game = ({ game, player, updater }) => {
    if (!game) return null;
    return (
        <div id='currentGame'>
            <div id='scoreboard'>
                {/* <h2>{game.name}</h2> */}
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

// export class GameController {
//     constructor(args = {}) {
//         this.id = args.id;
//         this.name = args.name || '<GameName>';
//         this.players = args.players || [new PlayerController({}), new PlayerController({}), new PlayerController({})];
//         this.episode = args.episode || '<Episode>';
//         this.double = args.double;
//     }

//     static new(args) {
//         return (new GameController(args));
//     }

//     toObj = () => ({
//         id: this.id,
//         name: this.name,
//         players: this.players.map(p => p.ref),
//         double: this.double,
//         episode: this.episode,
//     })

//     setName = name => this.name = name;
//     getName = this.name;

//     status = () => 'in progress';
//     playerCount = () => this.players.filter(plyr => plyr.id !== undefined).length;

//     addPlayer = player => {
//         const spot = this.players.findIndex(x => x.id === undefined);
//         if (spot > -1) {
//             this.players[spot] = player;
//             return true;
//         }
//         return false;
//     }

//     updatePlayer = player => {
//         const spot = this.players.findIndex(x => x.id === player.id);
//         if (spot > -1) this.players[spot] = player;
//     }
// };