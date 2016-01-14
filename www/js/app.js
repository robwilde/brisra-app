// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function () {
    "use strict";

    angular.module('braApp',
        ['ionic','ionic.service.core', 'firebase', 'ngCordova', 'uiGmapgoogle-maps', 'braApp.home', 'braApp.user', 'braApp.map'])

        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //key: 'your api key',
                //libraries: 'weather,geometry,visualization',
                v: '3.17'
            });
        })

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/menu.html"
                })

                .state('app.home', {
                    url: "/home",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/home.html",
                            controller: "HomeCtrl"
                        }
                    }
                })

                .state('app.user', {
                    url: "/user",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/user.html",
                            controller: "UserCtrl"
                        }
                    }
                })

                .state('app.map', {
                    url: "/map",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/map.html",
                            controller: "MapCtrl"
                        }
                    }
                });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        })

        .controller('MenuCtrl', function($scope) {
        })

}());