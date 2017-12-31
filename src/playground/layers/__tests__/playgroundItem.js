import PlaygroundItem from '../playgroundItem';

// L.Polygon.extend
jest.mock('leaflet', () => ({
  Polygon: {
    extend: jest.fn(obj => (...args) => {
      const extendedObj = {
        ...obj,
      };

      extendedObj.initialize(...args);
      return extendedObj;
    }),
  },
}));

jest.mock('extra-log', () => ({ msg: jest.fn() }));

describe('App', () => {
  const node = { _name: 'node' };


  it('Init', () => {
    const item = new PlaygroundItem(node);

    expect(item).toMatchSnapshot();
  });


  it('remove', () => {
    const item = new PlaygroundItem(node);

    item.remove();

    expect(item).toMatchSnapshot();
  });


  it('onAdd', () => {
    const map = { _name: 'map' };
    const item = new PlaygroundItem(node);
    item.onAdd(map);
  });


  it('onRemove', () => {
    const map = { _name: 'map' };
    const item = new PlaygroundItem(node);
    item.onRemove(map);
  });
});
