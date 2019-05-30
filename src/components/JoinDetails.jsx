import React, { useState } from 'react';
import { Logout } from './Logout';

const Welcome = ({ player }) => {
  if (!player) return <h2>Loading...</h2>
  return <h2>Welcome, {player.name}!</h2>
}

export const JoinDetails = props => {
  const [name, setName] = useState(null);
  const joiner = props.joinGame.bind(null, name);

  const changeHandler = e => {
    props.updater({ error: null });
    setName(e.target.value);
  }

  const { error, player, signOut } = props;

  return (
    <form id='join-details'>
      <h1 className='title'>Precarity</h1>
      <Welcome player={player} />
      <input name='name'
        type='text'
        onChange={changeHandler}
        placeholder='Game Name'
        autoComplete='off'
      />
      <div className='actions'>
        <button className='join' onClick={joiner}>
          Join
        </button>
        <Logout click={signOut} player={player} />
      </div>
      {error && <div id='app-error-bar'>{error}</div>}
    </form>
  );
};

export default JoinDetails;
