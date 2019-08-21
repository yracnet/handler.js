import _undefined from './undefined';
export default function (_name, _function, _delegate) {
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