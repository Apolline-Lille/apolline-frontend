
(function () {
  'use strict';
  var app = angular.module('core');
    app.controller('HomeController', function($scope, $http){
      var listTags = "";
      document.getElementById("onClickDB").onclick = function(){  
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

      document.getElementById("onClickMeasurements").onclick = function(){
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
          }
        }
        else{
          alert("You have to choose some measurements");
        }
      }


      document.getElementById("onClickTags").onclick = function(){
        //Allowed the user to click on the next button to choose date
        document.getElementById("forDate").disabled = false;
        //close the collapsed Tags
        document.getElementById("collapsedTags").setAttribute("class","collapse");
        var checkboxes =  document.getElementsByClassName('tagsValue');
        var selection = {};
        selection.final = new Array();      
        var listMeasureTags = $scope.tagsElements;
        var tagsNb = 0;
        listMeasureTags.forEach(elt => {
          var choosenTags = new Array();
          for (var i = tagsNb; i < tagsNb + elt.tags.length; i++){
            if (checkboxes[i].checked){
              choosenTags.push(checkboxes[i].value);
            }
          }
          selection.final.push({
            "measurement": elt.measurement,
            "choosenTags": choosenTags
          });
          tagsNb = tagsNb + elt.tags.length;
        })
        localStorage.setItem("dataChoosen", JSON.stringify(selection.final));
      }

      document.getElementById("generate").onclick = function(){
        
        var campaign = localStorage.getItem("currentDB");
        var dataFilter = JSON.parse(localStorage.getItem("dataChoosen"));
        var dateBegin = "";
        var dateEnd = "";
        var options = {
            host: "apolline.lille.inria.fr",
            port: 8086,
            path: "/query?db="+campaign+"&q=",
        };
        var urlFinal = "http://" + options.host + ":" + options.port + options.path;
        var listRequest = new Array();
        dataFilter.forEach( elt => {
          var msrURL = ""
          var tagString = "";
          for (var i = 0; i < elt.choosenTags.length; i++){
            if (i != ((elt.choosenTags.length)-1)){
              tagString = tagString + elt.choosenTags[i].toString() + ", ";
            }
            else {
              tagString = tagString + elt.choosenTags[i].toString();
            }
          }
          listTags = tagString;
          var request = "SELECT time, " + tagString + ", value FROM \"" + elt.measurement + "\" LIMIT 100000";
          var requestEncode = encodeURIComponent(request);
          msrURL = urlFinal + requestEncode;
          if (!(document.getElementById("allData").checked)){
            if ((document.getElementById("beginDate").value != "")){
              if ((document.getElementById("endDate").value != "")){
                if ( document.getElementById("beginDate").value > document.getElementById("endDate").value ){
                  alert("Begin date bigger than end date");
                }
                else {
                  dateBegin = document.getElementById("beginDate").value + "T00:00:00Z";
                  dateEnd = document.getElementById("endDate").value + "T00:00:00Z";
                  /**/
                  msrURL = urlFinal + encodeURIComponent(" WHERE time >= \'" + dateBegin.toString() + "\' AND time <= \'" + dateEnd.toString() + "\'");
                  console.log("date: " + urlFinal);
                  listRequest.push(msrURL);
                }
              }
              else {
                alert("Choose an ending date");
              }
            }
            else {
              alert("Choose a beginning date");
            }           
          }
          else{
            listRequest.push(msrURL);
          }
        });
        if(!(document.getElementById("allData").checked) && (document.getElementById("beginDate").value == "") && ((document.getElementById("endDate").value == ""))){
          alert("Filter by choosing 2 date or by checking the first option");
        }
        else {
          var date = new Date().getTime();
          var nameFile = "data" + date.toString() + ".csv";
          console.log("Name file: " + nameFile);
          $http.post('/measurements/' + localStorage.getItem('currentDB') + '/data', {params: {listURL: listRequest,tagString: listTags.replace(/ /g,""), fileName: nameFile }})
          .success(
              function(success){
                  console.log("well done!");
                  //var date = new Date().getTime();
			            var blob = new Blob([success], { type:"text/csv;charset=utf-8;" });			
			            var downloadLink = angular.element('<a></a>');
                  downloadLink.attr('href',window.URL.createObjectURL(blob));
                  downloadLink.attr('download', nameFile);
			            downloadLink[0].click();
              }
            )
            .error(
              function(error){
                console.log(error);
              }
            );
        }    
      }
    });
}());