import React from 'react';
/**
 * Login view submit button factory
 * @param {String} props.section Current Section
 * @param {Obj} props.functions Login Handlers
 */
export const SubmitLogin = ({ section, functions, enabled }) => {
    const { onSignIn, onSignUp } = functions;
    const class_name = [enabled ? '' : 'disabled', section].join(' ');

    if (section === 'login') {
        return (
            <button onClick={onSignIn}
                className={class_name}
                disabled={!enabled}
                type='submit'>
                Login
            </button>
        );
    }
    ;
    return (
        <button onClick={onSignUp}
            className={class_name}
            disabled={!enabled}
            type='submit'>
            Signup
        </button>
    );
};
