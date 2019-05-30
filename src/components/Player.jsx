import React from 'react';
import { db } from '../firebase/firebase';
import { isEqual } from 'lodash';

/**
 * Firebase Connected Player
 */
export class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: {
                id: props.player
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(prevState.player, this.state.player)) {
            this.unlisten();
            this.unlisten = db.collection('users').doc(this.state.player.id)
                .onSnapshot(snap =>
                    this.setState({ player: snap.data().player })
                )
        };

    }

    componentDidMount() {
        this.unlisten = db.collection('users').doc(this.state.player.id)
            .onSnapshot(snap =>
                this.setState({ player: snap.data().player })
            )
    };

    componentWillUnmount() {
        this.unlisten();
    };

    render() {
        const { player } = this.state;
        let cname = this.props.me ? 'me' : null;
        cname = ['player', cname].join(' ');

        return (
            <div id={player.id} className={cname}>
                <div className='indicator'>✦</div>
                <h2>{player.name}</h2>
                <div>{player.score}</div>
            </div>
        );
    };
};

export default Player;