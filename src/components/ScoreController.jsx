import React from 'react';

export const ScoreButton = props => {
    const { player, game, updater } = props;

    const updateScore = () => {
        player.addScore(props.value);
        game.updatePlayer(player);
        updater({ player });

    };

    return (
        <div
            className='score-button'
            onClick={updateScore}
        >
            {props.value}
        </div>
    );
}

export const ScoreController = props => {
    const { player, double, game, updater } = props;

    if (!player) return null;

    const defaultValues = [200, 400, 600, 800, 1000];
    let values = props.values || defaultValues;

    if (double) values = values.map(x => x * 2);

    // const updatePlayer = val => player.addScore(val);

    return (
        <div id='score-controller'>
            <h2>Score: {player.score}</h2>
            {values.map((val, idx) =>
                <ScoreButton
                    key={val}
                    player={player}
                    game={game}
                    value={val}
                    updater={updater}
                />
            )}
        </div>
    )
};