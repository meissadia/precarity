import React from 'react';
import { isEmpty } from 'lodash';
import { auth, db } from '../../firebase/index';
import { TabSelect } from './TabSelect';
import { Error } from '../Error';
import { SubmitLogin } from './SubmitLogin';
import { Version } from '../Version';

/**
 * Email Login Controller
 */
export class EmailLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignup: false,
            error: null,
            email: '',
            displayName: '',
            password: '',
        };
    };

    onChange = (key, event) => {
        this.setState({
            error: null,              // Clear errors to reenable login/signup
            [key]: event.target.value,
        });
    };

    /**
     * Execute each validator, check for any falses
     */
    formValid = validators => {
        if (this.state.error) return false;

        return validators.map(x => x()) // Execute validators
            .filter(x => !x)            // Keep failures
            .length === 0;              // Error count === 0?
    }

    emailValid = () => {
        // eslint-disable-next-line no-useless-escape
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return this.state.email.match(pattern) !== null;
    }

    passwordValid = () => !isEmpty(this.state.password) && this.state.password.length >= 6;

    nameValid = () => !isEmpty(this.state.displayName);

    onSignUp = e => {
        const { error, password, email, displayName } = this.state;
        e.preventDefault();

        if (!error) {
            auth.createEmailUser(email, password).then(authUser => {
                // Create a user in our own accessible Firebase Database to store associated data
                const newPlayer = {
                    id: authUser.user.uid,
                    email,
                    score: 0,
                    name: displayName,
                };

                db.doCreateUser(
                    authUser.user.uid,
                    email,
                    { player: newPlayer }
                );
            }).catch(
                () => this.setState({ error: `Unable to register ${email}!` })
            );
        };
    };

    onSignIn = e => {
        const { email, password, error } = this.state;
        e.preventDefault();

        if (!error) {
            auth.signinEmailUser(email, password).catch(
                () => this.setState({ error: 'Incorrect email or password' })
            );
        };
    };

    render() {
        const { email, displayName, error, password, isSignup } = this.state;
        const { onSignUp, onSignIn, onChange, formValid, passwordValid, emailValid, nameValid } = this;

        const section = isSignup ? 'signup' : 'login';
        let validators = [passwordValid, emailValid];
        isSignup && validators.push(nameValid);

        return (
            <form id='login' >
                <h2>Precarity</h2>
                <div className={['inputs', section].join(' ')}>
                    <TabSelect
                        selected={section}
                        setState={this.setState.bind(this)}
                    />
                    <input required
                        name='email'
                        type="email"
                        value={email}
                        placeholder='Email'
                        onChange={onChange.bind(null, 'email')}
                        autoComplete='off'
                        className={emailValid() ? 'valid' : 'invalid'}
                    />
                    {isSignup &&
                        <input required
                            name='displayName'
                            type="text" value={displayName}
                            placeholder='Name'
                            onChange={onChange.bind(null, 'displayName')}
                            autoComplete='off'
                            className={nameValid() ? 'valid' : 'invalid'}
                        />
                    }
                    <input required
                        name='password'
                        type="password"
                        value={password}
                        placeholder='Password'
                        onChange={onChange.bind(null, 'password')}
                        className={passwordValid() ? 'valid' : 'invalid'}
                    />
                    <SubmitLogin
                        section={section}
                        functions={{ onSignUp, onSignIn }}
                        enabled={formValid(validators)}
                    />
                </div>
                <Error error={error} />
                <Version />
            </form >
        );
    };
};