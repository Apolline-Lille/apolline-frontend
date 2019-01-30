(function () {
  'use strict';
  angular
    .module('apolline')
    .controller("MeasurementController",MeasurementController);
    
    
    function MeasurementController($scope, $http){

        console.log(localStorage.getItem("currentDB"));
        var listMeasurements = new Array();
        var request = encodeURIComponent("SHOW MEASUREMENTS");
        var campaign = localStorage.getItem("currentDB");
        var options = {
            host: "apolline.lille.inria.fr",
            port: 8086,
            path: "/query?db="+campaign+"&q="+request,
        };
        var urlMeasurement = "http://" + options.host + ":" + options.port + options.path;
        
        $scope.checkboxMeasurement = [];
        $scope.getMeasurements = function(){
            $http({method: 'GET', url: urlMeasurement})
                .success(function(data, status){
                    $scope.checkboxMeasurement = data;
                    console.log(status);
                    console.log($scope.checkboxMeasurement);
                })
                .error(function(data, status){
                    console.log(status);
                    alert("Error");
                });
        };
        console.log(urlMeasurement);
        /*$http.get(urlMeasurement.toString()).then(function successCallback(response){
            console.log('hello');
            (response.data.results[0].series[0].values).forEach(element => {
                listMeasurements.push(element[0]);
            });
            console.log(listMeasurements);
            $scope.checkboxMeasurement = listMeasurements;
            return listMeasurements;
        }), function errorCallback(response){
            console.log(response)
        };*/

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
    };
}());

