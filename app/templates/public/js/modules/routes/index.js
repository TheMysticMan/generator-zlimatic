var Routes = function ($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state("home", {
            url: '/home',
            templateUrl: 'partials/home.jade',
            controller: 'HomeController'
        });
};

export {Routes};