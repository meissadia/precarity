import React, { useState } from 'react';
import { PlayerController } from './Player';

export const Login = props => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const submit = e => {
        e.preventDefault();

        const player = new PlayerController({
            id: Math.floor(Math.random * 100).toString(),
            name: name,
        });

        props.update({ player });
    }

    const change = (callback, event) => callback(event.target.value);

    return (
        <form id='login' onSubmit={submit}>
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
            <button>Login</button>
        </form>
    )
}

export default Login;