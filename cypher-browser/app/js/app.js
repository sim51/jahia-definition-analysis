/**
 * Global variables
 */
var s, // sigma variable
    query, // cypher query
    server, // url of neo4j server
    forceAtlas2Time, // time after each we have to kill the forceAtalas2 algo
    historyList = [],
    favoriteList = [],
    labels = [],
    types = [],
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
    editor.addKeyMap({
        "Ctrl-Enter": function () {
            executeQuery();
        },
        "Alt-Enter": function () {
            executeQuery();
        }
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
    // Save the query
    document.getElementById('save').onclick = saveQuery;
    // Panel navigation
    for (var i = 0; i < document.getElementsByClassName('tabsheet-link').length; i++) {
        document.getElementsByClassName('tabsheet-link')[i].onclick = panelSelectTabsheet;
    }
}

/**
 * Function that display labels the graph panel.
 *
 * @param labels {Array of String}  Array of label
 */
function panelGraphUpdateLabels(labels) {
    var i = 0,
        html = '';
    for (i; i < labels.length; i++) {
        html += "<li>" + labels[i] + "</li>";
    }
    document.getElementById('labels').innerHTML = html;
}

/**
 * Function that display types the graph panel.
 *
 * @param types {Array of String}  Array of type
 */
function panelGraphUpdateTypes(types) {
    var i = 0,
        html = '';
    for (i; i < types.length; i++) {
        html += "<li>" + types[i] + "</li>";
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
 * Function to update the history panel.
 */
function panelHistoryUpdate() {
    // adding th current query to the history
    historyList.push(
        {
            query: query,
            time: new Date(),
            display: editor.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
        }
    );

    var i = (historyList.length -1),
        html = '';

    for (i; i >= 0; i--) {
        html += "<li>" + historyList[i].display + "</li>";
    }
    document.getElementById('history-list').innerHTML = html;
}

/**
 * Function that execute & display the cypher query.
 */
function executeQuery() {
    s.graph.clear();
    s.refresh();
    readConfigData();
    panelHistoryUpdate();
    sigma.neo4j.cypher(server, query, s, onGraphDataLoaded);
}

/**
 * Function that save the current query to favorite.
 */
function saveQuery() {
    favoriteList.push(
        {
            title: '',
            query: editor.getValue(),
            display: editor.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
        }
    );

    var i = 0,
        html = '';

    for (i; i < favoriteList.length ; i++) {
        html += "<li>" + favoriteList[i].display + "</li>";
    }
    document.getElementById('favorite-list').innerHTML = html;

}

/**
 * Function to update the panel graph data.
 */
function panelGraphUpdate() {
    // update stats data
    document.getElementById('numberOfNode').innerHTML = '' + s.graph.nodes().length;
    document.getElementById('numberOfEdge').innerHTML = '' + s.graph.edges().length;

    // update labels
    sigma.neo4j.getLabels(server, panelGraphUpdateLabels);
    // update types
    sigma.neo4j.getTypes(server, panelGraphUpdateTypes);
}

/**
 * Function that managed selection of panel tab.
 */
function panelSelectTabsheet() {
    document.getElementById('graph-tab').classList.remove('active');
    document.getElementById('favorite-tab').classList.remove('active');
    document.getElementById('history-tab').classList.remove('active');
    document.getElementById('config-tab').classList.remove('active');
    this.parentNode.classList.add('active');
}

/**
 * When document is ready , we initialize the application.
 */
window.onload = function () {
    init();
};
