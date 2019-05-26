import React from 'react';
import './App.css';
import Game, { GameController } from './components/Game';
import { Login } from './components/Login';
import { firebase } from './firebase';
import { auth } from './firebase/index';

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
    this.onAuthUserChange();      // Firebase Log-in/out
  }

  onAuthUserChange() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  newGame = () => {
    const player = this.state.player;
    const game = new GameController();
    player.reset();
    game.addPlayer(player);
    this.setState({ game });
  };

  render() {
    const { player, game, authUser } = this.state;

    if (!authUser) return <Login update={this.setState} />

    return (
      <div className="App">
        <header className="app-header">
          <h1>Precarity</h1>
          {this.state.authUser && <div id='logout-button' onClick={() => auth.doSignOut()}>Logout</div>}
        </header>
        <Actions newGame={this.newGame} />
        <Game
          game={game}
          player={player}
          updater={this.setState}
        />
      </div>
    );
  };
};

export default App;
