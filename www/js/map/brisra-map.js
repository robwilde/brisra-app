
/**
 * Created by robert on 29/12/2015.
 */

angular.module('brisraMap', ['ngCordova'])
    .controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, $compile) {

        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            //console.log('Position: ', position);

            var latLng = new google.maps.LatLng(latitude, longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                //var latlnginfo = "<div><b>Lat: </b><p>" + latitude + "</p></div><div><b>Long: </b><p>" + longitude + "</p></div>";
                //var compiled = $compile(latlnginfo)($scope);

                //console.log(compiled);

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: "Lat: " + latitude + "<br>Lng: " + longitude
                    //content: compiled[0]
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

            });

        }, function (error) {
            console.log("Could not get location");
        });


        //var watchOptions = {
        //    timeout : 3000,
        //    enableHighAccuracy: false // may cause errors if true
        //};
        //
        //var watch = $cordovaGeolocation.watchPosition(watchOptions);
        //watch.then(
        //    null,
        //    function(err) {
        //        // error
        //    },
        //    function(position) {
        //
        //        console.log('WATCH: ', position);
        //
        //        var lat  = position.coords.latitude;
        //        var long = position.coords.longitude;
        //    });


    });