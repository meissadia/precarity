import React, { useState } from 'react';

export const NewDetails = props => {
  const [name, setName] = useState(null);
  const creator = props.newGame.bind(null, name);
  const cancel = props.cancel.bind(null, 'showingNewDetails');
  const changeHandler = e => {
    props.updater({ error: null });
    setName(e.target.value);
  }
  const { error } = props;


  return (
    <form id='new-details'>
      <h2>New Game</h2>
      <input name='name'
        type='text'
        onChange={changeHandler}
        placeholder='Game Name'
      />
      <div className='actions'>
        <button className='create' onClick={creator}>Create</button>
        <button className='cancel' onClick={cancel}>Cancel</button>
      </div>
      {error && <div id='app-error-bar'>{error}</div>}
    </form>
  );
};
