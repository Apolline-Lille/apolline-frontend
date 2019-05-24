'use strict';
 
angular.module('core')
  .factory('WorkerService', function ($q) {
        if (worker){
          console.log("Worker finish");
          worker.terminate();
        }
        var worker = undefined;
        
        //function to be your worker
        function workerFunction(){
          function process(myData) {
            var dataUrl = myData.dataUrl;
            var config = myData.conf;
            var params = config;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', dataUrl, true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(params));
          }
          self.addEventListener('message', function(e) {
            self.postMessage(process(e.data.myData));
          }, false);
        }

        var dataObj = '(' + workerFunction + ')();'; // here is the trick to convert the above fucntion to string
        var blob = new Blob([dataObj.replace('"use strict";', '')]); // firefox adds user strict to any function which was blocking might block worker execution so knock it off

        var blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
            type: 'application/javascript; charset=utf-8'
        });

        var worker = new Worker(blobURL);
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
  });