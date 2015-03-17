;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.favorite');

    /**
     * The init function.
     */
    tank.panels.classes.favorite = function () {
        this.list = [];
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.favorite.prototype.refresh = function () {

        var i = 0, html = '';

        for (i; i >= 0; i--) {
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

            // adding the current query to the history
            this.list.push({
                query: tank.component.codemirror.getValue(),
                display: tank.component.codemirror.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
            });

            this.refresh();
        };

        // Click on an favorite query
        // ===========================
        var onclick = function() {
            var id = this.getAttribute("data-query-id");
            tank.component.codemirror.setValue(tank.panels.favorite.var.list[id].query);
            // FIXME : change this method !!!
            executeQuery();
        };
        for (var j = 0; j < document.getElementsByClassName('favorite-query').length; j++) {

            document.getElementsByClassName('favorite-query')[j].onclick = onclick;
        }
    };

}).call(this);
