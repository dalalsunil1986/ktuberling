import L from 'leaflet';
import { msg } from 'extra-log';

module.exports = L.Polygon.extend({

  options: {
    className: 'playground-item',
    highlightColor: 'grey',
  },


  initialize(node) {
    msg('initialize');
    this._node = node;
  },


  remove() {
    msg('===> remove');
    this._node = undefined;
  },


  onAdd(map) {
    msg('PlaygroundItem.onAdd', map, this._node);
  },


  onRemove(map) {
    msg('PlaygroundItem.onRemove', map);
  },
});
