jest.mock('react-dom', () => ({ render: jest.fn() }));
jest.mock('../App', () => 'App');

const ReactDom = require('react-dom');

require('../index');

describe('Index', () => {
  it('init', () => {
    expect(ReactDom.render).toHaveBeenCalledTimes(1);
    expect(ReactDom.render.mock.calls).toMatchSnapshot();
  });
});
