(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', function($scope, $http){
      
      

      $scope.onClickDB = function(){  
        localStorage.clear();
        if ($scope.databaseName!=null){
          localStorage.setItem("currentDB", $scope.databaseName);
          //Allowed the user to click on the next button to choose measurements
          document.getElementById("forMeasurement").disabled = false;
          //close the collapsed DB
          document.getElementById("collapsedDB").setAttribute("class","collapse");
          //URL to get the measurements from the database chosen
          document.getElementById('forMeasurement').onclick = function(){
            var request = encodeURIComponent("SHOW MEASUREMENTS");
            var campaign = localStorage.getItem("currentDB");
            var options = {
                host: "apolline.lille.inria.fr",
                port: 8086,
                path: "/query?db="+campaign+"&q="+request,
            };
            var urlMeasurement = "http://" + options.host + ":" + options.port + options.path;

            $http.get(urlMeasurement).then(function successCallback(response){
              var listMeasurements = response.data.results[0].series[0].values;
              return listMeasurements;
            }).then((list) => {
              var finalList = [];
              list.forEach(element => {
                finalList.push(element[0]);
              });
              console.log(finalList);
              $scope.checkboxMeasurement=finalList;
            }).catch(function errorCallback(response){
              console.log(response)
            });
          }
        }
        else{
          alert("Veuillez choisir une base de données");
        }
      }

      $scope.onClickMeasurements = function(){
        var measurementTags = new Array();
        var checkboxes =  document.getElementsByClassName('measurementValue');
        var selectionMeasurements = [];
        for (var i = 0; i < checkboxes.length ; i++){
            if (checkboxes[i].checked){
                selectionMeasurements.push(checkboxes[i].value);
            }
        }
        localStorage.setItem("selectedMeasurement", selectionMeasurements);
        if (localStorage.getItem("selectedMeasurement")!=[]){
          //Allowed the user to click on the next button to choose measurements
          document.getElementById("forTags").disabled = false;
          //close the collapsed DB
          document.getElementById("collapsedMeasure").setAttribute("class","collapse");
          //Fill the map with the measurements and the associate tags
          selectionMeasurements.forEach(function(measurement) {
            console.log(measurement);
            var request = encodeURIComponent("SHOW TAG KEYS FROM \"" + measurement + "\"");
            var campaign = localStorage.getItem("currentDB");
            var options = {
                host: "apolline.lille.inria.fr",
                port: 8086,
                path: "/query?db="+campaign+"&q="+request,
            };
            var urlTag = "http://" + options.host + ":" + options.port + options.path;
            $http.get(urlTag).then(function successCallback(response){
              var listTags = response.data.results[0].series[0].values;
              return listTags;
            }).then((list) => {
              console.log(list);
              var measureTags = {
                "measurement": measurement,
                "tags": list
              };             
              measurementTags.push(measureTags);
            }).catch(function errorCallback(response){
              console.log(response)
            });
          });

          //URL to get the measurements from the database chosen
          document.getElementById('forTags').onclick = function(){
            $scope.tagsElements = measurementTags;
            console.log("scope: " + $scope.tagsElements);
          }
        }
        else{
          alert("You have to choose some measurements");
        }
      }


      $scope.onClickTags = function(){

      }
    });
}());