import React from 'react';
import renderer from 'react-test-renderer';

import Busy from '../Busy';


describe('Busy', () => {
  it('render', () => {
    const tree = renderer.create(<Busy />);

    expect(tree).toMatchSnapshot();
  });

  it('render active', () => {
    const tree = renderer.create(<Busy active/>);

    expect(tree).toMatchSnapshot();
  });
});
