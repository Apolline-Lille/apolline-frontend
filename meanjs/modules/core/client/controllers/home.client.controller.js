(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', function($scope){
      $scope.ChooseDatabase = function(){
        console.log($scope.databaseName);
      }
      $scope.onClick = function(){
        if ($scope.databaseName!=null){
          localStorage.setItem("currentDB", $scope.databaseName);
          window.location = "./measurements/"+$scope.databaseName;
        }
        else{
          alert("Veuillez choisir une base de données");
        }
      }
    }); 
}());