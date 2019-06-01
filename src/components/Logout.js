import React from 'react';

export const Logout = props => {
  const { click } = props;
  return (
    <div tabIndex='0' className='logout' onClick={click}>
      <span className='button'>Logout</span>
    </div>
  );
};
