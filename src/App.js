import React from 'react';
import { get, isEqual, isEmpty } from 'lodash';

import GameController from './controllers/GameController';
import Game from './components/Game';
import { JoinDetails } from './components/JoinDetails';
import { NewDetails } from './components/NewDetails';
import { Logout } from './components/Logout';
import { Login } from './components/Login';
import { Actions } from './components/Actions';

import { auth } from './firebase/index';
import { db as fdb } from './firebase/firebase';
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
  }

  componentDidUpdate(_prevProps, prevState) {
    const { authUser } = this.state;

    if (!authUser) return true;

    const prevUid = get(prevState, 'authUser.uid');

    if (!isEqual(prevUid, authUser.uid)) {
      /* Load player data */
      this.cancelUserListener = fdb.collection('users').doc(authUser.uid)
        .onSnapshot(snap => this.setState({ ...snap.data() }));
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
  newGame = (name, e) => {
    e.preventDefault();

    // if this is the first time, show the details screen
    if (!this.state.showingNewDetails) {
      this.setState({ showingNewDetails: true });
      return;
    }


    // If we're on the details screen and we have a game name
    if (!isEmpty(name)) {
      // FIXME: verify game name is not taken
    }

    //...create and join the game
    //...hide the details screen
    this.gameController.newGame({
      players: [this.state.authUser.uid],
      name,
    }).then(result => {
      if (result.success) {
        this.gameListener = result.closer;
        return;
      };

      // Unable to Create.  
      // Clear current game
      this.setState({
        game: null,
        error: result.error
      });
    })

  };

  /**
  * ! Side effect: Updates App State
  */
  joinGame = (name, e) => {
    e.preventDefault();

    // if this is the first time, show the details screen
    if (!this.state.showingJoinDetails) {
      this.setState({ showingJoinDetails: true });
      return;
    }


    // const input = window.prompt('Enter Game ID');
    this.gameController.joinGame(name, this.state.player.id).then(result => {
      if (result.success) {
        this.gameListener = result.closer;
        return;
      }

      // Unable to join.  
      // Clear current game
      this.setState({
        game: null,
        error: result.error
      });

    })
  }

  signOut = () => {
    auth.doSignOut();
    this.setState({
      game: null,
      player: null,
      authUser: null,
    })
  }

  clearKey = key => this.setState({ [key]: null });



  render() {
    const { player, game, authUser, error, showingNewDetails, showingJoinDetails } = this.state;
    const { clearKey, newGame, joinGame, setState } = this;

    if (!authUser)
      return <Login update={setState} />;

    if (showingNewDetails)
      return <NewDetails newGame={newGame} cancel={clearKey} updater={this.setState} error={error} />;

    if (showingJoinDetails)
      return <JoinDetails joinGame={joinGame} cancel={clearKey} updater={this.setState} error={error} />;

    if (game && player)
      return <Game
        game={game}
        player={player}
        updater={setState}
        closeListener={this.gameListener} />

    return (
      <div className="App">
        <div id='dashboard'>
          <h1 className='title'>Precarity</h1>
          <Actions newGame={newGame} joinGame={joinGame} />
          <Logout click={this.signOut} player={player} />
        </div>
        {error && <div id='app-error-bar'>{error}</div>}
      </div>
    );
  };
};

export default App;
