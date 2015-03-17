


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
    panelHistoryUpdate();
    sigma.neo4j.cypher(server, query, s, onGraphDataLoaded);
}

