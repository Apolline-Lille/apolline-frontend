/**
 * Code generation based off of http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
 *
 * Optional header allows overriding the property name with a value, must match the property keys
 *
 * myHeaderData : {
 *    id:'User ID', name:'User Name', alt:'Nickname'
 * }
 *
 * myInputArray : [
 *    { id:'0001', name:'George Jetson' },
 *    { id:'0004', name:'Elroy Jetson' , alt:'Boy Elroy' }
 * ]
 *
 * Usage:
 *  In the app
 *    ngModule.controller(myController, ['csvDownload'])
 *  In your HTML
 *    <csv-download
 *      column-header="myHeaderData"
 *      input-array="myInputArray"
 *      label="{{myLabel}}"
 *      filename="{{myFilename}}"></csv-download>
 *
 *      column-header:
 *        Optional
 *        Bound Variable: e..g : $scope.myHeader = []; column-header="myHeader"
 *        If not defined, then defaults to the keys in the inputArray
 *        This is a bound variable for an array of column headers,
 *        the key matches the data array keys, the values are the headers.
 *
 *      input-array:
 *        Required
 *        Bound Variable: e..g : $scope.myData = []; input-array="myData"
 *        Contains an array of elements. Each element is a JSON with key/value pairs. If the
 *        header-array is not included, the keys become the column headers
 *
 *      label:
 *        Optional
 *        String variable: e.g. $scope.myLabel; label="{{myLabel}} or label="My Text"
 *        Display text for the download link
 *        Defaults to "Download Data"
 *
 *      filename:
 *        Optional
 *        String variable: e.g. $scope.myFilename; label="{{myFilename}} or label="MyFile.csv"
 *        Name of the CSV file being downloaded
 *        Defaults to "export.csv"
 *
 *
 */
(function () {
    'use strict';
    angular.module('tld.csvDownload', []).directive('csvDownload', [])
        .config([
            '$compileProvider',
            function ($compileProvider) {
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(data):/);
                // $compileProvider.aHrefSanitizationWhitelist(/^\s*(data|https?|ftp|mailto|chrome-extension):/);
                // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
            }]);
    angular.module('tld.csvDownload').directive('csvDownload', function postLink($log) {
        var directive = {
            restrict: 'E',
            transclude: true,
            template: '<a href=\"{{hreflink}}\" download=\"{{filename}}\">{{label}}</a>', // TODO ng-href
            // <button ng-if=\"{{button}} === \'true\'\">{{label}}</button>
            scope: {
                columnHeader: '=',
                inputArray: '=',
                filename: '@filename',
                hreflink: '@hreflink',
                label: '@label'
            }
        };

        directive.controller = function ($scope) {
            if (undefined === $scope.label) {
                $scope.label = "Download Data";
            }

            var getHeader = function () {
                if ($scope.columnHeader) {
                    return $scope.columnHeader;
                }

                // no header, so build it
                $scope.columnHeader = [];
                // loop through all data in case some objects are incomplete
                for (var i in $scope.inputArray) {
                    var keys = Object.keys($scope.inputArray[i]);
                    for (var j in keys) {
                        var key = keys[j];
                        $scope.columnHeader[key] = key;
                    }
                }

                return $scope.columnHeader;
            };

            // the biggest difference here is I'm using the header instead of the keys for the header row
            var convertArrayOfObjectsToCSV = function () {
                var result, ctr, keys, columnDelimiter, lineDelimiter;

                var header = getHeader() || null;
                if (header === null) {
                    return null;
                }

                columnDelimiter = ',';
                lineDelimiter = '\n';

                keys = Object.keys(header);

                result = '';
                keys.forEach(function (key) {
                    var dataVal = header[key];
                    if (undefined === dataVal) {
                        dataVal = '';
                    }
                    result += '\"' + dataVal + '\"' + columnDelimiter; // handle embedded commas
                });
                result += columnDelimiter;
                result += lineDelimiter;

                $scope.inputArray.forEach(function (item) {
                    ctr = 0;
                    keys.forEach(function (key) {
                        if (ctr > 0) {
                            result += columnDelimiter;
                        }
                        var dataVal = item[key];
                        if (undefined === dataVal) {
                            dataVal = '';
                        }
                        result += '\"' + dataVal + '\"'; // handle embedded commas
                        ctr++;
                    });
                    result += lineDelimiter;
                });

                return result;
            };

            var generateCSVLink = function () {
                var data, link;

                if (undefined === $scope.filename) {
                    $scope.filename = 'export.csv';
                }

                var csv = convertArrayOfObjectsToCSV();
                if (csv === null) {
                    return;
                }

                if (!csv.match(/^data:text\/csv/i)) {
                    csv = 'data:text/csv;charset=utf-8,' + csv;
                }

                $scope.hreflink = encodeURI(csv);

            };

            generateCSVLink();

        };

        return directive;

    });
})();
