import React from 'react';
import { shallow } from 'enzyme';
import Game from './Game';
import { merge } from 'lodash';

describe('Game', () => {
    let props = {};

    const buildWrapper = xtra => {
        const newProps = merge({}, props, xtra);
        return (
            shallow(<Game {...newProps} />)
        );
    }

    it('renders empty state', () => {
        expect(shallow(<Game />).text()).toBe('');
    })

    describe('with a game', () => {
        let wrapper;

        const withGameProps = {
            game: { id: 'game', players: [1, 2, 3] },
        };

        beforeEach(() => {
            wrapper = buildWrapper(withGameProps);
        })


        it('renders id', () => {
            expect(wrapper.find('#currentGame h2').text()).toBe('game');
        });

        it('renders Players', () => {
            expect(wrapper.find('Player').length).toBe(3);
        });

        it('renders ScoreController', () => {
            expect(wrapper.find('ScoreController').length).toBe(1);
        });
    });
});
