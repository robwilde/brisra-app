/**
 * Created by robert on 6/01/2016.
 */
(function () {
    "use strict";

    angular.module('braApp.home', ['ionic'])
        .controller('HomeCtrl', ['$rootScope', '$scope', '$log', '$state', 'appFire', '$ionicHistory', '$ionicPopup', homeCtrl]);

    function homeCtrl($rootScope, $scope, $log, $state, appFire, $ionicHistory, $ionicPopup) {

        /*
         * client: end user that has been recorded into the system, current client
         * user: person using the device, may not be in the system as yet
         */

        $scope.user = {};
        var clients = appFire.clients;

        //$log.debug('HomeCtrl - clients', clients);

        $scope.checkRego = function (user) {
            $rootScope.client = undefined;

            for (var i = 0; i < clients.length; i++) {
                var client = clients[i];

                if (client.rego && client.rego !== undefined) {
                    //$log.debug('HomeCtrl - client.rego', client.rego);
                    if (angular.lowercase(user.rego) === angular.lowercase(client.rego)) {
                        $rootScope.client = client;
                    }
                }
            }

            $scope.regoResult($rootScope.client);
        };

        $scope.regoResult = function (clientObj) {

            $log.debug('HomeCtrl - clientObj', clientObj);

            /* client data returned and records exist - send to the MAP */
            if(clientObj){
                var clientYes = $ionicPopup.alert({
                    title: 'We Confirmed Your REGO',
                    template: 'Your details are in our system, press ok to pin-point your location!!'
                });
                clientYes.then(function () {

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                    $scope.user.rego = '';
                    $state.go('app.map');
                })
            } else {
                /* no details in system, NEW rego - go to user details */
                var clientNo = $ionicPopup.alert({
                    title: "We don't have your REGO",
                    template: "Click OK to fill in your details first, won't take long"
                });
                clientNo.then(function () {
                    $scope.user.rego = '';

                    $state.go('app.user');
                })
            }

        };
    }


}());