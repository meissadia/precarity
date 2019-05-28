import React from 'react';
import { get, isEqual } from 'lodash';

import GameController from './controllers/GameController';
import Game from './components/Game';

import { Login } from './components/Login';
import { auth } from './firebase/index';
import { db as fdb } from './firebase/firebase';
import { firebase } from './firebase';

import './App.css';

const Actions = ({ newGame, joinGame }) => (
  <div id='actions'>
    <div className='new' onClick={newGame}>New Game</div>
    <div className='join' onClick={joinGame}>Join Game</div>
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.state = {
      game: null,
      player: null,
      authUser: null,
      error: null,
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
  newGame = () => {
    this.gameController.newGame({ players: [this.state.authUser.uid] });
  };

  /**
  * ! Side effect: Updates App State
  */
  joinGame = () => {
    const input = window.prompt('Enter Game ID');
    if (input) {
      this.gameController.joinGame(input, this.state.player.id).then(result => {
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
  }

  signOut = () => {
    auth.doSignOut();
    this.setState({
      game: null,
      player: null,
      authUser: null,
    })
  }

  render() {
    const { player, game, authUser, error } = this.state;
    const { newGame, joinGame, setState } = this;

    if (!authUser) return <Login update={setState} />;
    return (
      <div className="App">
        <header className="app-header">
          <h1 className='title'>Precarity</h1>
          <div className='logout' onClick={this.signOut}>
            <span>{player && player.name}</span>
            <span className='button'>Logout</span>
          </div>
        </header>
        <Actions newGame={newGame} joinGame={joinGame} />
        {error && <div id='app-error-bar'>{error}</div>}
        <Game
          game={game}
          player={player}
          updater={setState}
        />
      </div>
    );
  };
};

export default App;
