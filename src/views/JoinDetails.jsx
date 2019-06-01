import React, { useState } from 'react';
import { Logout } from '../components/Logout';
import { Version } from '../components/Version';
import Error from '../components/Error';
import '../styles/JoinDetails.css';

const Welcome = ({ player }) => {
  return (
    <h2 className='welcome'>
      {player ? `Welcome, ${player.name}!` : `Loading...`}
    </h2>
  )
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
      <input id='join-input'
        name='name'
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
      <Error error={error} />
      <Version />
    </form>
  );
};

export default JoinDetails;
