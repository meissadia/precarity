import React, { useState } from 'react';
import { auth, db } from '../firebase/index';

export const Login = props => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    /**
     * State Update Function
     * @param {Function} callback Apply callback to event.target.value
     * @param {Event} event 
     */
    const change = (callback, event) => callback(event.target.value);

    const onSignUp = event => {
        auth.createEmailUser(name, password)
            .then(authUser => {
                // Create a user in your own accessible Firebase Database to store associated State
                const newPlayer = {
                    id: authUser.user.uid,
                    name,
                    score: 0,
                }

                db.doCreateUser(
                    authUser.user.uid,
                    name,
                    { player: newPlayer }
                );
            })
            .catch(error => setError(error.message));

        event.preventDefault();
    }

    const onSuccess = (doc) => {
        // console.log('doc data');
        // console.log(doc.data());
    };

    function onSignIn(event) {
        console.log('signin');

        auth.signinEmailUser(name, password)
            .then(userAccount => onSuccess(userAccount))
            .catch(error => setError(error.message));

        event.preventDefault();
    };



    return (
        <form id='login'>
            <h2>Precarity</h2>
            <label htmlFor="name">Username</label>
            <input required
                name='name'
                type="text" value={name}
                onChange={change.bind(null, setName)}
                autoFocus
            />
            <label htmlFor="password">Password</label>
            <input
                name='password'
                type="password"
                value={password}
                onChange={change.bind(null, setPassword)}
            />
            <button className='login' onClick={onSignIn}>Login</button>
            <button className='signup' onClick={onSignUp}>Signup</button>
            <div id='errors'>
                {error}
            </div>
        </form>
    )
}

export default Login;