/**
 * Created by robert on 5/01/2016.
 */
(function () {
    "use strict";

    angular.module('braApp.user', ['ionic'])
        .controller('UserCtrl', ['$rootScope', '$scope', '$log', 'appFire', '$ionicPopup', '$state', userCtrl]);

    function userCtrl($rootScope, $scope, $log, appFire, $ionicPopup, $state) {

        $scope.clients = appFire.clients;
        $log.info('UserCtrl - clients', $scope.clients);

        $scope.user = $rootScope.client || {};

        $scope.userSave = function (user) {

            // Code to write to Firebase will be here
            $scope.clients.$add({
                rego: angular.lowercase(user.rego),
                firstName: user.firstName,
                lastName: user.lastName,
                mobile: user.mobile,
                make: user.make,
                model: user.model,
                year: user.year
            }).then(function (ref) {
                $scope.confirm('app.map');
            }, function (error) {
                console.log("Error:", error);
            });
        };

        $scope.confirm = function (state) {
            var popupOk = $ionicPopup.alert({
                title: 'User Details',
                template: 'Your details have been saved!!'
            });

            popupOk.then(function(state){
                $state.go(state);
            })

        };

    }

}());