import React from 'react';
import Player from '../components/Player';
import { ScoreController } from '../components/ScoreController';
import GameController from '../controllers/GameController';
import { Version } from '../components/Version';
import { dbResetUser, dbLeaveGame } from '../firebase/db';

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
export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: props.game && props.game.players
        }
    }

    /* Return to Join Game */
    goBack = () => {
        const { player, game, closeListener, updater } = this.props;

        dbResetUser(player).then(() => {
            dbLeaveGame(player, game).then(result => {
                closeListener && closeListener();   // Stop following game updates
                updater({
                    game: null,             // Clear local game data
                    error: result.error,    // Display any server error, though maybe we can just log these instead of display them
                });
            });
        });
    }

    render() {
        const { game, player } = this.props;

        if (!game) return null;
        if (!game.players || game.players.length === 0) return null;
        if (!game.players.includes(player.id)) return null;

        const toggleDouble = GameController.toggleDouble.bind(null, game.id, !game.double);

        return (
            <div className="App">
                <div id='currentGame'>
                    <GameBar back={this.goBack} gameName={game.name} />
                    <Scoreboard players={game.players} selfId={player.id} />
                    <div id='double-indicator'
                        className={game.double ? 'active' : ''}
                        onClick={toggleDouble}
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

}

export default Game;