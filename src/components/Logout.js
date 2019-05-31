import React from 'react';

export const Logout = props => {
  const { player, click } = props;

  if (!player)
    return <div className='logout'>Loading...</div>

  return (
    <div tabIndex='0' className='logout' onClick={click}>
      <span className='button'>Logout</span>
    </div>
  );
};
