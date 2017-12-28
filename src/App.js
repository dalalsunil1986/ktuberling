import React from 'react';
import xhr from 'xhr';
import { error } from 'extra-log';

import './app.less';

import Brand from './components/Brand';
import Busy from './components/Busy';
import NavbarButton from './components/NavbarButton';
import Playground from './components/Playground';


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
    this._loadPlaygrounds();
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
          loading: false,
          playgrounds: JSON.parse(data),
          activePlayground: 0,
        });
      }
    });
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
      <li id={`item_${ind}`} key={ind} onClick={this._onPlaygroundItem.bind(this, playground, ind)}>
        <a href="#">{playground.name}</a>
      </li>
    ), this);
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
                <li id="playgroundsSelector" className={playgroundsClass} onClick={this._onPlayground}>
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
          <Playground ground={state.playgrounds[state.activePlayground]} />
          <Busy active={state.loading} />
        </div>
      </div>
    );
  }
}
