import React from 'react';
import { db } from '../firebase/firebase';

const DEFAULT_SCORES = [200, 400, 600, 800, 1000];

export const ScoreButton = props => {
    const { player, value } = props;

    const updateScore = () => {
        const { id, name, score } = player;
        db.collection("users").doc(id).update({
            player: {
                id,
                name,
                score: score + value,
            }
        }).catch(err => console.log('Failed to addScore', err))
    }

    return (
        <div
            className={['score-button', props.className].join(' ')}
            onClick={updateScore}
        >
            {props.label || value}
        </div>
    );
};

export const ResetScoreButton = props => <ScoreButton {...props} />

export const ScoreController = props => {
    const { player, double } = props;

    if (!player) return null;

    let values = props.values || DEFAULT_SCORES;

    if (double)
        values = values.map(x => x * 2);

    return (
        <div id='score-controller'>
            <h2>Score: {player.score}</h2>
            {values.map(val =>
                <ScoreButton
                    key={val}
                    player={player}
                    value={val}
                />
            )}
            <ResetScoreButton
                player={player}
                value={-player.score}
                label='Clear Score'
                className='reset'
            />
        </div>
    )
};