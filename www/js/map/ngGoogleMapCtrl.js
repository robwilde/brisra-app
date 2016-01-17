/**
 * Created by robert on 14/01/2016.
 */
angular.module('braApp.map', [])

    .controller('MapCtrl', function ($scope, $q, $log, $timeout, $cordovaGeolocation, $ionicModal, $ionicLoading, uiGmapGoogleMapApi) {

        $scope.showLoading = function () {
            $ionicLoading.show({
                content: 'Loading Your Map...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $scope.showGeoCode = false;


        // Load the modal from the given template URL
        $ionicModal.fromTemplateUrl('templates/help.html', function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        var initializeMap = function (position) {
            $log.debug('initializeMap position:', position);

            if (!position) {
                // Default to downtown Toronto
                position = {
                    coords: {
                        latitude: 43.6722780,
                        longitude: -79.3745125
                    }
                };
            }

            $log.debug('initializeMap set', position);
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                options: {draggable: true},
                events: {
                    dragend: function (marker, eventName, args) {
                        var lat = marker.getPosition().lat();
                        var lng = marker.getPosition().lng();

                        getGeoCode(lat, lng);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + round(lat, 5) + ' ' + 'lng: ' + round(lng, 5),
                            labelAnchor: "50 100",
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

            // geocode coords
            getGeoCode(position.coords.latitude, position.coords.longitude);

        };

        var getGeoCode = function (lat, lng) {
            //var deferred = $q.defer();
            $scope.map.geoCode = '';
            $scope.showGeoCode = true;
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        //$log.debug('Update Geocode ', results);

                        $scope.$apply(function () {
                            $scope.map.geoCode = results[0].formatted_address;
                            $scope.showGeoCode = false;
                        });

                    } else {
                        $scope.$apply(function () {
                            $scope.map.geoCode = 'Location not found';
                            $scope.showGeoCode = false;
                        });
                    }
                } else {
                    $scope.$apply(function () {
                        $scope.map.geoCode = 'Geocoder failed due to: ' + status;
                        $scope.showGeoCode = false;
                    });
                }
            });
        };

        uiGmapGoogleMapApi.then(function (maps) {
            // Don't pass timeout parameter here; that is handled by setTimeout below
            $scope.showLoading();

            var posOptions = {enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log("Got location: ", position);
                    initializeMap(position);
                    $ionicLoading.hide();
                }, function (error) {
                    console.log(error);
                    initializeMap();
                });
        });

        $scope.findMe = function () {
            $scope.showLoading();

            var posOptions = {enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log("Find Me: ", position);
                    initializeMap(position);
                    $scope.map.zoom = 16;
                    $ionicLoading.hide();
                }, function (error) {
                    console.log(error);
                    initializeMap();
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
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        }

    });
