'use strict';
 
angular.module('core')
  .factory('WorkerService', function ($q) {
 
    /*var worker = undefined;
    return{
      startWork: function(inputToWorker){
        console.log("inputToWorker: " + inputToWorker);
        var defer = $q.defer();
        if (worker){
          console.log("avant le terminate");
          worker.terminate();
        }*/

        //function to be your worker
        function workerFunction(){
          function process(myData) {
            var dataUrl = myData.dataUrl;
            var config = myData.conf;
            console.log("dataURL: " + myData.dataUrl);
            console.log("config: " + myData.config);
            var params = config;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', dataUrl, true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(params));
          }
          self.addEventListener('message', function(e) {
            self.postMessage(process(e.data.myData));
          }, false);
          /*var self = this;

          self.onmessage = function(event) {
            var timeoutPromise = undefined;
            var dataUrl = event.data.dataUrl;
            var config = event.data.conf;
            var pollingInterval = event.data.pollingInterval;
            if (dataUrl) {
              if (timeoutPromise) {
                  setTimeout.cancel(timeoutPromise); // cancelling previous promises
              }

              console.log('Notifications - Data URL: ' + dataUrl);
              //get Notification count
              var delay = 5000; // poller 5sec delay
              (function pollerFunc() {
                  timeoutPromise = setTimeout(function() {
                      var params = config;
                      var xmlhttp = new XMLHttpRequest();
                      xmlhttp.onreadystatechange = function() {
                          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                              var response = JSON.parse(xmlhttp.responseText);
                              self.postMessage(response.id);
                              pollerFunc();
                          }
                      };
                      xmlhttp.open('POST', dataUrl, true);
                      xmlhttp.setRequestHeader("Content-type", "application/json");
                      xmlhttp.send(JSON.stringify(params));
                  }, delay);
              })();
            }
          }*/
        }
        var dataObj = '(' + workerFunction + ')();'; // here is the trick to convert the above fucntion to string
        var blob = new Blob([dataObj.replace('"use strict";', '')]); // firefox adds user strict to any function which was blocking might block worker execution so knock it off

        var blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
            type: 'application/javascript; charset=utf-8'
        });

        var worker = new Worker(blobURL);
        /*worker.onmessage = function(e) {
            console.log('Worker said: ', e.data);
            worker.terminate();
            defer.notify(e.data);
        };
        worker.postMessage(inputToWorker); // Send data to our worker.
        return defer.promise;*/

        var defer;
        worker.addEventListener('message', async function(e) {
          console.log('Worker said: ', e.data);
          await defer.resolve(e.data);
        }, false);

        return {
            processData : async function(data){
              defer = $q.defer();
              worker.postMessage({
                'myData': data
              });
              return await defer.promise;
            }
        };
  /*},

      stopWork: function() {
        if (worker){
          console.log("------------------- worker finished ----------------------");
          worker.terminate();
        }
      }

    }*/
  });