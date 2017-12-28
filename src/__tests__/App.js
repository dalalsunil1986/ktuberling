import React from 'react';
import renderer from 'react-test-renderer';
import xhr from 'xhr';
import { error as logError } from 'extra-log';

import App from '../App';

jest.mock('xhr', () => jest.fn());
jest.mock('extra-log', () => ({ error: jest.fn() }));

jest.mock('../app.less', () => ({}));
jest.mock('../components/Brand', () => 'Brand');
jest.mock('../components/Busy', () => 'Busy');
jest.mock('../components/NavbarButton', () => 'NavbarButton');
jest.mock('../components/Playground', () => 'Playground');

const findById = (id, json) => {
  let node = null;

  if (json.props.id === id) {
    node = json;
  } else if (json.children) {
    for (let ind = json.children.length - 1; 0 <= ind; --ind) {
      node = findById(id, json.children[ind]);
      if (node) {
        break;
      }
    }
  }

  return node;
};

describe('App', () => {
  const playgroundsData = `[
  {"name":"playground0","file":"file0.file","items":[]},
  {"name":"playground1","file":"file1.file","items":[]}
]`;


  beforeEach(() => {
    xhr.mockReset();
    logError.mockReset();
  });


  it('renders', () => {
    const tree = renderer.create(<App />);

    expect(tree).toMatchSnapshot();
  });


  it('loads play grounds and set first', () => {
    const tree = renderer.create(<App />);

    expect(xhr).toHaveBeenCalledTimes(1);
    expect(xhr.mock.calls).toMatchSnapshot();

    const callback = xhr.mock.calls[0][1];
    callback(undefined, undefined, playgroundsData);

    expect(tree).toMatchSnapshot();
  });


  it('loads play grounds and handles error', () => {
    const tree = renderer.create(<App />);

    expect(xhr).toHaveBeenCalledTimes(1);
    expect(xhr.mock.calls).toMatchSnapshot();

    const callback = xhr.mock.calls[0][1];
    callback(true, undefined, playgroundsData);

    expect(logError).toHaveBeenCalledTimes(1);
    expect(tree).toMatchSnapshot();
  });


  it('show playgrounds selection', () => {
    const tree = renderer.create(<App />);

    expect(xhr).toHaveBeenCalledTimes(1);
    expect(xhr.mock.calls).toMatchSnapshot();

    const callback = xhr.mock.calls[0][1];
    callback(undefined, undefined, playgroundsData);

    const li = findById('playgroundsSelector', tree.toJSON());
    li.props.onClick();
    expect(tree).toMatchSnapshot();
  });


  it('handle on playground item click and change playground', () => {
    const tree = renderer.create(<App />);

    expect(xhr).toHaveBeenCalledTimes(1);
    expect(xhr.mock.calls).toMatchSnapshot();

    const callback = xhr.mock.calls[0][1];
    callback(undefined, undefined, playgroundsData);

    const li = findById('playgroundsSelector', tree.toJSON());
    li.props.onClick();


    const clickbleItemInactive = findById('item_1', tree.toJSON());

    clickbleItemInactive.props.onClick();
    expect(tree).toMatchSnapshot('tree');
  });
});
