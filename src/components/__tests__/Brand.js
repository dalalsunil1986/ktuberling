import React from 'react';
import renderer from 'react-test-renderer';

import Brand from '../Brand';


describe('Brand', () => {
  it('render', () => {
    const tree = renderer.create(<Brand />);

    expect(tree).toMatchSnapshot();
  });
});
