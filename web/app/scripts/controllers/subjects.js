'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:SubjectscontrollerCtrl
 * @description
 * # SubjectsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('SubjectsCtrl', function ($scope, $location, dataFactory) {
    $scope.selections={};

    var defaultval = "-All-";

    $scope.selections.gender=defaultval;
    $scope.selections.ethnicity = defaultval;
    $scope.selections.injuryLevel = defaultval;
    $scope.selections.shotAtPolice = defaultval;
    $scope.selections.weapons = defaultval;
    $scope.selections.year = defaultval;
    $scope.selections.agencies = defaultval;
    $scope.selections.incidentCity = defaultval;
    $scope.selections = _.extend($scope.selections,$location.search());
    
    $scope.dataset = dataFactory.getFilteredDataset($scope.selections);


    $scope.ranges = dataFactory.getFilterRanges();


    $scope.update = function(){
        $location.search(getNonDefaultSelections());
        //subjects.filterList($scope.selections);
        //incidents.filterList(_.where($scope.subjects.data,{'filterPass':true}));
    }

    
    function getNonDefaultSelections(){
        var culledList = {};
        for (var prop in $scope.selections) {
          if($scope.selections.hasOwnProperty(prop) && $scope.selections[prop]!=defaultval){
                culledList[prop]= $scope.selections[prop];
          }
        }
        return culledList;
    }
  });
