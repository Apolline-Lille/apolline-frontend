(function () {
  'use strict';
  var apollineModule = angular.module('apolline');
    
    console.log(localStorage.getItem("currentDB"));
    var listMeasurements = new Array();
    apollineModule.controller("getMeasurements", function($http, $scope){
        var measurementSelected = [];
        var request = encodeURIComponent("SHOW MEASUREMENTS");
        var campaign = localStorage.getItem("currentDB");
        var options = {
            host: "apolline.lille.inria.fr",
            port: 8086,
            path: "/query?db="+campaign+"&q="+request,
        };
        var urlAPI = "http://" + options.host + ":" + options.port + options.path;
        $scope.checkboxMeasurement = [];
      
        $http.get(urlAPI).then(function successCallback(response){
            (response.data.results[0].series[0].values).forEach(element => {
                listMeasurements.push(element[0]);
            });
            return listMeasurements;
        }).then((list) => {
            $scope.checkboxMeasurement = list;
        }).catch(function errorCallback(response){
            console.log(response)
        });

        $scope.onClick = function(){
            var checkboxes =  document.getElementsByClassName('measurementValue');
            var selectionMeasurements = [];
            for (var i = 0; i < checkboxes.length ; i++){
                if (checkboxes[i].checked){
                    selectionMeasurements.push(checkboxes[i].value);
                }
            }

                localStorage.setItem("selectedMeasurement", selectionMeasurements);
                window.location = localStorage.getItem("currentDB") +"/tags";

            console.log(selectionMeasurements);
        }
    });

    apollineModule.controller('getTags', function($http, $scope){

    });
}());

