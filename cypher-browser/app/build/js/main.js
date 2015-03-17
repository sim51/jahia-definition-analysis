;(function (undefined) {
    'use strict';

    if (typeof sigma === 'undefined')
        throw 'sigma is not declared';

    // Declare cypher package
    sigma.utils.pkg("sigma.neo4j");

    // Initialize package:
    sigma.utils.pkg('sigma.utils');
    sigma.utils.pkg('sigma.parsers');


    /**
     * This function execute a cypher and creates a new sigma instance or
     * updates the graph of a given instance. It is possible to give a callback
     * that will be executed at the end of the process.
     *
     * @param  {string}       url      The URL of neo4j server.
     * @param  {string}       cypher   The cypher query
     * @param  {object|sigma} sig      A sigma configuration object or a sigma
     *                                 instance.
     * @param  {?function}    callback Eventually a callback to execute after
     *                                 having parsed the file. It will be called
     *                                 with the related sigma instance as
     *                                 parameter.
     */
    sigma.neo4j.cypher = function (url, cypher, sig, callback) {
        var graph = { nodes: [], edges: [] },
            xhr = sigma.utils.xhr(),
            neo4jTransactionEndPoint = url + '/db/data/transaction/commit';

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';

        var data = {
            "statements": [
                {
                    "statement": cypher,
                    "resultDataContents": ["graph"],
                    "includeStats": false
                }
            ]
        };

        xhr.open('POST', neo4jTransactionEndPoint, true);
        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {
                var neo4jResult = JSON.parse(xhr.responseText);

                graph =  sigma.neo4j.cypher_parse(neo4jResult);

                // Update the instance's graph:
                if (sig instanceof sigma) {
                    sig.graph.clear();
                    sig.graph.read(graph);

                    // ...or instantiate sigma if needed:
                } else if (typeof sig === 'object') {
                    sig.graph = graph;
                    sig = new sigma(sig);

                    // ...or it's finally the callback:
                } else if (typeof sig === 'function') {
                    callback = sig;
                    sig = null;
                }

                // Call the callback if specified:
                if (callback)
                    callback(sig || graph);
            }
        };

        var postData = JSON.stringify(data);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(postData);
    };

    /**
     * This function parse a neo4j cypher query result.
     *
     * @param  {object}       neo4jResult The URL of neo4j server.
     *
     * @return A graph object
     */
    sigma.neo4j.cypher_parse = function(neo4jResult) {
        var graph = { nodes: [], edges: [] },
            nodesMap = {},
            edgesMap = {},
            key;

        // Iteration on all result data
        neo4jResult.results[0].data.forEach(function (data, index, ar) {

            // iteration on graph for all node
            data.graph.nodes.forEach(function (node, index, ar) {

                var sigmaNode = node.properties;
                sigmaNode.id = node.id;
                sigmaNode.label = node.id;
                sigmaNode.labels = node.labels;
                sigmaNode.x = Math.random();
                sigmaNode.y = Math.random();
                sigmaNode.size = 0;
                sigmaNode.color = '#000000';

                if (sigmaNode.id in nodesMap) {
                    // do nothing
                } else {
                    nodesMap[sigmaNode.id] = sigmaNode;
                }
            });

            // iteration on graph for all node
            data.graph.relationships.forEach(function (edge, index, ar) {
                var sigmaEdge = edge.properties;
                sigmaEdge.id = edge.id;
                sigmaEdge.type = edge.type;
                sigmaEdge.source = edge.startNode;
                sigmaEdge.target = edge.endNode;
                sigmaEdge.color = '#7D7C8E';

                if (sigmaEdge.id in edgesMap) {
                    // do nothing
                } else {
                    edgesMap[sigmaEdge.id] = sigmaEdge;
                }
            });

        });

        // construct sigma nodes
        for (key in nodesMap) {
            graph.nodes.push(nodesMap[key]);
        }
        // construct sigma nodes
        for (key in edgesMap) {
            graph.edges.push(edgesMap[key]);
        }

        return graph;
    };

    /**
     * This function call neo4j to get all labels of the graph.
     *
     * @param  {string}       server      The URL of neo4j server.
     *
     * @return An array of label
     */
    sigma.neo4j.getLabels = function(server, callback) {
        var xhr = sigma.utils.xhr(),
            url;

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';
        url = server + '/db/data/labels';

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Call the callback if specified:
                if (callback)
                    callback(JSON.parse(xhr.responseText).sort());
            }
        };
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send();
    };

    /**
     * This function parse a neo4j cypher query result.
     *
     * @param  {string}       server      The URL of neo4j server.
     *
     * @return An array of relationship type
     */
    sigma.neo4j.getTypes = function(server, callback) {
        var xhr = sigma.utils.xhr(),
            url;

        if (!xhr)
            throw 'XMLHttpRequest not supported, cannot load the file.';
        url = server + '/db/data/relationship/types';

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Call the callback if specified:
                if (callback)
                    callback(JSON.parse(xhr.responseText).sort());
            }
        };
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send();
    };

}).call(this);

    

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

