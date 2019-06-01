import React, { useState } from 'react';
import { Logout } from './Logout';
import { Version } from './Version';
import Error from './Error';

const Welcome = ({ player }) => {
  if (!player) return <h2>Loading...</h2>
  return <h2>Welcome, {player.name}!</h2>
}

/**
 * Color scheme
 * DEEP PURPLE
 * #320E3B
 * AFRICAN VIOLET
 * #9F84BD
 * PAYNE'S GREY
 * #546A7B
 * MOCCASIN
 * #F9EBE0
 * CYAN CORNFLOWER BLUE
 * #208AAE
 * OXFORD BLUE
 * #0D2149
 *  */
export const JoinDetails = props => {
  const [name, setName] = useState(null);
  const joiner = props.joinGame.bind(null, name);

  const changeHandler = e => {
    props.updater({ error: null });
    setName(e.target.value);
  }

  const { error, player, signOut } = props;

  // FIXME: Enable submit form using <ENTER> for accessibility
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
