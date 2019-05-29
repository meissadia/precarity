import React, { useState } from 'react';
import { auth, db } from '../firebase/index';

export const Login = props => {
    const [isSignup, setIsSignup] = useState(false);

    /**
     * State Update Function
     * @param {Function} callback Apply callback to event.target.value
     * @param {Event} event 
     */
    const change = (callback, event) => callback(event.target.value);

    const SignUp = () => {
        const [email, setEmail] = useState('');
        const [displayName, setDisplayName] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState(null);

        const onSignUp = e => {
            e.preventDefault();
            if (!error) {
                auth.createEmailUser(email, password)
                    .then(authUser => {
                        // Create a user in your own accessible Firebase Database to store associated State
                        const newPlayer = {
                            id: authUser.user.uid,
                            email,
                            score: 0,
                            name: displayName,
                        }

                        db.doCreateUser(
                            authUser.user.uid,
                            email,
                            { player: newPlayer }
                        );
                    })
                    .catch(() => setError(`Unable to register ${email}!`));
            }
        }

        return (
            <form id='login' onSubmit={onSignUp}>
                <h2>Precarity</h2>
                <div className='inputs'>
                    <TabSelect selected='signup' />
                    <input required
                        name='email'
                        type="email"
                        value={email}
                        placeholder='Email'
                        onChange={change.bind(null, setEmail)}
                        autoFocus
                    />
                    <input required
                        name='displayName'
                        type="text" value={displayName}
                        placeholder='Username'
                        onChange={change.bind(null, setDisplayName)}
                    />
                    <input
                        name='password'
                        type="password"
                        value={password}
                        placeholder='Password'
                        onChange={change.bind(null, setPassword)}
                    />
                    <button className='signup' type='submit'>Signup</button>
                </div>
                {error &&
                    <div id='errors'>
                        {error}
                    </div>
                }
            </form >
        )
    }

    const SignIn = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        let [error, setError] = useState(null);

        const onSignIn = e => {
            e.preventDefault();
            if (!error) {
                auth.signinEmailUser(email, password)
                    .catch(() => setError('Incorrect email or password'));
            }
        };

        return (
            <form id='login' onSubmit={onSignIn}>
                <h2>Precarity</h2>
                <div className='inputs'>
                    <TabSelect selected='login' />
                    <input required
                        name='email'
                        type="email"
                        value={email}
                        placeholder='Email'
                        onChange={change.bind(null, setEmail)}
                        autoFocus
                    />
                    <input
                        name='password'
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={change.bind(null, setPassword)}
                    />
                    <button className='login' type='submit'>Login</button>
                </div>
                {error &&
                    <div id='errors'>
                        {error}
                    </div>
                }
            </form>
        )
    }

    const classNamer = (selected, section) => {
        if (selected !== section) return section;
        return [section, 'active'].join(' ');
    }

    const TabSelect = props => {
        const toggleSelected = e => {
            const source = e.target.attributes.class.value.split(' ')[0];
            setIsSignup(source === 'signup');
        }

        return (
            <div id='tab-select'>
                <div
                    onClick={toggleSelected}
                    className={classNamer(props.selected, 'login')}
                >
                    Login
                </div>
                <div
                    onClick={toggleSelected}
                    className={classNamer(props.selected, 'signup')}
                >
                    Signup
                </div>
            </div>
        )
    }

    if (isSignup) return <SignUp />
    return <SignIn />
}

export default Login;