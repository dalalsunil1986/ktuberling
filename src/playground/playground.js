/* eslint-disable no-param-reassign */
import L from 'leaflet';
import Schematic from 'leaflet-schematic';
import xhr from 'xhr';
import { msg } from 'extra-log';


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
    this._playground = null;
    this._playgroundData = null;

    L.Map.prototype.initialize.call(this, container, options);
    this.doubleClickZoom.disable();
  },


  setPlayground(playgroundData, clbck, context) {
    const file = `./assets/data/svg/${playgroundData.file}`;

    this._unsetPlayground();
    this._playgroundData = playgroundData;

    this._playground = new Schematic(file, {
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
    }).once('load', function load(evt) {
      this.fitBounds(this._playground.getBounds(), { animate: false });
      this._initItems();
      if (clbck) {
        clbck.call(context, evt);
      }
    }, this).addTo(this);
  },


  _unsetPlayground() {
    if (this._playground) {
      this.removeLayer(this._playground);
      this._playground = null;
    }
  },


  _initItems() {
    const container = this._playground._renderer._container;

    this._playgroundData.items.forEach((item) => {
      const node = container.getElementById(item.name);

      if (node) {
        node.parentNode.removeChild(node);
        // msg('add playgroundItem for node ', node);
      } else {
        msg('No node for', item.name);
      }
    });
  },


  _getPlaygroundItem(evt) {
    const container = evt.target._container;
    let node = evt.originalEvent.target;
    let item = null;

    while (node !== container && null !== node) {
      if (node.classList.contains('clickable')) {
        item = node;
        break;
      } else {
        node = node.parentNode;
      }
    }

    return item;
  },

});
