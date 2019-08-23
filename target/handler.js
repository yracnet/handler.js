/*!
 * Copyright (c) 2019 Willyams Yujra <yracnet@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.handler = factory());
}(this, function () { 'use strict';

    var _undefined = {
        children: true,
        nodeName: true
    };

    function _delegate (_name, _function, _delegate) {
        let _handler = {
            set: function (target, attr, value) {
                console.warn('It is not allowed to assign values to attribute ' + _name + '()[' + attr + '] = ', value);
            },
            get: function (target, attr) {
                if (attr in _undefined) {
                    return undefined;
                }
                if (attr in target) {
                    return target[attr];
                }
                return _delegate(attr);
            }
        };
        return new Proxy(_function, _handler);
    }

    Array.prototype.last = Array.prototype.last || function() {
        return this[this.length - 1];
    };
    var _help = {
        routeVerify: function(graph) {
            graph = graph || [];
            return graph;
        },
        crumbConfig: function(config) {
            if (!config || typeof config === 'string') {
                config = {
                    attr: config
                };
            }
            return {
                default: config.default,
                attr: config.attr || 'name',
                next: config.next || 'next',
                check: config.check || true
            };
        },
        routeConfig: function(config) {
            if (!config || typeof config === 'string') {
                config = {
                    start: config
                };
            }
            return {
                start: config.start,
                attr: config.attr || 'name',
                next: config.next || 'next',
                check: config.check || true
            };
        },
        windowConfig: function(config) {
            if (!config || typeof config === 'string') {
                config = {
                    attr: config
                };
            }
            return {
                attr: config.attr || 'name',
                check: config.check || true
            };
        },
        searchByAttr: function(array, attr, value) {
            for (var i = 0; i < array.length; i++) {
                let o = array[i];
                if (o[attr] === value) {
                    return o;
                }
            }
            return undefined;
            //return list.filter(it => it[attr] === value)[0];
        },
        removeByAttr: function(list, attr, value) {
            for (var i = 0; i < list.length; i++) {
                if (list[i][attr] === value) {
                    return list[i];
                }
            }
            return undefined;
        }
    };

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

    function crumbHandler(_config) {
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
            tracer: function() {
                return _state.stack.slice();
            }
        };
        return _delegate('crumbHandler', _function, attr => _function.isOpen(attr));
    }

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

    function routeHandler(_graph, _config) {
        _config = _help.routeConfig(_config);
        let _state = {
            name: _config.start,
            node: _help.searchByAttr(_graph, _config.attr, _config.start),
            stack: new Array()
        };
        let _function = {
            reset: function() {
                _state.name = _config.start;
                _state.node = _help.searchByAttr(_graph, _config.attr, _state.name);
                _state.stack = new Array();
            },
            next: function() {
                if (_state.node) {
                    let check = _state.node[_config.check] || true;
                    check = typeof check === "function" ? check(_state.name) : check;
                    if (check) {
                        let next = _state.node[_config.next];
                        next = typeof next === "function" ? next(_state.name, _graph) : next;
                        if (next != _state.name) {
                            _state.stack.push(_state.name);
                            _state.name = next;
                            _state.node = _help.searchByAttr(_graph, _config.attr, _state.name);
                        }
                    }
                }
                return _state.node;
            },
            back: function() {
                _state.name = _state.stack.pop() || _config.start;
                _state.node = _help.searchByAttr(_graph, _config.attr, _state.name);
                return _state.node;
            },
            name: function() {
                return _state.name;
            },
            node: function() {
                return _state.node;
            },
            tracer: function() {
                return _state.stack.slice();
            },
            first: function() {
                return _state.stack.length === 0;
            },
            last: function() {
                return _state.node != null && _state.node.next === undefined;
            }
        };
        return _delegate('routeHandler', _function, attr => attr === _state.name);
    }

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

    function windowHandler(_config) {
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
    }

    //var { version } = require('../package.json');


    var main = {
        //version,
        windowHandler,
        crumbHandler,
        routeHandler
    };

    return main;

}));
