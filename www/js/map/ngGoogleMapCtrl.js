/**
 * Created by robert on 14/01/2016.
 */
angular.module('braApp.map', [])

    .controller('MapCtrl', function ($scope, $log, $timeout, $cordovaGeolocation, uiGmapGoogleMapApi) {

        var initializeMap = function (position) {
            console.log('initializeMap position:', position);
            if (!position) {
                // Default to downtown Toronto
                position = {
                    coords: {
                        latitude: 43.6722780,
                        longitude: -79.3745125
                    }
                };
            }

            console.log('initializeMap set', position);
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: position.coords.latitude,
                    longitude:position.coords.longitude
                },
                options: { draggable: true },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker dragend');
                        var lat = marker.getPosition().lat();
                        var lon = marker.getPosition().lng();
                        $log.log(lat);
                        $log.log(lon);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + round(lat, 5) + ' ' + 'lng: ' + round(lon, 5),
                            //labelContent: "+ and - to zoom, drop the cross on your location",
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };

            $scope.map = {
                center: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                zoom: 11
            };

            // Make info window for marker show up above marker
            $scope.windowOptions = {
                pixelOffset: {
                    height: -32,
                    width: 0
                }
            };

            $log.info('$scope', $scope);

        };

        uiGmapGoogleMapApi.then(function (maps) {
            // Don't pass timeout parameter here; that is handled by setTimeout below
            var posOptions = {enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log("Got location: ", position);
                    initializeMap(position);
                }, function (error) {
                    console.log(error);
                    initializeMap();
                });
        });

        $scope.findMe = function(){
            var posOptions = {enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log("Find Me: ", position);
                    //initializeMap(position);
                }, function (error) {
                    console.log(error);
                    //initializeMap();
                });
        };

        // Deal with case where user does not make a selection
        $timeout(function () {
            if (!$scope.map) {
                console.log("No confirmation from user, using fallback");
                initializeMap();
            }
        }, 5000);

        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }

    });
