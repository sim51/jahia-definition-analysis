/**
 * Global variables
 */
var s, // sigma variable
    query, // cypher query
    server, // url of neo4j server
    forceAtlas2Time, // time after each we have to kill the forceAtalas2 algo
    history,
    editor; // Query history

/**
 * Function that initialize.
 */
function init() {
    // Init code mirror textarea
    // ==================================
    editor = CodeMirror.fromTextArea(document.getElementById('cypher-query'), {
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
        mode: "cypher",
        theme: "neo"
    });
    // Adding some key map that permit to run & save the query.
    editor.addKeyMap( {
            "Ctrl-Enter": function () { executeQuery(); },
            "Alt-Enter": function () { executeQuery(); }
        }, false);

    // Init sigmajs
    // ==================================
    s = new sigma({
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        }
    });

    // Adding some dome listener
    // ==================================
    // Run query on the run button !
    document.getElementById('run').onclick = executeQuery;
    // Panel navigation
    for ( var i =0 ; i < document.getElementsByClassName('tabsheet-link').length ; i++) {
        document.getElementsByClassName('tabsheet-link')[i].onclick = panelSelectTabsheet;
    }
}

/**
 * Function that display labels the graph panel.
 *
 * @param labels {Array of String}  Array of label
 */
function panelGraphWriteLabels(labels) {
    var i = 0,
        html = '';
    for(i ; i < labels.length ; i++) {
        html += "<li>" + labels[i] + "</li>";
    }
    document.getElementById('labels').innerHTML = html;
}

/**
 * Function that display types the graph panel.
 *
 * @param types {Array of String}  Array of type
 */
function panelGraphWriteTypes(types) {
    var i = 0,
        html = '';
    for(i ; i < types.length ; i++) {
        html += "<li>" + types[i]+ "</li>";
    }
    document.getElementById('types').innerHTML = html;
}

/**
 * Function that read all application configuration (include the query).
 */
function readConfigData() {
    query = editor.getValue();
    server = document.getElementById('server').value;
    forceAtlas2Time = document.getElementById('forceAtlas2Time').value;
}

/**
 * Funtcion that stop the forceAtlas2 algo.
 *
 * @param sig {Sigma} The sigmajs instance
 */
function stopForceAtlas2(sig) {
    sig.stopForceAtlas2();
}

/**
 * Callback function for neo4j execute sypher method.
 *
 * @param s {Sigma} The sigmajs instance
 * @param g {Graph} The graph object representation
 */
function onGraphDataLoaded(s, g) {
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
    window.setTimeout(stopForceAtlas2, forceAtlas2Time, s);
    panelGraphUpdate();
}

/**
 * Function that execute & display the cypher query.
 */
function executeQuery() {
    s.graph.clear();
    s.refresh();
    readConfigData();
    sigma.neo4j.cypher(server, query, s, onGraphDataLoaded);
}

/**
 * Function to update the panel graph data.
 */
function panelGraphUpdate() {
    // update stats data
    document.getElementById('numberOfNode').innerHTML = '' + s.graph.nodes().length;
    document.getElementById('numberOfEdge').innerHTML = '' + s.graph.edges().length;

    // update labels
    sigma.neo4j.getLabels(server, panelGraphWriteLabels);
    // update types
    sigma.neo4j.getTypes(server, panelGraphWriteTypes);
}

/**
 * Function that managed selection of panel tab.
 */
function panelSelectTabsheet() {
    document.getElementById('graph').classList.remove('active');
    document.getElementById('favorite').classList.remove('active');
    document.getElementById('history').classList.remove('active');
    document.getElementById('config').classList.remove('active');
    this.parentNode.classList.add('active');
}

/**
 * When document is ready , we initialize the application.
 */
window.onload = function() {
    init();
};