;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.components.classes.codemirror');

    // init codemirror
    tank.components.classes.codemirror = function() {

        var editor = CodeMirror.fromTextArea(document.getElementById('cypher-query'), {
            lineNumbers: true,
            indentWithTabs: true,
            smartIndent: true,
            mode: "cypher",
            theme: "neo"
        });

        // Adding some key map that permit to run & save the query.
        editor.addKeyMap(
            {
                "Ctrl-Enter": function () {
                    tank.instance().executeQuery();
                },
                "Alt-Enter": function () {
                    tank.instance().executeQuery();
                }
            },
            false
        );
        return editor;
    };

}).call(this);
;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.components.classes.sigmajs');

    // init sigmajs
    tank.components.classes.sigmajs = function() {
        var s = new sigma({
            renderer: {
                container: document.getElementById('graph-container'),
                type: 'canvas'
            }
        });

        return s;
    };

}).call(this);
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
        // init object by calling refresh method
        var _self = this;
        _self.refresh();
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.config.prototype.refresh = function() {
        for(var key in tank.settings ) {
            if (document.getElementById(key)) {
                document.getElementById(key).value = tank.settings[key];
            }
        }
    };

    /**
     * The eventListerner function.
     */
    tank.panels.classes.config.prototype.eventListener = function(){
        var onclick = function() {
            for (var j = 0; j < document.getElementsByClassName('tank-settings').length; j++) {
                var name = document.getElementsByClassName('tank-settings')[j].getAttribute('id');
                var value = document.getElementsByClassName('tank-settings')[j].value;
                tank.instance().settings[name] = value;
                alert(tank.settings);
            }
        };

        // when sconfig value change, we reinit setting
        for (var j = 0; j < document.getElementsByClassName('tank-settings').length; j++) {
            document.getElementsByClassName('tank-settings')[j].onchange = onclick;
        }
    };


}).call(this);
;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.favorite');

    /**
     * The init function.
     */
    tank.panels.classes.favorite = function (tank) {
        this.list = [];

        // init object by calling refresh method
        var _self = this;
        _self.refresh();
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.favorite.prototype.refresh = function () {

        var i = 0, html = '';
        for (i; i < this.list.length; i++) {
            html += "<li><a href=\"#\" class=\"favorite-query\" data-query-id=\"" + i + "\">" + this.list[i].display + "</a></li>";
        }
        document.getElementById('favorite-list').innerHTML = html;

        // calling the listner after a refresh
        this.eventListener();

    };

    /**
     * The eventListerner function
     */
    tank.panels.classes.favorite.prototype.eventListener = function () {

        // When we click on save
        // =======================
        document.getElementById('save').onclick = function () {

            // adding the current query to favorite
            tank.instance().panels.favorite.list.push({
                query: tank.instance().components.codemirror.getValue(),
                display: tank.instance().components.codemirror.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
            });

            tank.instance().panels.favorite.refresh();
        };

        // Click on an favorite query
        // ===========================
        var onclick = function() {
            var id = this.getAttribute("data-query-id");
            tank.instance().components.codemirror.setValue(tank.instance().panels.favorite.list[id].query);
            tank.instance().executeQuery();
        };
        for (var j = 0; j < document.getElementsByClassName('favorite-query').length; j++) {

            document.getElementsByClassName('favorite-query')[j].onclick = onclick;
        }
    };

}).call(this);

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
;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.history');

    /**
     * The init function.
     */
    tank.panels.classes.history = function (tank) {
        // the history heap
        this.list = [];

        // init object by calling refresh method
        var _self = this;
        _self.refresh();

        // When a query is executed, we save it into history
        window.addEventListener( 'run-query', _self.execute, false );


    };

    /**
     * The refresh function.
     */
    tank.panels.classes.history.prototype.refresh = function () {

        // Generate the HTML output of the history
        var i = (this.list.length - 1), html = '';
        for (i; i >= 0; i--) {
            html += "<li>" +
                "<span class=\"timeago\">" + tank.utils.timeago(this.list[i].time) + "</span>" +
                "<a href=\"#\" class=\"history-query\" data-query-id=\"" + i + "\">" + this.list[i].display + "</a>" +
                "</li>";
        }
        // Replace the current HTML
        document.getElementById('history-list').innerHTML = html;

        // Refresh listener
        this.eventListener();
    };

    /**
     * The eventListerner function.
     */
    tank.panels.classes.history.prototype.eventListener = function () {

        // Click on an history query
        // ===========================
        var onclick = function () {
            var id = this.getAttribute("data-query-id");
            tank.instance().components.codemirror.setValue(tank.panels.history.list[id].query);
            tank.instance().executeQuery();
        };
        for (var j = 0; j < document.getElementsByClassName('history-query').length; j++) {
            document.getElementsByClassName('history-query')[j].onclick = onclick;
        }

    };

    /**
     * Function that add the current query to the history.
     * It's a 'static' method,  so don't use this.
     */
    tank.panels.classes.history.prototype.execute = function () {

        // adding the current query to the history
        tank.instance().panels.history.list.push({
            query: tank.instance().components.codemirror.getValue(),
            time: new Date(),
            display: tank.instance().components.codemirror.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
        });
        tank.instance().panels.history.refresh();
    };


}).call(this);

