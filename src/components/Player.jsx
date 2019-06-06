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
            loading: true,
            player: {
                id: props.player
            },
        };
        this.timers = [];
    };

    componentDidUpdate(prevProps, prevState) {
        /* Clear loading State */
        if (this.state.loading
            && this.state.player
            && (this.state.player.score || this.state.player.score === 0)) {
            this.setState({
                loading: false
            });
            return;
        }

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
            const t = setTimeout(() => {
                const element = document.getElementById(this.state.player.id);
                if (element) {
                    let cname = element.getAttribute('class');
                    cname = cname.replace('flashGreen', '');
                    element.setAttribute('class', cname);
                    this.setState({ updated: false });
                }
            }, 1000);
            this.timers.push(t);
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
        this.timers.forEach(t => clearTimeout(t));
        this.timers = [];
    };

    render() {
        const { player } = this.state;
        let section_class;
        section_class = [
            'player',
            this.props.me ? 'me' : null,
            this.state.updated ? 'flashGreen' : null,
            this.state.player.leaving ? 'leaving' : null,
            this.state.loading ? 'loading' : null,
        ].filter(x => x).join(' ');

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