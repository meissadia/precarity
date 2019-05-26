import React from 'react';
import { shallow } from 'enzyme';
import Game, { GameController, FBGame } from './Game';
import Player, { PlayerController } from './Player';
import { merge } from 'lodash';

describe('FBGame', () => {
    it.skip('creates a new game', async () => {
        const spy = jest.fn();
        const game = new FBGame({ update: spy });

        expect(game.toObj()).toEqual({
            id: undefined,
            players: undefined,
        });

        // Target
        await game.newGame();

        expect(spy.mock.calls.length).toBe(1);

    });


});

describe('GameController', () => {
    it('add a player', () => {
        const p1 = new PlayerController({ id: 'p1', name: 'p1' });
        const game = new GameController();
        expect(game.playerCount()).toBe(0);
        game.addPlayer(p1);
        expect(game.playerCount()).toBe(1);
    });
});

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
            game: new GameController(),
        };

        beforeEach(() => {
            wrapper = buildWrapper(withGameProps);
        })


        it.skip('renders name', () => {
            expect(wrapper.find('#currentGame h2').text()).toBe('<GameName>');
        });

        it('renders Players', () => {
            expect(wrapper.find('Player').length).toBe(3);
        });
    });
});
