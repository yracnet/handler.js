/**
 * let panel = panelHandler('a');
 * console.log('state: ', panel.a, panel.b, panel.c); //true, false, false
 * panel.open('b');
 * console.log('state: ', panel.a, panel.b, panel.c); //false, true, false
 * panel.open('c');
 * console.log('state: ', panel.a, panel.b, panel.c); //false, false, true
 * panel.back();
 * panel.back();
 * console.log('state: ', panel.a, panel.b, panel.c); //true, false, false
 */
import _delegate from './util/delegate';
export default function panelHandler(name) {
  let _state = {
    default: name || 'index',
    name: name || 'index',
    stack: new Array()
  };
  let _function = {
    open: function (name) {
      _state.stack.push(_state.name);
      _state.name = name;
    },
    back: function () {
      _state.name = _state.stack.pop() || _state.default;
    },
    name: function () {
      return _state.name;
    },
    tracer: function () {
      return _state.stack.slice();
    }
  };
  return _delegate('panelHandler', _function, attr => attr === _state.name);
};
