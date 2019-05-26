import React from 'react';
import { db } from '../firebase/firebase';

export class PlayerController {
    constructor({ name, ...others }) {
        this._id = others.id;
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

    get ref() {
        return `/users/${this._id}`
    }
    get id() {
        return this._id;
    }



    toObj = () => ({
        id: this._id,
        name: this.name,
        score: this.score,
    })
};

/**
 * Firebase Connected Player
 */
export class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = { player: { id: props.player } }
    }

    componentDidMount() {
        this.unlisten = db.collection('users').doc(this.state.player.id).onSnapshot(snap =>
            this.setState({ player: snap.data().player })
        )
    };

    componentWillUnmount() {
        this.unlisten();
    };

    render() {
        const { player } = this.state;
        return (
            <div id={player.id} className='player'>
                <h2>{player.name}</h2>
                <div>{player.score}</div>
            </div>
        );
    };
};

export default Player;