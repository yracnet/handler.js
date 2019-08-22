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
        count: 1,
        node: undefined,
        stack: new Array()
    };
    let _function = {
        open: function(node) {
            if (!node) {
                return false;
            }
            let value = typeof node === "object" ? node[_config.attr] : node;
            node = typeof node === "object" ? node : _help.searchByAttr(_state.stack, _config.attr, value);
            if (!node || !value || (_state.node && value === _state.node[_config.attr])) {
                return false;
            }
            if (!node.$order) {
                node.$order = _state.count++;
            }
            _state.stack = _state.stack.filter(o => o[_config.attr] !== value);
            _state.stack.push(node);
            _state.node = node;
            return true;
        },
        close: function(node) {
            if (node) {
                //remove $order
                let value = typeof node === "object" ? node[_config.attr] : node;
                _state.stack.filter(o => o[_config.attr] === value).forEach(o => delete o.$order);
                //remove object
                _state.stack = _state.stack.filter(o => o[_config.attr] !== value);
                _state.node = _state.stack[_state.stack.length - 1];
            } else {
                //remove $order
                let o = _state.stack[_state.stack.length - 1];
                delete o.$order;
                //remove object
                _state.stack.pop();
                _state.node = _state.stack[_state.stack.length - 1];
            }
        },
        node: function() {
            return _state.node;
        },
        name: function() {
            return _state.node ? _state.node[_config.attr] : undefined;
        },
        length: function() {
            return _state.stack.length;
        },
        sort: function() {
            return _state.stack.slice().sort(function(a, b) { return a.$order - b.$order });
        },
        tracer: function() {
            return _state.stack.slice();
        }
    };
    return _delegate('windowHandler', _function, attr => _state.node && attr && attr === _state.node[_config.attr]);
};