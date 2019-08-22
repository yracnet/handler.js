/**
 * let window = windowHandler({name: 'id'});
 * console.log('state: ', window.a, window.b, window.c); //false, false, false
 * window.open({id:'a'});
 * console.log('state: ', window.a, window.b, window.c); //true, false, false
 * window.open({id:'b'});
 * console.log('state: ', window.a, window.b, window.c); //false, true, false
 * window.open({id:'c'});
 * console.log('state: ', window.a, window.b, window.c); //false, false, true
 * window.back();
 * window.back();
 * console.log('state: ', window.a, window.b, window.c); //true, false, false
 * window.back();
 * console.log('state: ', window.a, window.b, window.c); //false, false, false
 */
import _delegate from './util/delegate';
import _help from './util/help';

export default function windowHandler(_config) {
    _config = _help.windowConfig(_config);
    let _state = {
        node: undefined,
        stack: new Array()
    };
    let _function = {
        open: function(node) {
            if (!node) {
                return false;
            }
            let name = typeof node === "object" ? node[_config.name] : node;
            node = typeof node === "object" ? node : _help.searchByAttr(_state.stack, _config.name, name);
            if (name === _state.node[_config.name] || !node || !name) {
                return false;
            }
            _state.stack = _state.stack.filter(i => i[_config.name] !== name);
            _state.stack.push(_state.node);
            _state.node = node;
            return true;
        },
        close: function(name) {
            //_state.window = _state.stack.pop();
        },
        back: function() {
            _state.node = _state.stack.pop();
        },
        node: function() {
            return _state.node;
        },
        tracer: function() {
            return _state.stack.slice();
        }
    };
    return _delegate('windowHandler', _function, attr => _state.node && attr && attr === _state.node[_config.name]);
};