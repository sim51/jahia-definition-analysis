/**
 * URL used to access Neo4j REST API to execute queries.
 * Update this parameter to your running server instance.
 *
 * For more information on Neo4J REST API the documentation is available here: http://neo4j.com/docs/stable/rest-api-cypher.html
 */
popoto.rest.CYPHER_URL = "http://localhost:7474/db/data/cypher";

/**
 * Define the Label provider you need for your application.
 * This configuration is mandatory and should contain at least all the labels you could find in your graph model.
 *
 * In this alpha version only nodes with a label are supported.
 *
 * By default If no attributes are specified Neo4j internal ID will be used.
 * These label provider configuration can be used to customize the node display in the graph.
 * See www.popotojs.com or example for more details on available configuration options.
 */
popoto.provider.nodeProviders = {
    "Module": {
        "returnAttributes": ["name"],
        "constraintAttribute": "name"
    },
    "Type": {
        "returnAttributes": ["name"],
        "constraintAttribute": "name"
    },
    "Namespace": {
        "returnAttributes": ["name"],
        "constraintAttribute": "uri"
    }
};

// Define the label provider used to customize the link displayed text:
popoto.provider.linkProvider = {

    // Customize the text displayed on links:
    "getLinkTextValue": function (link) {

	// The links labels are just changed in lower case in this example.
	// But it is possible to use a localization mechanism here to replace values.
	if (link.type === popoto.graph.link.LinkTypes.RELATION) {
	    switch (link.label) {
		case "IS_DEFINED_IN":
		    return "Define";
		case "IS_PARENT_OF":
		    return "Super type of";
		case "HAS_NAMESPACE":
		    return "Has namepsace";
		default :
		    return "Unexpected relation"
	    }
	} 
    }
};

/**
 * Here a listener is used to retrieve the total results count and update the page accordingly.
 * This listener will be called on every graph modification.
 */
popoto.result.onTotalResultCount(function (count) {
    document.getElementById("result-total-count").innerHTML = "(" + count + ")";
});

/**
 * The number of results returned can be changed with the following parameter.
 * Default value is 100.
 *
 * Note that in this current alpha version no pagination mechanism is available in displayed results
 */
popoto.query.RESULTS_PAGE_SIZE = 100;


/**
 * For the alpha version, popoto.js has been generated with debug traces you can activate with the following properties:
 * The value can be one in DEBUG, INFO, WARN, ERROR, NONE.
 *
 * With INFO level all the executed cypher query can be seen in the navigator console.
 * Default is NONE
 */
//popoto.logger.LEVEL = popoto.logger.LogLevels.INFO;

/**
 * Start popoto.js generation.
 * The function requires the label to use as root element in the graph.
 */
popoto.start("Module");
