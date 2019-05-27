import React from 'react';
import './App.css';
import Game, { FBGame } from './components/Game';
import { PlayerController } from './components/Player';
import { Login } from './components/Login';
import { firebase } from './firebase';
import { auth, db } from './firebase/index';
import { db as fdb } from './firebase/firebase';
import { isEqual, get } from 'lodash';

const Actions = ({ newGame }) => (
  <div id='actions'>
    <div className='new' onClick={newGame}>New Game</div>
    <div className='join'>Join Game</div>
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
    };
  };

  componentDidMount() {
    this.authClearListener = this.onAuthUserChange(); // Firebase Log-in/out
  }

  componentWillUnmount() {
    this.authClearListener();
    this.fbgame.cleanup();
    if (this.cancelUserListener) {
      this.cancelUserListener();
      this.cancelUserListener = null;
    }
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
    this.fbgame = new FBGame({ update: this.setState });
    this.fbgame.newGame({ players: [this.state.authUser.uid] });
  };

  signOut = () => {
    auth.doSignOut();
    this.setState({
      game: null,
      player: null,
      authUser: null,
    })
  }

  render() {
    const { player, game, authUser } = this.state;
    const { newGame, setState } = this;

    if (!authUser) return <Login update={setState} />;
    return (
      <div className="App">
        <header className="app-header">
          <h1>Precarity</h1>
          {authUser && <div id='logout-button' onClick={this.signOut}>Logout</div>}
        </header>
        <Actions newGame={newGame} />
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
