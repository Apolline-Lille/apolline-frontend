



(function () {
  'use strict';
  var app = angular.module('core');
    app.controller('HomeController', ['$scope', '$http', 'WorkerService', function($scope, $http, WorkerService){
      var listTags = "";
      var request = encodeURIComponent("SHOW DATABASES");
      var options = {
          host: "apolline.lille.inria.fr",
          port: 8086,
          path: "/query?q="+request,
      };
      //URL to get the databases from apolline
      var urlDatabase = "http://" + options.host + ":" + options.port + options.path;


      //The HTTP request to get the databases
      $http.get(urlDatabase).then(function successCallback(response){
        var listDataBases = response.data.results[0].series[0].values;
        return listDataBases;
      }).then((list) => {
        var databases = [];
        //Fill the database array with the result of the http request
        list.forEach(db => {
          databases.push(db[0]);
        });
        //fill the dropdown in HTML with the array databases
        $scope.DBs = databases;
      }).catch(function errorCallback(response){
        console.log(response);
      });

      document.getElementById("onClickDB").onclick = function(){  
        localStorage.clear();
        if ($scope.databaseName!=null){
          //save the DB choosen in the localStorage of the browser
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
            //URL to get the measurements from the database choosen
            var urlMeasurement = "http://" + options.host + ":" + options.port + options.path;

            //The HTTP request to get the measurements
            $http.get(urlMeasurement).then(function successCallback(response){
              var listMeasurements = response.data.results[0].series[0].values;
              return listMeasurements;
            }).then((list) => {
              var finalList = [];
              //Fill the finalList array with the result of the http request
              list.forEach(element => {
                finalList.push(element[0]);
              });
              //fill the dropdown in HTML with the array finalList
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
        //get all the checkboxes from tags part
        var checkboxes =  document.getElementsByClassName('tagsValue');
        var selection = {};
        selection.final = new Array(); 
        var listMeasureTags = $scope.tagsElements;
        var tagsNb = 0;

        //Search in all checkboxes which is checked
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
        });
        //save the choosen measurements and the associate tags in the localStorage
        localStorage.setItem("dataChoosen", JSON.stringify(selection.final));
      }

      //The last part when you Generate the CSV (last button)
      document.getElementById("generate").onclick = function(){
        //hide the generate button
        document.getElementById('generate').style.display = "none";
        //show the Work in progress... element
        document.getElementById('progress').style.display = "block";
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
        //create one URL from each of choosen measurements
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
          var request = "SELECT time, " + tagString + ", value FROM \"" + elt.measurement + "\" LIMIT 300000";
          var requestEncode = encodeURIComponent(request);
          msrURL = urlFinal + requestEncode;
          //Check whate filter on date the user have choosen
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
          //The config JSON to send to the server for the HTTP request
          var config = {
            headers: { 'Content-Type': 'application/gzip'},
            params: {
              listURL: listRequest,
              tagString: listTags.replace(/ /g,""), 
              fileName: nameFile
            }
          };
          var dbChoose = localStorage.getItem("currentDB");

          var inputToWorker = {
            dataUrl: 'http://0.0.0.0:80/measurements/' + dbChoose + '/data',
            //pollingInterval: 5,
            conf: config
          }

          WorkerService.processData(inputToWorker).then(function(result){
            //result of the worker
            console.log("Notification worker RESPONSE: " + result);
            //Name of the file
            var finalName = nameFile + '.gz';
            //Hide the Work in progress element
            document.getElementById('progress').style.display = "none";
            //Show the link to the created file 
            document.getElementById('link').style.display = "block";
            document.getElementById('link').href = 'http://localhost:80/csv/' + finalName;
            document.getElementById('link').textContent = 'http://localhost:80/csv/' + finalName;
            //Show the Generation button
            document.getElementById('generate').style.display = "block";
          });

          //Beginning of the worker ../service/worker.client.service.js
          /*WorkerService.startWork(inputToWorker).then(function (response){
            console.log("End of the worker: " + response);
            WorkerService.stopWork();
          }, function(error){
            console.log("ERROR: " + error);
          }, function(response){
            //result of the worker
            console.log("Notification worker RESPONSE: " + response);
            //Name of the file
            var finalName = nameFile + '.gz';
            //Hide the Work in progress element
            document.getElementById('progress').style.display = "none";
            //Show the link to the created file 
            document.getElementById('link').style.display = "block";
            document.getElementById('link').href = 'http://localhost:80/csv/' + finalName;
            document.getElementById('link').textContent = 'http://localhost:80/csv/' + finalName;
            //Show the Generation button
            document.getElementById('generate').style.display = "block";
            //Stop the worker
            WorkerService.stopWork();
          });*/

          /*console.log("test fichier: " + test_fichier("/opt/mean.js/csvdownload/" + nameFile + ".gz"));
          if (test_fichier("/opt/mean.js/csvdownload/" + nameFile + ".gz")){
            //Name of the file
            var finalName = nameFile + '.gz';
            //Hide the Work in progress element
            document.getElementById('progress').style.display = "none";
            //Show the link to the created file 
            document.getElementById('link').style.display = "block";
            document.getElementById('link').href = 'http://localhost:80/csv/' + finalName;
            document.getElementById('link').textContent = 'http://localhost:80/csv/' + finalName;
            //Show the Generation button
            document.getElementById('generate').style.display = "block";
            //Stop the worker
            WorkerService.stopWork();
          }*/
        }       
      }
      

      function test_fichier(url){
        var xhr_object = new XMLHttpRequest();
        xhr_object.open("HEAD", url, false);
        xhr_object.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr_object.send();
        console.log("verification request send");
        if(xhr_object.readyState == 4)	{
          if(xhr_object.responseText == 1)
            return(true);
          else
            return(false);
        }
        else return(false);
      }
    }]);
}());