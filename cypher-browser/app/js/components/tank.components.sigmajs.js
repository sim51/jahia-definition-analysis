;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.components');

    // init sigmajs
    tank.components.sigmajs = new sigma({
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        }
    });

}).call(this);