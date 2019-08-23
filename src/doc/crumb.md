
### Crumb
*  crumb:
```
a -> b -> c -> d
```
*  Use crumbHandler:
**  Config:
```javascript
let config = {attr: 'attrName'};
```
**  Instance:
```javascript
let crumb = crumbHandler(config);
```
**  Open:
```javascript
crumb.open({attrName: 'A'});
crumb.open({attrName: 'B'});
```
[<< Return](../../README.md)
[Example >>](https://yracnet.github.io/handler.js/src/example/crumb.html)
