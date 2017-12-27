import React from 'react';
import PropTypes from 'prop-types';

export default class Busy extends React.Component {
  static propTypes = { active: PropTypes.bool }
  static defaultProps = { active: false }

  render() {
    return !this.props.active ? null : (
      <div className="busy">
        <div className="alert alert-success">Loading ...</div>
        <div className="overlap" />
      </div>
    );
  }
}
