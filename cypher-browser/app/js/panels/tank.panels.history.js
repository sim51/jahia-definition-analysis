;(function (undefined) {
    'use strict';

    if (typeof tank === 'undefined')
        throw 'tank is not declared';

    // Create panel package
    sigma.utils.pkg('tank.panels.classes.history');

    /**
     * The init function.
     */
    tank.panels.classes.history = function () {
        this.list = [];
    };

    /**
     * The refresh function.
     */
    tank.panels.classes.history.prototype.refresh = function () {

        var i = (tank.panels.history.var.list.length - 1), html = '';
        for (i; i >= 0; i--) {
            html += "<li>" +
                "<span class=\"timeago\">" + tank.utils.timeago(tank.panels.history.var.list[i].time) + "</span>" +
                "<a href=\"#\" class=\"history-query\" data-query-id=\"" + i + "\">" + tank.panels.history.var.list[i].display + "</a>" +
                "</li>";
        }

        document.getElementById('history-list').innerHTML = html;

        tank.panels.history.eventListener();
    };

    /**
     * The eventListerner function
     */
    tank.panels.classes.history.prototype.eventListener = function () {

        // When we click on run
        // =======================
        document.getElementById('save').onclick = function () {

            // adding the current query to the history
            this.list.push({
                query: tank.component.codemirror.getValue(),
                display: tank.component.codemirror.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
            });

            tank.panels.favorite.refresh();
        };

        // Click on an history query
        // ===========================
        var onclick = function () {
            var id = this.getAttribute("data-query-id");
            tank.component.codemirror.setValue(tank.panels.history.var.list[id].query);

            // FIXME : change this method !!!
            executeQuery();
        };
        for (var j = 0; j < document.getElementsByClassName('history-query').length; j++) {

            document.getElementsByClassName('history-query')[j].onclick = onclick;
        }

    };

    /**
     * Function that add the current query to the history.
     */
    tank.panels.classes.history.prototype.execute = function () {

        // adding the current query to the history
        this.list.push({
            query: tank.component.codemirror.getValue(),
            time: new Date(),
            display: tank.component.codemirror.getWrapperElement().getElementsByClassName('CodeMirror-code')[0].innerHTML
        });
    };


}).call(this);
