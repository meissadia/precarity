import React from 'react';

export const Logout = props => {
  const { click } = props;
  return (
    <button className='logout' onClick={click}>
      <span className='button'>Signout</span>
    </button>
  );
};
