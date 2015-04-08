'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/subjects', {
        templateUrl: 'views/subjects.html',
        controller: 'SubjectsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
   .factory('subjects', function ($http) {
     var dataset = { data:null};
     var currentSubject ={data: null}
     var propRanges = {}
     var currentId = 0;
     var dataService = {};
     var defaultRangeVal ='-All-';
     
     $http.get("data/subjects.json").success(function (data, status, headers, config) {
      
        dataset.data = data;
        resetFilters();

        for (var prop in dataset.data[0]) {
          if(dataset.data[0].hasOwnProperty(prop)){
              propRanges[prop] = _.chain(dataset.data)
                        .pluck(prop)
                        .uniq()
                        .without("")
                        .union(["-All-"])
                        .value()
                        .sort();
          }
        }
     });
     var resetFilters = function(){
        //temp hack till subjects json is updated
        for(var i=0;i< dataset.data.length;i++){
          dataset.data[i].filterPass=true;
        }
        dataset.data = _.sortBy(dataset.data,function(d){ return d.date;})
     }

     dataService.getList = function () {
         return dataset;
     }
     dataService.getRanges = function() {
        return propRanges;
     }
     dataService.filterList = function(criteria){
      //ethnicity
      //gender
      //age
      //injury level
      //weapons
      //shot at police
      //agency
      //city
      resetFilters();
      for(var i=0;i<dataset.data.length;i++){
        var pass = true;
        var d = dataset.data[i];
        if(criteria.gender!=defaultRangeVal && d.gender!=criteria.gender){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.ethnicity!=defaultRangeVal && d.ethnicity!=criteria.ethnicity){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.injuryLevel!=defaultRangeVal && d.injuryLevel!=criteria.injuryLevel){
          dataset.data[i].filterPass = false;
          continue;
        }
      }
      dataset.data = _.sortBy(dataset.data,function(d){ return !d.filterPass;})
     }
    return dataService;
  });
