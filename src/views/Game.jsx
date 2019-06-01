import React from 'react';
import Player from '../components/Player';
import { ScoreController } from '../components/ScoreController';
import GameController from '../controllers/GameController';
import { db } from '../firebase/firebase';
import { Version } from '../components/Version';

import '../styles/GameBar.css';
import '../styles/Player.css';


export const GameBar = ({ gameName, back }) => {
    return (
        <div id='game-bar'>
            <button className='back link' onClick={back}>
                &lt;&nbsp;Leave
            </button>
            <div className='title'>PRECARITY</div>
            <div className='game-name'>{gameName}</div>
        </div>
    )
}

export const Scoreboard = ({ players, selfId }) => {
    return (
        <div id='scoreboard'>
            {players.map(gplayer =>
                <Player
                    key={`${gplayer.id || gplayer}`}
                    player={gplayer}
                    me={selfId === (gplayer.id || gplayer)}
                />
            )}
        </div>
    )
}
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
            db.collection('users').doc(player.id).set({
                player: {
                    ...player,
                    game: null,
                    score: 0,
                }
            });
            if (!doc.exists) return null;
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
                <GameBar back={goBack} gameName={game.name} />
                <Scoreboard players={game.players} selfId={player.id} />
                <div id='double-indicator'
                    className={game.double ? 'active' : ''}
                    onClick={toggleDouble.bind(null, game.id, !game.double)}
                >
                    {game.double ? '2x' : '1x'}
                </div>
                <ScoreController
                    player={player}
                    double={game.double}
                    gameName={game.name}
                />
                <Version />
            </div>
        </div>
    )
}

export default Game;