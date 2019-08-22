export default {
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