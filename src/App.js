import React from 'react';
import './App.css';
import Game, { GameController } from './components/Game';
import { Login } from './components/Login';

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
    };
  };

  newGame = () => {
    const player = this.state.player;
    const game = new GameController();
    player.reset();
    game.addPlayer(player);
    this.setState({ game });
  };

  render() {
    const { player, game } = this.state;

    if (!player) return <Login update={this.setState} />

    return (
      <div className="App">
        <header className="app-header">
          <h1>Precarity</h1>
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
