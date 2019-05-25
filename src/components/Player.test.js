import React from 'react';
import { shallow } from 'enzyme';
import Player, { PlayerController } from './Player';
import { merge } from 'lodash';

describe('PlayerController', () => {
    it('creates', () => {
        const x = new PlayerController({ name: 'test' })
        expect(x.name).toBe('test');
        expect(x.score).toBe(0);
    });
    it('increments', () => {
        const x = new PlayerController({ name: 'test' })
        expect(x.score).toBe(0);
        x.addScore(200);
        expect(x.score).toBe(200);
    });
    it('decrements', () => {
        const x = new PlayerController({ name: 'test' })
        expect(x.score).toBe(0);
        x.subScore(200);
        expect(x.score).toBe(-200);
    });
})

let props = {};

const buildWrapper = xtra => {
    const newProps = merge({}, props, xtra);
    return (
        shallow(<Player {...newProps} />)
    );
}

it('Player without player', () => {
    expect(shallow(<Player />).text()).toBe('No Player');
})

describe('Player', () => {
    let wrapper;

    const withPlayerProps = {
        player: new PlayerController({
            id: 'xj13',
            name: '<Player One Ready>',
        }),
    };

    beforeEach(() => {
        wrapper = buildWrapper(withPlayerProps);
    })

    it('renders name', () => {
        expect(wrapper.find('#xj13 h2').text()).toBe('<Player One Ready>');

    });

    it('renders score', () => {
        expect(wrapper.find('#xj13 div').text()).toBe('0');
    });
});