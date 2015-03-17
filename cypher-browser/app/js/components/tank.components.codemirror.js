;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.components');

    // init codemirror
    tank.components.codemirror = CodeMirror.fromTextArea(document.getElementById('cypher-query'), {
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
        mode: "cypher",
        theme: "neo"
    });
    // Adding some key map that permit to run & save the query.
    tank.components.codemirror.addKeyMap(
        {
            "Ctrl-Enter": function () {
               alert('help');
            },
            "Alt-Enter": function () {
                alert('help');
            }
        },
        false
    );

}).call(this);