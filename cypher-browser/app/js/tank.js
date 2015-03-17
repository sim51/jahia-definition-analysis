;(function (undefined) {
    'use strict';

    var __instance = {};

    var tank = function (conf) {

        // Private attributes:
        // =======================
        var _self = this, _conf = conf || {}, i;

        this.query = 'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100';
        this.settings = tank.settings;

        Object.defineProperty(this, 'components', {
            value: tank.components,
            configurable: true
        });
        Object.defineProperty(this, 'panels', {
            value: tank.panels,
            configurable: true
        });

        // initiate components
        var name;
        for (i in  this.settings.components) {
            name = this.settings.components[i];
            this.components[name] = new tank.components.classes[name]();
        }

        // initiate panels
        for (i in this.settings.panels) {
            name = this.settings.panels[i];
            this.panels[name] = new tank.panels.classes[name](_self);
        }

        // Panel navigation
        // ========================
        // FIXME : be more generic
        var onClick = function () {
            document.getElementById('graph-tab').classList.remove('active');
            document.getElementById('favorite-tab').classList.remove('active');
            document.getElementById('history-tab').classList.remove('active');
            document.getElementById('config-tab').classList.remove('active');
            this.parentNode.classList.add('active');
        };
        for (i = 0; i < document.getElementsByClassName('tabsheet-link').length; i++) {
            document.getElementsByClassName('tabsheet-link')[i].onclick = onClick;
        }

        // Register event onclick on the run button
        document.getElementById('run').onclick = function () {
            _self.executeQuery();
        };

        __instance = this;

    };

    /**
     * Execute the current cypher query.
     */
    tank.prototype.executeQuery = function () {
        tank.components.sigmajs.graph.clear();
        tank.components.sigmajs.refresh();
        sigma.neo4j.cypher(
            this.settings.server,
            this.query,
            this.components.sigmajs,
            this.onGraphDataLoaded
        );

        // Dispatch the 'run-query' event
        window.dispatchEvent(new Event("run-query"));

    };

    /**
     * Callback function for sigma & neo4j execute cypher method.
     *
     * @param s {Sigma} The sigmajs instance
     * @param g {Graph} The graph object representation
     */
    tank.prototype.onGraphDataLoaded = function(s, g) {
        s.startForceAtlas2({
            linLogMode: false,
            outboundAttractionDistribution: false,
            adjustSizes: true,
            edgeWeightInfluence: 0,
            scalingRatio: 1,
            strongGravityMode: false,
            gravity: 1,
            slowDown: 1,
            barnesHutOptimize: false,
            barnesHutTheta: 0.5,
            startingIterations: 1,
            iterationsPerRender: 1
        });
        s.refresh();
        window.setTimeout(function() {
            tank.components.sigmajs.stopForceAtlas2();
        }, tank.settings.forceAtlas2Time, s);

        // Dispatch the 'run-query' event
        window.dispatchEvent(new Event("graph-data-loaded"));
    };

    /**
     * Returns a clone of the instances object or a specific running instance.
     *
     * @param  {?string} id Eventually an instance ID.
     * @return {object}     The related instance or a clone of the instances
     *                      object.
     */
    tank.instance = function () {
        return __instance;
    };

    /**
     * EXPORT:
     * *******
     */
    if (typeof this.tank !== 'undefined')
        throw 'An object called tank is already in the global scope.';

    this.tank = tank;

}).call(this);