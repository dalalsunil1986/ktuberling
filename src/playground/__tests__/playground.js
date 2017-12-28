/* global document */
import Schematic from 'leaflet-schematic';
import xhr from 'xhr';
import { msg } from 'extra-log';

import PlaygroundJs from '../playground';

jest.mock('extra-log', () => ({ msg: jest.fn() }));
jest.mock('xhr', () => jest.fn());
jest.mock('leaflet', () => ({
  Map: {
    extend: jest.fn(obj => () => {
      const extendedObj = {
        fitBounds: jest.fn(),
        doubleClickZoom: { disable: jest.fn() },
        removeLayer: jest.fn(),
        ...obj,
      };

      extendedObj.initialize();
      return extendedObj;
    }),
    prototype: { initialize: { call: jest.fn() } },
  },
  Util: { extend: jest.fn() },
  CRS: { Simple: 'Simple' },
}));
jest.mock('leaflet-schematic', () => jest.fn());

describe('App', () => {
  const playgroundData = {
    file: 'file',
    items: [],
  };


  beforeEach(() => {
    msg.mockReset();
    Schematic.mockReset();
    // eslint-disable-next-line no-unused-vars
    Schematic.mockImplementation((file, opts) => Schematic);
    // eslint-disable-next-line no-unused-vars
    Schematic.once = jest.fn((evt, clbck, context) => Schematic);
    Schematic.addTo = jest.fn(() => Schematic);
    Schematic.getBounds = jest.fn(() => 'schematic bounds');
    Schematic._renderer = { _container: { getElementById: jest.fn() } };
  });


  it('init', () => {
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref);

    expect(playground).toMatchSnapshot();
  });


  it('init with options', () => {
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref, {
      editable: false,
      maxZoom: 2,
      minZoom: 1,
      scaleItem: 2,
      zoom: 0,
    });
    playground.initialize();

    expect(playground).toMatchSnapshot();
  });


  it('set playground', () => {
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref);

    playground.setPlayground(playgroundData);

    expect(Schematic).toHaveBeenCalledTimes(1);
    expect(Schematic.mock.calls).toMatchSnapshot('Schematic call');

    expect(Schematic.once).toHaveBeenCalledTimes(1);
    expect(Schematic.once.mock.calls).toMatchSnapshot('Schematic.once call');

    const evt = 'load:evt';
    Schematic.once.mock.calls[0][1](evt);

    expect(playground.removeLayer).toHaveBeenCalledTimes(0);
  });


  it('set playground second time', () => {
    const playgroundDataNext = {
      file: 'fileNext',
      items: [],
    };
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref);

    playground.setPlayground(playgroundData);
    playground.setPlayground(playgroundDataNext);

    expect(playground.removeLayer).toHaveBeenCalledTimes(1);
  });


  it('set playground with callback', () => {
    const callback = { call: jest.fn() };
    const context = 'context';
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref);

    playground.setPlayground(playgroundData, callback, context);

    expect(Schematic).toHaveBeenCalledTimes(1);
    expect(Schematic.mock.calls).toMatchSnapshot('Schematic call');

    Schematic.once.mock.calls[0][1]('load:evt');

    expect(callback.call).toHaveBeenCalledTimes(1);
    expect(callback.call.mock.calls).toMatchSnapshot('callback');
  });


  it('set playground handles schematic load', () => {
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref);

    playground.setPlayground(playgroundData);

    const schematicLoad = Schematic.mock.calls[0][1].load;
    const url = 'url';
    const callback = jest.fn();
    schematicLoad(url, callback);

    expect(xhr).toHaveBeenCalledTimes(1);
    expect(xhr.mock.calls).toMatchSnapshot('xhr');

    xhr.mock.calls[0][1]('rxr', 'resp', 'svg');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls).toMatchSnapshot('load callback');
  });


  it('Init items', () => {
    const playgroundDataWithItems = {
      file: 'fileNext',
      items: [
        { name: 'itemWithNode' },
        { name: 'itemWithoutNode' },
      ],
    };
    const ref = document.createElement('div');
    const playground = new PlaygroundJs(ref);
    const node = {
      parentNode: {
        removeChild: jest.fn(),
      },
    };
    Schematic._renderer = {
      _container: {
        getElementById: name => ('itemWithNode' === name ? node : undefined),
      },
    };

    playground.setPlayground(playgroundDataWithItems);
    Schematic.once.mock.calls[0][1]('load:evt');

    expect(node.parentNode.removeChild).toHaveBeenCalledTimes(1);
    expect(node.parentNode.removeChild.mock.calls)
      .toMatchSnapshot('removeChild');
    expect(msg).toHaveBeenCalledTimes(1);
    expect(msg.mock.calls).toMatchSnapshot('no node msg');
  });
});
