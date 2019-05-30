import React, { useState } from 'react';

export const JoinDetails = props => {
  const [name, setName] = useState(null);
  const joiner = props.joinGame.bind(null, name);
  const cancel = props.cancel.bind(null, 'showingJoinDetails');
  const changeHandler = e => {
    props.updater({ error: null });
    setName(e.target.value);
  }
  const { error } = props;

  return (
    <form id='join-details'>
      <h2>Join Game</h2>
      <input name='name'
        type='text'
        onChange={changeHandler}
        placeholder='Game Name'
      />
      <div className='actions'>
        <button className='join' onClick={joiner}>Join</button>
        <button className='cancel' onClick={cancel}>Cancel</button>
      </div>
      {error && <div id='app-error-bar'>{error}</div>}
    </form>
  );
};
