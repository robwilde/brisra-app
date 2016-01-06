/**
 * Created by robert on 5/01/2016.
 */
(function () {

    'use strict';

    angular.module('braApp.map')
        .directive('map', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    //scope.user = {};

                    console.log('scope', scope);

                    var zValue = scope.$eval(attrs.zoom);
                    var lat = scope.$eval(attrs.lat);
                    var lng = scope.$eval(attrs.lng);

                    var myLatlng = new google.maps.LatLng(lat, lng);
                    var mapOptions = {
                        zoom: zValue,
                        center: myLatlng
                    };

                    var map = new google.maps.Map(element[0], mapOptions);

                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        draggable: true
                    });

                    google.maps.event.addListener(marker, 'dragend', function (evt) {

                        var user = scope.user;

                        user = {
                            latitude: evt.latLng.lat(),
                            longitude: evt.latLng.lng()
                        };

                        console.log('Current Latitude:', user.latitude, 'Current Longitude:', user.longitude);
                    });

                }

            };
        });

})();