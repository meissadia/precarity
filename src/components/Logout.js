import React from 'react';

export const Logout = props => {
  const { player, click } = props;

  if (!player)
    return <div className='logout'>Loading...</div>

  return (
    <div className='logout' onClick={click}>
      <span>{player && player.name}</span>
      <span className='button'>Logout</span>
    </div>
  );
};
