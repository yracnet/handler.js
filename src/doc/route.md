### Route Graph
*  route graph:
```
a -> b -> c1 -> d -> x
       -> c2 ---^ 
       -> c3 ---^ 
```
*  graph:
```javascript
let graph = [
   { name: 'a', next: 'b'},
   { name: 'b', next: function(){return 'c1'}},
   { name: 'c1', next: 'd'},
   { name: 'c2', next: 'd'},
   { name: 'c3', next: 'd'},
   { name: 'd', next: 'x'},
   { name: 'x', next: null}
];
```
*  config:
```javascript
let config = {
 start: 'a',
 name: 'name',
 next: 'next'
};
```
*  Use routeHandler:
```javascript
let route = routeHandler(graph, config);
// or
let route = routeHandler(graph, 'a');
```
[<< Return](../../README.md)