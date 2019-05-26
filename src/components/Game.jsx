import React from 'react';
import Player, { PlayerController } from './Player';
import { ScoreController } from './ScoreController';

/*

Game {
    id: string,
    name: string,
    players: [
        references
    ],
    double: boolean,
    episode: string,
}

In the Game

onMount
- register db.ref().on() event listeners on each Game.players ref
- register db.ref().on() event listeners for Game ref

onUnmount
- unregister db.ref().on() event listeners on each Game.players ref
- unregister db.ref().on() event listeners for Game ref

*/

export class GameController {
    constructor(args = {}) {
        this.id = args.id;
        this.name = args.name || '<GameName>';
        this.players = args.players || [new PlayerController({}), new PlayerController({}), new PlayerController({})];
        this.episode = args.episode || '<Episode>';
        this.double = args.double;
    }

    static new(args) {
        return (new GameController(args));
    }

    toObj = () => ({
        id: this.id,
        name: this.name,
        players: this.players.map(p => p.ref),
        double: this.double,
        episode: this.episode,
    })

    setName = name => this.name = name;
    getName = this.name;

    status = () => 'in progress';
    playerCount = () => this.players.filter(plyr => plyr.id !== undefined).length;

    addPlayer = player => {
        const spot = this.players.findIndex(x => x.id === undefined);
        if (spot > -1) {
            this.players[spot] = player;
            return true;
        }
        return false;
    }

    updatePlayer = player => {
        const spot = this.players.findIndex(x => x.id === player.id);
        if (spot > -1) this.players[spot] = player;
    }
};

export const Game = ({ game, player, updater }) => {
    if (!game) return null;
    return (
        <div id='currentGame'>
            <h2>{game.name}</h2>
            <div id='game-players'>
                {game.players.map((player, idx) =>
                    <Player key={idx} player={player} />
                )}
            </div>
            <ScoreController
                player={player}
                game={game}
                updater={updater}
            />
        </div>
    )
}

export default Game;