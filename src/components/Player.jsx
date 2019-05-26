import React from 'react';

export class PlayerController {
    constructor({ name, ...others }) {
        this.id = others.id;
        this._name = name || '<Waiting for Player>';
        this._score = others.score || 0;
    };

    addScore = (val) => this._score += val;
    subScore = (val) => this._score -= val;

    reset = () => this._score = 0;

    get name() {
        return this._name;
    };
    get score() {
        return this._score;
    };
};

export const Player = ({ player }) => {
    if (!player) return <div>No Player</div>
    return (
        <div id={player.id} className='player'>
            <h2>{player.name}</h2>
            <div>{player.score}</div>
        </div>
    );
};

export default Player;