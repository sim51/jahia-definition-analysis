;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.graph');

    /**
     * The init function.
     */
    tank.panels.classes.graph  = function() {
        this.labels = [];
        this.types = [];
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.graph.prototype.refresh = function() {

        // update stats data
        document.getElementById('numberOfNode').innerHTML = '' + tank.component.sigma.graph.nodes().length;
        document.getElementById('numberOfEdge').innerHTML = '' + tank.component.sigma.graph.edges().length;

        // update labels
        sigma.neo4j.getLabels(tank.settings.server, tank.panels.graph.displayLabels);
        // update types
        sigma.neo4j.getTypes(tank.settings.server, tank.panels.graph.displayTypes);

        this.eventListener();

    };

    /**
     * The eventListerner function.
     */
    tank.panels.classes.graph.prototype.eventListener = function(){
        // Nothing for now
    };

    /**
     * Function that display labels in graph panel.
     *
     * @param labels {Array of String}  Array of label
     */
    tank.panels.classes.graph.prototype.displayLabels = function() {
        var i = 0, html = '';
        for (i; i < this.labels.length; i++) {
            html += "<li>" + this.labels[i] + "</li>";
        }
        document.getElementById('labels').innerHTML = html;
    };

    /**
     * Function that display types in graph panel.
     *
     * @param types {Array of String}  Array of type
     */
    tank.panels.classes.graph.prototype.displayTypes = function () {
        var i = 0, html = '';
        for (i; i < this.types.length; i++) {
            html += "<li>" + this.types[i] + "</li>";
        }
        document.getElementById('types').innerHTML = html;
    };

}).call(this);