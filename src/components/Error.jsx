import React from 'react';
/**
 * Render #errors
 * @param {String} props.error Error to display
 */
export const Error = ({ error }) => {
    if (!error) return null;

    return (
        <div id='errors'>
            {error}
        </div>
    );
};

export default Error;