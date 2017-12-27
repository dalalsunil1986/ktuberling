/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';

import PlaygroundJs from '../playground/playground';


export default class Playground extends React.Component {
  static propTypes = { ground: PropTypes.object }
  static defaultProps = { ground: undefined }


  constructor(props) {
    super(props);
    this.state = { loading: true };
  }


  _setPlayground = (playground) => {
    if (!playground) {
      return;
    }

    this._playground.setPlayground(playground);
  }


  _setRef = (ref) => {
    this._playgroundRef = ref;
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.ground !== nextProps.ground) {
      this._setPlayground(nextProps.ground);
    }
  }


  shouldComponentUpdate() {
    return false;
  }


  componentDidMount() {
    this._playground = new PlaygroundJs(this._playgroundRef);
    this._setPlayground(this.props.ground);
  }


  componentWillUnmount() {
    this._playground.remove();
    this._playground = undefined;
  }


  render() {
    return (
      <div ref={this._setRef} className="playground" />
    );
  }
}
