/**
 * Created by robert on 29/12/2015.
 */
angular.module('brisraMap', ['ngCordova'])
    .controller('MapCtrl', function ($scope, $state, $cordovaGeolocation) {

        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var latLng = new google.maps.LatLng(latitude, longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

            });

        }, function (error) {
            console.log("Could not get location");
        });

    });