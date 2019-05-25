import React from 'react';
import Player, { PlayerController } from './Player';
import { ScoreController } from './ScoreController';

export class GameController {
    constructor(args = {}) {
        this.id = args.id;
        this.name = args.name || '<GameName>';
        this.players = args.players || [new PlayerController({}), new PlayerController({}), new PlayerController({})];
        this.episode = args.episode || '<Episode>';
    }

    static new(args) {
        return (new GameController(args));
    }

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