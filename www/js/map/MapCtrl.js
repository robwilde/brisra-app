/**
 * Created by robert on 30/12/2015.
 */
(function () {

    "use strict";

    angular.module('braApp.map', ['ionic'])
        .controller('MapCtrl', ['$scope', 'appFire', '$ionicPopup', MapCtrl]);


    function MapCtrl($scope, appFire, $ionicPopup) {

        var user = $scope.user;
        $scope.mapDetails = appFire.mapDetails;

        $scope.saveDetails = function (user) {

            // Code to write to Firebase will be here
            $scope.mapDetails.$add({
                latitude: user.latitude,
                longitude: user.longitude,
                mobile: user.mobile
            }).then(function (ref) {
                $scope.user = {};
                $scope.showAlert();
            }, function (error) {
                console.log("Error:", error);
            });
        };

        $scope.showAlert = function () {
            $ionicPopup.alert({
                title: 'braApp',
                template: 'Your location has been saved!!'
            });
        };


    }

}());