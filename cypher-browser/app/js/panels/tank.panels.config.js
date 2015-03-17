;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.config');

    /**
     * The init function.
     */
    tank.panels.classes.config = function () {
        // nothing to do
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.config.prototype.refresh = function() {
        // nothing to do
    };

    /**
     * The eventListerner function.
     */
    tank.panels.classes.config.prototype.eventListener = function(){
        var onclick = function() {
            for (var j = 0; j < document.getElementsByClassName('tank-settings').length; j++) {
                var name = document.getElementsByClassName('tank-settings')[j].getAttribute('id');
                var value = document.getElementsByClassName('tank-settings')[j].value;
                tank.settings[name] = value;
            }
        };

        // when sconfig value change, we reinit setting
        for (var j = 0; j < document.getElementsByClassName('tank-settings').length; j++) {
            document.getElementsByClassName('tank-settings')[j].onchange = onclick;
        }
    };


}).call(this);