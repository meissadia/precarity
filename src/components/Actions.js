import React from 'react';

export const Actions = ({ newGame, joinGame }) => (
  <div id='actions'>
    <div className='item new' onClick={newGame.bind(null, 'new')}>
      New Game
    </div>
    <div className='item join' onClick={joinGame}>
      Join Game
    </div>
  </div>
);
