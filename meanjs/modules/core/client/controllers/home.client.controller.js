
(function () {
  'use strict';
  var app = angular.module('core');
    app.controller('HomeController', function($scope, $http){

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
          var tagString = "";
          for (var i = 0; i < elt.choosenTags.length; i++){
            if (i != ((elt.choosenTags.length)-1)){
              tagString = tagString + elt.choosenTags[i].toString() + ", ";
            }
            else {
              tagString = tagString + elt.choosenTags[i].toString();
            }
          }
          var request = "SELECT " + tagString + ", value FROM \"" + elt.measurement + "\" LIMIT 5";
          var requestEncode = encodeURIComponent(request);
          urlFinal = urlFinal + requestEncode;
          if (!(document.getElementById("allData").checked)){
            if ((document.getElementById("beginDate").value != "")){
              if ((document.getElementById("endDate").value != "")){
                if ( document.getElementById("beginDate").value > document.getElementById("endDate").value ){
                  alert("Begin date bigger than end date");
                }
                else {
                  dateBegin = document.getElementById("beginDate").value + "T00:00:00Z";
                  dateEnd = document.getElementById("endDate").value + "T00:00:00Z";
                  urlFinal = urlFinal + encodeURIComponent(" WHERE time > \'" + dateBegin + "\' AND time < \'" + dateEnd + "\'");
                  listRequest.push(urlFinal);
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
            listRequest.push(urlFinal);
          }
        });
        var i = 0;
        asyncForEach(listRequest, async (url) => {
          console.log(url);
          await $http.get(url).then( async (response) => {
            var result = response.data.results[i].series[0];
            return result;            
          }).then(async(json) => {
            await JSONToCSVConvertor(json, json.name, true);
            i++;
          }).catch( async(err) => {
            console.log(err);
          });
        });
      }
    });
}());

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  var CSV = '';
  
  
  //Set Report title in first row or line 
  CSV += ReportTitle + '\r\n\n';
  console.log(ReportTitle);
  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";     
    //This loop will extract the label from 1st index of on array
    (arrData.columns).forEach (index => {     
      //Now convert each value to string and comma-seprated
      row += index + ',';
    });
    row = row.slice(0, -1);      
    //append Label row with line break
    CSV += row + '\r\n';
  }  
  //1st loop is to extract each row
  for (var i=0 ; i < (arrData.values).length; i++) {
    var row = ""; 
    //2nd loop will extract each column and convert it in string comma-seprated
    arrData.values[i].forEach(index => {
      row += '"' + index + '",';
    });
    row.slice(0, row.length - 1);
    //add a line break after each row
    CSV += row + '\r\n';
  };
  if (CSV == '') {        
      alert("Invalid data");
      return;
  }  
  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);     
  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");    
  link.href = uri;  
  //set the visibility hidden so it will not effect on your web-layout
  var dateCreation = new Date().getTime();
  var nameFile = ReportTitle + dateCreation + ".csv";
  link.style = "visibility:hidden";
  link.download = nameFile;  
  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const asyncForEach = async (array, callback) =>{
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}