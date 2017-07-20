"use strict";

function RequestedColumn(name)
{
    var self = this;
    self.name = name;
}

function queryBuilder(table, columns) {
    if (table === "") {
        return false;
    }

    var columnString = "";

    columns.forEach((column, index, array) => {
        if (column !== "") {
            if (index === array.length - 1) {
                columnString += table + "." + column;
            } else {
                columnString += table + "." + column + "|";
            };
        };
    });
    return table + "|" + columnString;
};

define(['knockout'],
    function(ko) {
        function model(context) {
                var self = this;
               //viewmodel code goes here
                self.requestedTable = ko.observable("F0101");
                self.requestedColumns = ko.observableArray([
                    new RequestedColumn("AN8"),
                    new RequestedColumn("AT1")
                ]);

                self.addColumn = function() {
                    self.requestedColumns.push(new RequestedColumn(""));
                };

                self.tableData = ko.observableArray([]);

                self.getTable = function() {
                    var columnObjects = self.requestedColumns();
                    var columnArray = columnObjects.map((columnObject) => columnObject.name);
                    var tableName = self.requestedTable();
                    var queryString = queryBuilder(tableName, columnArray);
                    var req = {};
                    // empty object to hold our http request
                    req.deviceName = 'aisTester';
                    // <<---- here change to a unique name
                    req.username = "demo";
                    req.password = "demo";
                    // authenticate with the system by getting a token
                    $.ajax({
                            url: "http://demo.steltix.com/jderest/tokenrequest",
                            // <<- JD Edwards API token service
                            type: 'post',
                            // <<- the method that we using
                            data: JSON.stringify(req),
                            // <<- JSON of our request obj
                            contentType: 'application/json',
                            // <<- telling server how we are going to communicate

                            fail: function(xhr, textStatus, errorThrown) {
                                console.log(errorThrown, textStatus, xhr)
                                // <<- log any http errors to the console
                            }

                        }).done(function(data, textStatus, xhr) {

                                if (data.hasOwnProperty('userInfo')) {
                                    // <<- see example response below
                                    var token = data.userInfo.token;
                                    // build a request obj to fetch data

                                    var reqData = {
                                        "deviceName": "aisTester",
                                        "targetName": tableName,
                                        "targetType": "table",
                                        "returnControlIDs": queryString,
                                        "outputType": "GRID_DATA",
                                        "dataServiceType": "BROWSE",
                                        "maxPageSize": "10",
                                        "query": {
                                            "autoFind": true,
                                            "condition": []
                                        }
                                    }

                                    reqData.token = token;
                                    // <<- add our token from 1st request
                                    $.ajax({
                                        url: "http://demo.steltix.com/jderest/dataservice",
                                        // <<- can also try http://demo.steltix.com/jderest/formservice with example request object below"
                                        type: "post",
                                        contentType: "application/json",
                                        data: JSON.stringify(reqData)
                                    }).done(function(data) {
                                        var myTableObject = "fs_DATABROWSE_" + tableName;
                                        var myTableData = data[myTableObject].data.gridData;
                                        console.log(JSON.stringify(myTableData));

                                        for (let key in myTableData.columns) {
                                            let object = {};

                                            object['th'] = myTableData.columns[key];
                                            let rowsetArray = [];
                                            myTableData.rowset.forEach((row) => {
                                                rowsetArray.push(row[key]);
                                            });
                                            object['td'] = rowsetArray;
                                            self.tableData.push(object);
                                        };
                                        console.log(JSON.stringify(self.tableData()));

                                        // <<- log data to console
                                    })
                                }
                    });
                }
        }
    return model;
});

[
    {
        th : '',
        td : ['', '', '']
    },
    {
        th : '',
        td : ['', '', '']
    }
]
