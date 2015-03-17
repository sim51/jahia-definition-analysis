;(function (undefined) {
    'use strict';

    var __instances = {};

    var tank = function (conf) {

        // Private attributes:
        // *******************
        var _conf = conf || {}, i;

        this.settings = tank.settings;

        Object.defineProperty(this, 'components', {
            value: {},
            configurable: true
        });
        Object.defineProperty(this, 'panels', {
            value: tank.panels,
            configurable: true
        });

        // initiate components
        for (var component in this.settings.components) {
                //this.components[component] = new tank.components.classes}[component]();
        }

        // initiate panels
        for (i in this.settings.panels) {
            var name = this.settings.panels[i];
            this.panels[name] = new tank.panels.classes[name]();
        }

        var onClick = function () {
            document.getElementById('graph-tab').classList.remove('active');
            document.getElementById('favorite-tab').classList.remove('active');
            document.getElementById('history-tab').classList.remove('active');
            document.getElementById('config-tab').classList.remove('active');
            this.parentNode.classList.add('active');
        };

        // Panel navigation
        for (i = 0; i < document.getElementsByClassName('tabsheet-link').length; i++) {
            document.getElementsByClassName('tabsheet-link')[i].onclick = onClick;
        }

        return this;
    };

    /**
     * Returns a clone of the instances object or a specific running instance.
     *
     * @param  {?string} id Eventually an instance ID.
     * @return {object}     The related instance or a clone of the instances
     *                      object.
     */
    tank.instances = function (id) {
        return arguments.length ?
            __instances[id] :
            sigma.utils.extend({}, __instances);
    };

    /**
     * EXPORT:
     * *******
     */
    if (typeof this.tank !== 'undefined')
        throw 'An object called tank is already in the global scope.';

    this.tank = tank;

}).call(this);