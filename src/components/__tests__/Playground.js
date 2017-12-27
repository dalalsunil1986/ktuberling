import React from 'react';
import renderer from 'react-test-renderer';

import Playground from '../Playground';
import PlaygroundJs from '../../playground/playground';

jest.mock('../../playground/playground', () => jest.fn());


describe('Playground', () => {
  const ground = {
    name: 'ground',
    file: 'ground.svg',
    localization: {
      bs: 'bs',
      ca: 'bs',
    },
    bgcolor: 'bgcolor',
    items: [
      {
        name: 'item 1',
        scale: '8',
        sound: 'item1',
      },
    ],
  };


  beforeEach(() => {
    PlaygroundJs.mockReset();
  });


  it('render', () => {
    const remove = jest.fn();
    const setPlayground = jest.fn();
    PlaygroundJs.mockImplementation(() => ({ remove, setPlayground }));

    const tree = renderer.create(<Playground ground={ground} />);

    expect(tree).toMatchSnapshot();
    expect(PlaygroundJs).toHaveBeenCalledTimes(1);
    expect(PlaygroundJs.mock.calls).toMatchSnapshot();
    expect(setPlayground).toHaveBeenCalledTimes(1);
    expect(setPlayground.mock.calls).toMatchSnapshot();

    tree.unmount();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls).toMatchSnapshot();
  });


  it('render empty', () => {
    const remove = jest.fn();
    const setPlayground = jest.fn();
    PlaygroundJs.mockImplementation(() => ({ remove, setPlayground }));

    const tree = renderer.create(<Playground ground={undefined} />);

    expect(tree).toMatchSnapshot();
    expect(PlaygroundJs).toHaveBeenCalledTimes(1);
    expect(PlaygroundJs.mock.calls).toMatchSnapshot();
    expect(setPlayground).toHaveBeenCalledTimes(0);

    tree.unmount();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls).toMatchSnapshot();
  });


  it('update playground', () => {
    const groundBefore = {
      ...ground,
      name: 'groundBefore',
    };
    const groundAfter = {
      ...ground,
      name: 'groundAfter',
    };
    const setPlayground = jest.fn();
    PlaygroundJs.mockImplementation(() => ({ setPlayground }));

    const tree = renderer.create(<Playground ground={groundBefore} />);

    expect(tree).toMatchSnapshot('update playground tree');
    expect(PlaygroundJs).toHaveBeenCalledTimes(1);
    expect(PlaygroundJs.mock.calls).toMatchSnapshot();
    expect(setPlayground).toHaveBeenCalledTimes(1);
    expect(setPlayground.mock.calls).toMatchSnapshot();

    // same ground if property not updated
    tree.update(<Playground ground={groundBefore} />);
    expect(PlaygroundJs).toHaveBeenCalledTimes(1);
    expect(setPlayground).toHaveBeenCalledTimes(1);

    // new ground
    tree.update(<Playground ground={groundAfter} />);

    expect(tree).toMatchSnapshot('update playground tree');
    expect(PlaygroundJs).toHaveBeenCalledTimes(1);
  });
});
