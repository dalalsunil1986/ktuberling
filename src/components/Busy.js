/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';

const Busy = ({ active }) => {
  return !active ? null : (
    <div className="busy">
      <div className="alert alert-success">Loading ...</div>
      <div className="overlap" />
    </div>
  );
};

Busy.propTypes = { active: PropTypes.bool };

export default Busy;
