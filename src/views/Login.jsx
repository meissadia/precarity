import React, { useState } from 'react';
import { auth, db } from '../firebase/firebase';
import Error from '../components/Error';
import Version from '../components/Version';
import '../styles/Login.css';

const Login = props => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const onLogin = event => {
        event.preventDefault();

        if (!error) {
            auth.signInAnonymously().then(authUser => {
                const newPlayer = {
                    id: authUser.user.uid,
                    score: 0,
                    name,
                };

                db.collection("users").doc(authUser.user.uid).set({
                    player: newPlayer,
                });
            }
            ).catch(err => setError(err.message));
        };
    };


    const isNameValid = () => name !== '';

    return (
        <form id='login' >
            <h2>Precarity</h2>
            <div className={['inputs', 'signup'].join(' ')}>
                <input required
                    name='name'
                    type="text"
                    value={name}
                    placeholder="What's your name?"
                    onChange={ev => setName(ev.target.value)}
                    autoComplete='off'
                    className={isNameValid() ? 'valid' : 'invalid'}
                />
                <button onClick={onLogin}
                    className={isNameValid() ? 'enabled' : 'disabled'}
                    disabled={!isNameValid()}
                    type='submit'>
                    Let's Go!
                </button>
                <Error error={error} />
                <Version />
            </div>
        </form>
    );
};

export default Login;