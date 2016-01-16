/**
 * Created by robert on 16/01/2016.
 */
// to get the current latitude and longitude from browser
// credits https://github.com/arunisrael/angularjs-geolocation
'use strict';

angular.module('geolocation',[]).constant('geolocation_msgs', {
    'errors.location.unsupportedBrowser':'Browser does not support location services',
    'errors.location.notFound':'Unable to determine your location',
});

angular.module('geolocation')
    .factory('geolocation', ['$q','$rootScope','$window','geolocation_msgs',function ($q,$rootScope,$window,geolocation_msgs) {
        return {
            getLocation: function () {
                var deferred = $q.defer();
                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(function(position){
                        $rootScope.$apply(function(){deferred.resolve(position);});
                    }, function(error) {
                        $rootScope.$broadcast('error',geolocation_msgs['errors.location.notFound']);
                        $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.notFound']);});
                    });
                }
                else
                {
                    $rootScope.$broadcast('error',geolocation_msgs['errors.location.unsupportedBrowser']);
                    $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);});
                }
                console.log(deferred.promise);
                return deferred.promise;
            }
        };
    }]);


geocoder
// uses ngStorage module
//based on  https://gist.github.com/benmj/6380466
//http://stackoverflow.com/questions/14464945/add-queueing-to-angulars-http-service
'use strict';

angular.module('geocoder', ['ngStorage']).factory('Geocoder', function ($localStorage, $q, $timeout) {
    var locations = $localStorage.locations ? JSON.parse($localStorage.locations) : {};

    var queue = [];

// Amount of time (in milliseconds) to pause between each trip to the
// Geocoding API, which places limits on frequency.
    var queryPause = 250;

    /**
     * executeNext() - execute the next function in the queue.
     * If a result is returned, fulfill the promise.
     * If we get an error, reject the promise (with message).
     * If we receive OVER_QUERY_LIMIT, increase interval and try again.
     */
    var executeNext = function () {
        var task = queue[0],
            geocoder = new google.maps.Geocoder();

        geocoder.geocode({'latLng': task.latlng}, function (result, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var geoaddress = {
                    address: result[1].formatted_address
                };

                queue.shift();

                locations[task.latlng] = geoaddress;
                $localStorage.locations = JSON.stringify(geoaddress);

                task.d.resolve(geoaddress);

                if (queue.length) {
                    $timeout(executeNext, queryPause);
                }
            } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                queue.shift();
                task.d.reject({
                    type: 'zero',
                    message: 'Zero results for geocoding latlng ' + task.latlng
                });
            } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                queryPause += 250;
                $timeout(executeNext, queryPause);
            } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
                queue.shift();
                task.d.reject({
                    type: 'denied',
                    message: 'Request denied for geocoding latlng ' + task.latlng
                });
            } else if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
                queue.shift();
                task.d.reject({
                    type: 'invalid',
                    message: 'Invalid request for geocoding latlng' + task.latlng
                });
            }
        });
    };

    return {
        addressForLatLng : function (lat, lng) {
            var d = $q.defer();
            var lat = parseFloat(lat);
            var lng = parseFloat(lng);
            var latlng = new google.maps.LatLng(lat, lng);
            if (latlng in locations) {
                $timeout(function () {
                    d.resolve(locations[latlng]);
                });
            } else {
                queue.push({
                    latlng: latlng,
                    d: d
                });
                if (queue.length === 1) {
                    executeNext();
                }
            }
            return d.promise;
        }
    };
});


//usage:
angular.module('myApp',['geolocation', 'geocoder'])
    .controller('geoCtrl', function ($scope,geolocation,Geocoder ) {
        geolocation.getLocation().then(function(data){
            console.log(data);
            Geocoder.addressForLatLng(data.coords.latitude, data.coords.longitude).then(function(data){
                console.log(data)
            })

        });
    });