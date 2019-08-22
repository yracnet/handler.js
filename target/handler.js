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
    function panelHandler(name) {
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
    }

    var _help = {
        validateGraph: function (graph) {
            graph = graph || [];
            return graph;
        },
        validateGraphConfig: function (config) {
            if (typeof config === 'string') {
                config = {
                    start: config,
                    name: 'name',
                    next: 'next'
                };
            }
            return {
                start: config.start,
                name: config.name || 'name',
                next: config.next || 'next'
            };
        },
        searchByAttr: function (list, attr, value) {
            for (var i = 0; i < list.length; i++) {
              if (list[i][attr] === value) {
                return list[i];
              }
            }
            return undefined;
            //return list.filter(it => it[attr] === value)[0];
        }
    };

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
      //_graph = _help.validateGraph(_graph);
      _config = _help.validateGraphConfig(_config);
      let _state = {
        name: _config.start,
        node: _help.searchByAttr(_graph, _config.name, _config.start),
        stack: new Array()
      };
      let _function = {
        restart: function () {
          _state.name = _config.start;
          _state.node = _help.searchByAttr(_graph, _config.name, _state.name);
          _state.stack = new Array();
        },
        next: function () {
          if (_state.node) {
            let next = _state.node[_config.next];
            if (typeof next === "function") {
              next = next(_state.name, _graph);
            }
            _state.stack.push(_state.name);
            _state.name = next;
            _state.node = _help.searchByAttr(_graph, _config.name, _state.name);
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
        }
      };
      return _delegate('routeHandler', _function, attr => attr === _state.name);
    }

    //var { version } = require('../package.json');

    var main = {
      //version,
      panelHandler,
      routeHandler
    };

    return main;

}));
