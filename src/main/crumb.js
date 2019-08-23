/**
 * let crumb = crumbHandler();
 * crumb.open('b');
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
import _help from './util/help';

export default function crumbHandler(_config) {
    _config = _help.crumbConfig(_config);
    let _state = {
        node: undefined,
        stack: new Array()
    };
    let _function = {
        open: function(node) {
            if (typeof node !== "object") {
                return false;
            }
            let value = node[_config.attr];
            if (_function.isOpen(value)) {
                return false;
            }
            _state.stack.push(node);
            _state.node = node;
            return true;
        },
        back: function() {
            _state.stack.pop();
            _state.node = _state.stack.last() || _config.default;
        },
        go: function(index) {
            index = index >= 0 ? index : 0;
            _state.stack = _state.stack.slice(0, index + 1);
            _state.node = _state.stack.last() || _config.default;
        },
        name: function() {
            return _state.node ? _state.node[_config.attr] : undefined;
        },
        isOpen: function(value) {
            return _state.node && _state.node[_config.attr] === value;
        },
        node: function() {
            return _state.node;
        },
        length: function() {
            return _state.stack.length;
        },
        tracer: function(reverse) {
            return reverse ? _state.stack.slice().reverse() : _state.stack.slice();
        }
    };
    return _delegate('crumbHandler', _function, attr => _function.isOpen(attr));
};