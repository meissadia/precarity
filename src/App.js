import React from 'react';
import { get, isEqual } from 'lodash';

import { randomOrName } from './lib/randomOrName';
import GameController from './controllers/GameController';
import Game from './components/Game';
import Login from './components/Login';
import { JoinDetails } from './components/JoinDetails';

import { auth } from './firebase/index';
import { db as fdb, auth as fauth } from './firebase/firebase';
import { firebase } from './firebase';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.state = {
      game: null,
      player: null,
      authUser: null,
      error: null,
      showingNewDetails: null,
      showingJoinDetails: null,
    };
    this.gameController = new GameController({ update: this.setState });
  };

  componentDidMount() {
    this.authClearListener = this.onAuthUserChange(); // Firebase Log-in/out
  }

  componentWillUnmount() {
    this.authClearListener();
    this.gameController.cleanup();
    if (this.cancelUserListener) {
      this.cancelUserListener();
      this.cancelUserListener = null;
    }

    // Promise with unregister function for game listener
    this.gameListener && this.gameListener.then(closer => closer && closer());
    this.signOut();
  }

  componentDidUpdate(_prevProps, prevState) {
    const { authUser, player, game } = this.state;

    if (!authUser) return true;

    const prevUid = get(prevState, 'authUser.uid');

    if (!isEqual(prevUid, authUser.uid)) {
      /* Load player data */
      console.log(fauth);
      this.cancelUserListener = fdb.collection('users').doc(authUser.uid)
        .onSnapshot(snap => this.setState({ ...snap.data() }));
    }

    if (!player) return;

    const gname = player.game;

    if (gname && !game) {
      this.gameController.joinGame(
        gname,
        authUser.uid
      ).then(result => {
        if (result.success) {
          this.gameListener = result.closer;
          return;
        };

        const { error } = result;
        const game = null;

        // Unable to join. Clear current game
        this.setState({ game, error });
      })
    }
  }

  onAuthUserChange() {
    return firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  /**
  * ! Side effect: Updates App State
  */
  joinGame = (name, e) => {
    e.preventDefault();

    this.gameController.joinGame(
      randomOrName(name),
      this.state.player.id
    ).then(result => {
      if (result.success) {
        this.gameListener = result.closer;
        return;
      }

      const { error } = result;
      const game = null;

      // Unable to join. Clear current game
      this.setState({ game, error });

    })
  }

  signOut = () => {
    fauth.currentUser && fauth.currentUser.delete();
    auth.doSignOut();
    console.log(fauth);
    fdb.collection('users').doc(this.state.authUser.uid).delete();
    this.setState({
      game: null,
      player: null,
      authUser: null,
    });
  };

  clearKey = key => this.setState({ [key]: null });

  render() {
    const { player, game, authUser, error } = this.state;
    const { clearKey, joinGame } = this;

    if (!authUser)
      return <Login />;

    if (game && player)
      return <Game
        game={game}
        player={player}
        updater={this.setState}
        closeListener={this.gameListener} />

    return <JoinDetails joinGame={joinGame}
      player={player}
      cancel={clearKey}
      updater={this.setState}
      error={error}
      signOut={this.signOut}
    />;
  };
};

export default App;
