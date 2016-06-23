const app = require('../');

describe('App', () => {
  it('init', () => {
    expect(app).toMatchSnapshot();
  });
});
