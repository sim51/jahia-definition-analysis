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

        server : 'http://localhost:7474',
        forceAtlas2Time : 50000
    };

    // Export the previously designed settings:
    tank.settings = sigma.utils.extend(tank.settings || {}, settings);

}).call(this);
