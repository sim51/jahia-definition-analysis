;(function(undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Packages initialization:
    sigma.utils.pkg('tank.settings');

    var settings = {

        // List all enabled panel
        panels : ['config', 'favorite', 'graph', 'history' ],
        components : ['codemirror', 'sigmajs'],

        // Neo4j url
        server : 'http://localhost:7474',

        // Force atlas2 algo default time
        forceAtlas2Time : 5000,

        // Table of field that can be used of label on graph
        field_named : ['title', 'name' , 'label']

    };

    // Export the previously designed settings:
    tank.settings = sigma.utils.extend(tank.settings || {}, settings);

}).call(this);
