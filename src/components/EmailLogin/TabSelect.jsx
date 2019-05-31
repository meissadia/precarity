import React from 'react';
/**
 *
 * @param {Obj} props
 * @param {Function} props.setState Callback
 */
export const TabSelect = props => {
    /**
     * Set isSignup flag used to drive UI
     * @param {Event} e
     */
    const toggleSelected = e => {
        const source = e.target.attributes.class.value.split(' ')[0];
        props.setState({
            isSignup: source === 'signup',
            error: null,
        });
    };
    /**
     * Derive className value
     * @param {String} selected
     * @param {String} section
     */
    const classNamer = (selected, section) => {
        if (selected !== section)
            return section;
        return [section, 'active'].join(' ');
    };
    return (
        <div id='tab-select'>
            <div tabIndex='0' onClick={toggleSelected} className={classNamer(props.selected, 'login')}>
                Login
            </div>
            <div tabIndex='0' onClick={toggleSelected} className={classNamer(props.selected, 'signup')}>
                Signup
            </div>
        </div>
    );
};
