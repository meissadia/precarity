import React from 'react';
import Player from './Player';
import { ScoreController } from './ScoreController';
import GameController from '../controllers/GameController';

/**
 * Display Scoreboard and Score controls
 */
export const Game = ({ game, player, updater, closeListener }) => {
    if (!game) return null;
    const toggleDouble = GameController.toggleDouble;
    const goBack = () => {
        // FIXME: Delete self from game player list
        closeListener();            // Stop following game updates
        updater({ game: null });    // Clear local game data
    }

    return (
        <div className="App">
            <div id='game-bar'>
                <div className='link' onClick={goBack}>
                    &lt;&nbsp;Leave
                </div>
                <div>PRECARITY</div>
                <div className='game-name'>{game.name}</div>
            </div>
            <div id='currentGame'>
                <ScoreController
                    player={player}
                    double={game.double}
                />
                <div id='scoreboard'>
                    {game.players.map((gplayer, idx) =>
                        <Player key={idx} player={gplayer} me={player.id === gplayer} />
                    )}
                    <div id='double-indicator'
                        className={game.double ? 'active' : ''}
                        onClick={toggleDouble.bind(null, game.id, !game.double)}
                    >
                        {game.double ? '2x' : '1x'}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Game;