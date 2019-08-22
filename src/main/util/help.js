export default {
    routeVerify: function(graph) {
        graph = graph || [];
        return graph;
    },
    routeConfig: function(config) {
        if (typeof config === 'string') {
            config = {
                start: config
            };
        }
        return {
            start: config.start,
            name: config.name || 'name',
            next: config.next || 'next',
            check: config.check || true
        };
    },
    windowConfig: function(config) {
        if (typeof config === 'string') {
            config = {
                name: config
            };
        }
        return {
            name: config.name || 'id',
            check: config.check || true
        };
    },
    searchByAttr: function(list, attr, value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i][attr] === value) {
                return list[i];
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