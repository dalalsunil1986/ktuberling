import React from 'react';
import PropTypes from 'prop-types';


const NavbarButton = ({ disabled, onClick, text }) => (
  <li className={disabled ? 'disabled' : ''}>
    <a role="button" onClick={onClick}>{text}</a>
  </li>
);


NavbarButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};


NavbarButton.defaultProps = {
  disabled: false,
  onClick: () => {},
};


export default NavbarButton;
