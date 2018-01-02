/* eslint-disable import/no-extraneous-dependencies */
/* global document */

import React from 'react';
import ReactDom from 'react-dom';
import DomEvents from 'dom-events-mocking';

import './specs.less';
import App from '../src/App';

describe('UI', () => {
  let events;
  let container;

  beforeEach(() => {
    events = new DomEvents();
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);

    ReactDom.render(<App />, container);
  });


  afterEach(() => {
    container.parentNode.removeChild(container);
    container = undefined;
  });


  it('Open/close playground selection', (done) => {
    const btn = document.getElementById('playgroundsSelector');
    const li = document.getElementById('playgroundsSelector');

    events
      .exec(() => {
        const classes = li.className.split(' ');
        expect(classes.length).toBe(1);
        expect(classes[0]).toBe('dropdown');
      })
      .click(btn)
      .exec(() => {
        const classes = li.className.split(' ');
        expect(classes.length).toBe(2);
        expect(classes[0]).toBe('dropdown');
        expect(classes[1]).toBe('open');
      })
      .click(btn)
      .exec(() => {
        const classes = li.className.split(' ');
        expect(classes.length).toBe(1);
        expect(classes[0]).toBe('dropdown');
      })
      .wait(500)
      .done(done);
  });

  it('Change playground', (done) => {
    const btn = document.getElementById('playgroundsSelector');
    const li = document.getElementById('playgroundsSelector');
    const menu = document.querySelector('#playgroundsSelector .dropdown-menu');

    events
      .click(btn)
      .wait(100)
      .exec(() => {
        const classes = li.className.split(' ');
        expect(classes.length).toBe(2);
        expect(classes[0]).toBe('dropdown');
        expect(classes[1]).toBe('open');
      })
      .wait(100)
      .click(() => {
        const items = menu.querySelectorAll('li');
        return items[0].querySelector('a');
      })
      .wait(500)
      .click(() => {
        const items = menu.querySelectorAll('li');
        return items[1].querySelector('a');
      })
      .wait(500)
      .click(() => {
        const items = menu.querySelectorAll('li');
        return items[2].querySelector('a');
      })
      .wait(500)
      .click(() => {
        const items = menu.querySelectorAll('li');
        return items[3].querySelector('a');
      })
      .wait(500)
      .click(() => {
        const items = menu.querySelectorAll('li');
        return items[4].querySelector('a');
      })
      .done(done);
  });
});
