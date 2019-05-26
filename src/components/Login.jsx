import React, { useState } from 'react';
import { PlayerController } from './Player';
import { auth, db } from '../firebase/index';

export const Login = props => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const change = (callback, event) => callback(event.target.value);

    const onSuccess = (doc) => {
        // console.log('doc data');
        // console.log(doc.data());
    }

    function onSignIn(event) {
        console.log('signin');

        auth.doSignInWithEmailAndPassword(name, password)
            .then(userAccount => onSuccess(userAccount))
            .catch(error => setError(error.message));

        event.preventDefault();
    };

    const onSignUp = event => {
        auth.doCreateUserWithEmailAndPassword(name, password)
            .then(authUser => {
                // Create a user in your own accessible Firebase Database too
                db.doCreateUser(authUser.user.uid, name);
                db.doGetUser(authUser.user.uid)
                    .then(doc => onSuccess(doc))
                    .catch(({ message }) => console.log(message));
            })
            .catch(error => setError(error.message));

        event.preventDefault();
    }

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