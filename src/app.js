import React from 'react';
import xhr from 'xhr';
import { error } from 'extra-log';

import './app.less';

import Brand from './components/brand';
import Busy from './components/busy';
import NavbarButton from './components/navbarButton';
import Playground from './playground/playground';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePlayground: null,
      loading: true,
      playgrounds: [],
      showPlaygroundsSelection: false,
    };
  }


  componentDidMount() {
    this._playground = new Playground(this._playgroundRef);
    this._loadPlaygrounds();
  }


  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.activePlayground !== this.state.activePlayground) {
      this._setPlayground();
    }
  }


  _loadPlaygrounds() {
    const url = 'assets/data/playgrounds.json';

    xhr({
      headers: { 'Content-Type': 'application/json' },
      uri: url,
    }, (err, resp, data) => {
      if (err) {
        // TODO: handle error
        error('Error loading playgrounds');
      } else {
        this.setState({
          playgrounds: JSON.parse(data),
          activePlayground: 0,
        });
      }
    });
  }


  _setPlayground = () => {
    const playground = this.state.playgrounds[this.state.activePlayground];

    this.setState({ loading: true });
    this._playground.setPlayground(playground, () => {
      this.setState({ loading: false });
    }, this);
  }


  _onPlayground = () => {
    this.setState({
      showPlaygroundsSelection: !this.state.showPlaygroundsSelection,
    });
  }


  _onPlaygroundItem = (playground, ind) => {
    this.setState({ activePlayground: ind });
  }


  _playgrounds() {
    return this.state.playgrounds.map((playground, ind) => (
      <li key={ind} onClick={this._onPlaygroundItem.bind(this, playground, ind)}>
        <a href="#">{playground.name}</a>
      </li>
    ), this);
  }


  _setRef = (ref) => {
    this._playgroundRef = ref;
  }


  render() {
    const { state } = this;
    const playgroundsClass =
      `dropdown${state.showPlaygroundsSelection ? ' open' : ''}`;

    return (
      <div className="app">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <Brand />
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <NavbarButton disabled text="New" />
                <NavbarButton disabled text="Save" />
                <NavbarButton disabled text="Print" />
                <NavbarButton disabled text="Undo" />
                <NavbarButton disabled text="Redo" />
                <li className={playgroundsClass} onClick={this._onPlayground}>
                  <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Playground <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    {this._playgrounds()}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container">
          <div ref={this._setRef} className="playground" />
          <Busy active={state.loading} />
        </div>
      </div>
    );
  }
}
