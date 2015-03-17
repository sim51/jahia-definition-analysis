;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.graph');

    /**
     * The init function.
     */
    tank.panels.classes.graph  = function(tank) {
        this.labels = [];
        this.types = [];

        // init object by calling refresh method
        var _self = this;

        // When a query is executed, we save it into history
        window.addEventListener( 'graph-data-loaded', _self.refresh, false );
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.graph.prototype.refresh = function() {

        // update stats data
        document.getElementById('numberOfNode').innerHTML = '' + tank.components.sigmajs.graph.nodes().length;
        document.getElementById('numberOfEdge').innerHTML = '' + tank.components.sigmajs.graph.edges().length;

        // update labels
        sigma.neo4j.getLabels(tank.settings.server, tank.instance().panels.graph.displayLabels);
        // update types
        sigma.neo4j.getTypes(tank.settings.server, tank.instance().panels.graph.displayTypes);

        tank.instance().panels.graph.eventListener();
    };

    /**
     * The eventListerner function.
     */
    tank.panels.classes.graph.prototype.eventListener = function(){
        // Nothing for now
    };

    /**
     * Function that display labels in graph panel.
     * It is used as a cllback function for sigma.neo4j.getLabels.
     *
     * @param labels {Array of String}  Array of label
     */
    tank.panels.classes.graph.prototype.displayLabels = function(labels) {
        var i = 0, html = '';
        for (i; i < labels.length; i++) {
            html += "<li>" + labels[i] + "</li>";
        }
        document.getElementById('labels').innerHTML = html;
    };

    /**
     * Function that display types in graph panel.
     * It is used as a cllback function for sigma.neo4j.getTypes.
     *
     * @param types {Array of String}  Array of type
     */
    tank.panels.classes.graph.prototype.displayTypes = function (types) {
        var i = 0, html = '';
        for (i; i < types.length; i++) {
            html += "<li>" + types[i] + "</li>";
        }
        document.getElementById('types').innerHTML = html;
    };

}).call(this);