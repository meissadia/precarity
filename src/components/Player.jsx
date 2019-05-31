import React from 'react';
import { isEqual } from 'lodash';

import { db } from '../firebase/firebase';

/**
 * Firebase Connected Player
 */
export class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updated: false,
            player: {
                id: props.player
            },
        };
    };

    componentDidUpdate(prevProps, prevState) {
        /* Different Player */
        if (!isEqual(prevState.player.id, this.state.player.id)) {
            this.unlisten();
            this.unlisten = db.collection('users').doc(this.state.player.id)
                .onSnapshot(snap =>
                    this.setState({ player: snap.data().player })
                );
            return;
        };

        /* Just a score update */
        if (!isEqual(prevState.player.score, this.state.player.score)) {
            this.setState({ updated: true })
            return;
        }

        /* Not updated, remove updated flag and animation class */
        if (this.state.updated) {
            setTimeout(() => {
                const element = document.getElementById(this.state.player.id);
                let cname = element.getAttribute('class');
                cname = cname.replace('flashGreen', '');
                element.setAttribute('class', cname);
                this.setState({ updated: false });
            }, 1000);
        }
    };

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
        let section_class;
        section_class = [
            'player',
            this.props.me ? 'me' : null,
            this.state.updated ? 'flashGreen' : null,
        ].join(' ');

        return (
            <div id={player.id} className={section_class}>
                <div className='indicator'>✦</div>
                <h2 className='name'>{player.name}</h2>
                <div className='score'>{player.score}</div>
            </div>
        );
    };
};

export default Player;