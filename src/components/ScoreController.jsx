import React, { useLayoutEffect } from 'react';
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
    useLayoutEffect(() => {
        window && window.scrollTo(0, 0);
    })

    const { player, double } = props;

    if (!player) return null;

    let values = props.values || DEFAULT_SCORES;

    if (double)
        values = values.map(x => x * 2);

    /* Split buttons into two columns */
    let list1 = values.slice(0, (values.length / 2) + 1);
    let list2 = values.slice((values.length / 2) + 1, values.length);

    const ButtonCol = props => (
        <div className='button-col'>
            {props.list.map(val =>
                <ScoreButton
                    key={val}
                    player={props.player}
                    value={val}
                />
            )}
            {props.children}
        </div>
    )

    return (
        <div id='score-controller'>
            <ButtonCol list={list1} player={player} />
            <ButtonCol list={list2} player={player}>
                <ResetScoreButton
                    player={player}
                    value={-player.score}
                    label='Clear'
                    className='reset'
                />
            </ButtonCol>
        </div>
    )
};