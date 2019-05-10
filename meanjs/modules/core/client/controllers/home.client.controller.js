



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
      var urlDatabase = "http://" + options.host + ":" + options.port + options.path;
      $http.get(urlDatabase).then(function successCallback(response){
        var listDataBases = response.data.results[0].series[0].values;
        return listDataBases;
      }).then((list) => {
        var databases = [];
        list.forEach(db => {
          databases.push(db[0]);
        });
        $scope.DBs = databases;
      }).catch(function errorCallback(response){
        console.log(response);
      });

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
        document.getElementById('generate').style.display = "none";
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
          var request = "SELECT time, " + tagString + ", value FROM \"" + elt.measurement + "\" LIMIT 50000";
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
            pollingInterval: 5,
            conf: config
          }

          WorkerService.startWork(inputToWorker).then(function (response){
            console.log(response);
          }, function(error){
            console.log(error);
          }, function(response){
            console.log("Notification worker RESPONSE: " + response);
            document.getElementById('progress').style.display = "none";
            var finalName = nameFile + '.gz';
            var link = document.getElementById('linktoDL');
            link.style.display = "block";
            link.href = 'http://localhost:80/csv/' + finalName;
            link.download = finalName;
            WorkerService.stopWork();     
          });
          /*function createFile(){
            return $http.post('/measurements/' + localStorage.getItem('currentDB') + '/data',config);
          };

          //utiliser un worker pour avoir réponse immédiate du server et envoyer un lien une fois le fichier créé

          Promise.all([$scope.createFile()]).then(result => {
            return result[0].data;
          }).then(data => {
            if (data.created){
              console.log("Creation of the file OK");
              console.log("nom du fichier: " + data.finalName);

              var link = document.createElement('a');
              link.href = 'http://localhost:80/csv/'+data.finalName;
              link.download = data.finalName;     
              document.body.appendChild(link);       
              link.click();
              document.body.removeChild(link);

              //set the "Work in progress" element
              document.getElementById('generate').style.display = "block";
              document.getElementById('progress').style.display = "none";
              return data.finalName;
            }
          }).then((name) => {
            var config = {
              params: {
                file: name
              }
            };
          }).catch(err => {
            console.error(err);
          });*/
        }    
      }

      document.getElementById("linktoDL").onclick = function(){
        document.getElementById('linktoDL').style.display = "none";
        document.getElementById('generate').style.display = "block";
      }
    }]);
}());
