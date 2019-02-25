(function () {
    'use strict';
    angular
        .module('apolline')
        .controller('TagsController', TagsController);

    function TagsController($http, $scope){
        $scope.init = function(){
            var listMeasurement = localStorage.getItem("selectedMeasurement");
            var campaign = localStorage.getItem("currentDB");
            console.log("list measurement choose " + listMeasurement);
            console.log("campaign: " + campaign);
            $scope.chooseMeasurement = listMeasurement;
                for (var measurement in listMeasurement){
                    var request = encodeURIComponent("SHOW TAG KEYS FROM \"" + measurement + "\"");
                    var options = {
                        host: "apolline.lille.inria.fr",
                        port: 8086,
                        path: "/query?db="+campaign+"&q="+request,
                        method: 'GET'
                    };
                    var urlTags = "http://" + options.host + ":" + options.port + options.path;
                    $http.get(urlTags).then(function successCallback(response){
                        return response;
                    }).then((res) => {
                        console.log(res);
                    }).catch(function errorCallback(response){
                        console.log(response);
                    });
                };
            }
    };
  }());