import React from 'react';
import renderer from 'react-test-renderer';

import NavbarButton from '../NavbarButton';


describe('NavbarButton', () => {
  it('render', () => {
    const tree = renderer.create(<NavbarButton text="text" />);

    expect(tree).toMatchSnapshot();
  });


  it('render disabled', () => {
    const tree = renderer.create(<NavbarButton disabled text="disabled" />);

    expect(tree).toMatchSnapshot();
  });


  it('onClick default', () => {
    const tree = renderer.create(
      <NavbarButton text="text" />,
    );

    tree.toJSON().children[0].props.onClick();

    expect(tree).toMatchSnapshot();
  });
});
