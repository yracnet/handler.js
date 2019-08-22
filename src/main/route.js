/**
 * route graph:
 *      a -> b -> c1 -> d -> x
 *             -> c2 ---^ 
 *             -> c3 ---^ 
 * let graph = [
 *    { name: 'a', next: 'b'},
 *    { name: 'b', next: function(){return 'c1'}},
 *    { name: 'c1', next: 'd'},
 *    { name: 'c2', next: 'd'},
 *    { name: 'c3', next: 'd'},
 *    { name: 'd', next: 'x'},
 *    { name: 'x', next: null}
 * ];
 * let config = {
 *  start: 'a',
 *  name: 'name',
 *  next: 'next'
 * };
 * 
 * // Instance routeHandler
 * let route = routeHandler(graph, config);
 * // or
 * let route = routeHandler(graph, 'a');
 */
import _delegate from './util/delegate';
import _help from './util/help';
export default function routeHandler(_graph, _config) {
  //_graph = _help.validateGraph(_graph);
  _config = _help.validateGraphConfig(_config);
  let _state = {
    name: _config.start,
    node: _help.searchByAttr(_graph, _config.name, _config.start),
    stack: new Array()
  };
  let _function = {
    reset: function () {
      _state.name = _config.start;
      _state.node = _help.searchByAttr(_graph, _config.name, _state.name);
      _state.stack = new Array();
    },
    next: function () {
      if (_state.node) {
        let check = _state.node[_config.check] || true;
        check = typeof check === "function"? check(_state.name) : check;
        if(check){
          let next = _state.node[_config.next];
          next = typeof next === "function"? next(_state.name, _graph) : next;
          if(next != _state.name){
            _state.stack.push(_state.name);
            _state.name = next;
            _state.node = _help.searchByAttr(_graph, _config.name, _state.name);
          }
        }
      }
      return _state.node;
    },
    back: function () {
      _state.name = _state.stack.pop() || _config.start;
      _state.node = _help.searchByAttr(_graph, _config.name, _state.name);
      return _state.node;
    },
    name: function () {
      return _state.name;
    },
    node: function () {
      return _state.node;
    },
    tracer: function () {
      return _state.stack.slice();
    },
    first: function () {
      return _state.stack.length ===0;
    },
    last: function () {
      return _state.node != null && _state.node.next === undefined;
    }
  };
  return _delegate('routeHandler', _function, attr => attr === _state.name);
};