;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create utils package
    sigma.utils.pkg('tank.utils');

    /**
     * Function that generate a random color
     *
     * @returns {String}
     */
    tank.utils.randomcolor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

}).call(this);
;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create utils package
    sigma.utils.pkg('tank.utils');

    /**
     * Function that generate a text "X ago" from now.
     *
     * @param {Date}    timestamp   A date in the pass.
     * @returns {String}
     */
    tank.utils.timeago = function (timestamp) {

        var settings = {
            seconds: "less than a minute",
            minute: "about a minute",
            minutes: "%d minutes",
            hour: "about an hour",
            hours: "about %d hours",
            day: "a day",
            days: "%d days",
            month: "about a month",
            months: "%d months",
            year: "about a year",
            years: "%d years",
            wordSeparator: " "
        };

        if (timestamp instanceof Date) {
            var distance = new Date() - timestamp;
            var seconds = Math.abs(distance) / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            var words = seconds < 45 && settings.seconds.replace('/%d/i', Math.round(seconds)) ||
                seconds < 90 && settings.minute.replace('/%d/i', 1) ||
                minutes < 45 && settings.minutes.replace('/%d/i', Math.round(minutes)) ||
                minutes < 90 && settings.hour.replace('/%d/i', 1) ||
                hours < 24 && settings.hours.replace('/%d/i', Math.round(hours)) ||
                hours < 42 && settings.day.replace('/%d/i', 1) ||
                days < 30 && settings.days.replace('/%d/i', Math.round(days)) ||
                days < 45 && settings.month.replace('/%d/i', 1) ||
                days < 365 && settings.months.replace('/%d/i', Math.round(days / 30)) ||
                years < 1.5 && settings.year.replace('/%d/i', 1) ||
                settings.years.replace('/%d/i', Math.round(years));

            return words;
        } else {
            return timestamp;
        }
    };

}).call(this);