/**
 * Created by robert on 5/01/2016.
 */
(function () {
    "use strict";

    angular.module('braApp')

        .factory("appFire", ['$firebaseArray', firebaseService]);

    function firebaseService ($firebaseArray) {

        var BraClientRef = new Firebase("https://brisra.firebaseio.com/clients");
        var BraClients =  $firebaseArray(BraClientRef);

        var BraStaffRef = new Firebase("https://brisra.firebaseio.com/staff");
        var BraStaff = $firebaseArray(BraStaffRef);

        return {
            clients: BraClients,
            staff: BraStaff
        }
    }

}());