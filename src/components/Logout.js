import React from 'react';

export const Logout = props => {
  const { player, click } = props;

  return (
    <div className='logout' onClick={click}>
      <span>{player && player.name}</span>
      <span className='button'>Logout</span>
    </div>
  );
};
