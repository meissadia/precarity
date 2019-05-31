import React from 'react';
import Player from './Player';
import { ScoreController } from './ScoreController';
import GameController from '../controllers/GameController';
import { db } from '../firebase/firebase';
import { Version } from './Version';

/**
 * Display Scoreboard and Score controls
 */
export const Game = ({ game, player, updater, closeListener }) => {
    if (!game) return null;
    if (!game.players || game.players.length === 0) return null;
    if (!game.players.includes(player.id)) return null;

    const toggleDouble = GameController.toggleDouble;

    /* Return to Join Game */
    const goBack = () => {
        db.collection('games').doc(game.name).get().then(doc => {
            const data = doc.data();

            // Remove self from player list
            const newPlayerList = data.players.filter(p => p !== player.id);

            /* Delete the game when there are no players active */
            if (newPlayerList.length === 0) {
                return db.collection('games').doc(game.name).delete().then(() => {
                    closeListener && closeListener();
                    updater({ game: null });
                });
            }

            /* Update the game's player list */
            db.collection('games').doc(game.name).set({
                ...data,
                players: newPlayerList,
            }).then(() => {
                closeListener && closeListener();   // Stop following game updates
                updater({ game: null });            // Clear local game data
            })
        });
    }

    return (
        <div className="App">
            <div id='currentGame'>
                <div id='game-bar'>
                    <div className='back link' onClick={goBack}>
                        &lt;&nbsp;Leave
                    </div>
                    <div className='title'>PRECARITY</div>
                    <div className='game-name'>{game.name}</div>
                </div>
                <div id='scoreboard'>
                    {game.players.map(gplayer =>
                        <Player
                            key={`${gplayer.id || gplayer}`}
                            player={gplayer}
                            me={player.id === (gplayer.id || gplayer)}
                        />
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
                <Version />
            </div>
        </div>
    )
}

export default Game;