/**
 * let crumb = crumbHandler('a');
 * console.log('state: ', crumb.a, crumb.b, crumb.c); //true, false, false
 * crumb.open('b');
 * console.log('state: ', crumb.a, crumb.b, crumb.c); //false, true, false
 * crumb.open('c');
 * console.log('state: ', crumb.a, crumb.b, crumb.c); //false, false, true
 * crumb.back();
 * crumb.back();
 * console.log('state: ', crumb.a, crumb.b, crumb.c); //true, false, false
 */
import _delegate from './util/delegate';

export default function crumbHandler(name) {
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
  return _delegate('crumbHandler', _function, attr => attr === _state.name);
};
