define(['knockout'],
    function(ko) {
        function model(context) {
                var self = this;
               //viewmodel code goes here
                self.query = ko.observable("");

                self.getTable = function() {
                    console.log("getTable fired");
                    var query = self.query();
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
                                        "targetName": query,
                                        "targetType": "table",
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
                                        console.log(JSON.stringify(data))
                                        // <<- log data to console
                                    })
                                }
                    });
                }
        }
    return model;
});
