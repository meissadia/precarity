import React from 'react';
import Player from './Player';
import { ScoreController } from './ScoreController';
import GameController from '../controllers/GameController';

/**
 * Display Scoreboard and Score controls
 */
export const Game = ({ game, player }) => {
    if (!game) return null;
    const toggleDouble = GameController.toggleDouble;

    return (
        <div id='currentGame'>
            <h2>{game.name}</h2>
            <div id='scoreboard'>
                {game.players.map((player, idx) =>
                    <Player key={idx} player={player} />
                )}
            </div>
            <div id='double-indicator'
                className={game.double ? 'active' : ''}
                onClick={toggleDouble.bind(null, game.id, !game.double)}
            >
                {game.double ? '2x' : '1x'}
            </div>
            <ScoreController
                player={player}
                double={game.double}
            />
        </div>
    )
}

export default Game;