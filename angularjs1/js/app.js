if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

var practinaPanel = angular.module('practinaPanel', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'oc.lazyLoad',
    'nouislider',
    'ngTable',
    'ngMaterial',
    'toastr',
    'ngDialog',
    'cfp.loadingBar',
    'ngFileUpload',
    // 'btorfs.multiselect',
])
practinaPanel.constant("api", {
    "url": "http://34.209.133.44:3001"
});

practinaPanel.run(['$timeout', '$state', '$http', '$rootScope', 'api', function($timeout, $state, $http, $rootScope, api) {

    if (localStorage.getItem('accessToken') === null) {
        localStorage.removeItem('accessToken');
    }

    $http.get('data/countryCodes.json')
    .success(function(items) {
        $rootScope.countries = items;
    })
    .error(function(data, status, headers, config) {
        alert('Failure loading countries');
    });

}]);
