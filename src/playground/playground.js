/* eslint-disable no-param-reassign */
import L from 'leaflet';
import Schematic from 'leaflet-schematic';
import xhr from 'xhr';
import { msg } from 'extra-log';

import PlaygroundItem from './layers/playgroundItem';


module.exports = L.Map.extend({

  options: {
    center: [0, 0],
    crs: L.Util.extend({}, L.CRS.Simple, { infinite: false }),
    editable: true,
    maxZoom: 4,
    minZoom: 0,
    scaleItem: 1.2,
    zoom: 1,
  },


  initialize(container, options = {}) {
    this._items = [];
    this._playgroundSchematic = undefined;
    this._playgroundData = undefined;

    L.Map.prototype.initialize.call(this, container, options);
    this.doubleClickZoom.disable();
  },


  setPlayground(playgroundData, clbck, context) {
    const file = `./assets/data/svg/${playgroundData.file}`;

    this._unsetPlayground();
    this._playgroundData = playgroundData;

    this._playgroundSchematic = new Schematic(file, {
      usePathContainer: true,
      weight: 0.25,
      useRaster: false,
      load(url, callback) {
        xhr({
          uri: url,
          headers: { 'Content-Type': 'image/svg+xml' },
        }, (err, resp, svg) => {
          callback(err, svg);
        });
      },
    })
      .once('load', (evt) => {
        const bounds = this._playgroundSchematic.getBounds();
        this.fitBounds(bounds, { animate: false });
        this._initItems();
        if (clbck) {
          clbck.call(context, evt);
        }
      }, this)
      .addTo(this);
  },


  _unsetPlayground() {
    this._removeItems();
    if (this._playgroundSchematic) {
      this.removeLayer(this._playgroundSchematic);
      this._playgroundSchematic = undefined;
    }
  },


  _removeItems() {
    this._items.forEach((item) => {
      this.removeLayer(item);
      item.remove();
    });
    this._items = [];
  },


  _initItems() {
    const container = this._playgroundSchematic._renderer._container;
    this._playgroundData.items.forEach((item) => {
      const node = container.getElementById(item.name);

      if (node) {
        node.parentNode.removeChild(node);
        const playgroundItem = new PlaygroundItem(node);
        this._items.push(playgroundItem);
        this.addLayer(playgroundItem);
      } else {
        msg(`No node for node [${item.name}]`);
      }
    });
  },

});
