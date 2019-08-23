Array.prototype.last = Array.prototype.last || function() {
    return this[this.length - 1];
}
export default {
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