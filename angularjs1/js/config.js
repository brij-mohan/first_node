practinaPanel
    .config(function ($stateProvider, $urlRouterProvider,$locationProvider,$mdThemingProvider){
        $urlRouterProvider.otherwise("/user/login");

        $locationProvider.html5Mode(false);
        $mdThemingProvider
          .theme('docs-dark', 'default')
          .primaryPalette('grey')
          .accentPalette('pink')
          .warnPalette('red')
          .dark();

        $stateProvider

            .state('forgot', {
                url: '/forgot',
                templateUrl: 'views/page/forgotPswd.html'
            })
            .state('resetPassword', {
                url: '/resetPassword',
                templateUrl: 'views/page/resetpassword.view.html'
            })
            .state('newPass', {
                url: '/newpassword',
                templateUrl: 'views/page/newPassword.html'
            })
            //------------------------
            // States outside app-level
            //------------------------
          .state ('user', {
                url: '/user',
                templateUrl: 'views/page/user.html'
            })
            .state ('user.login', {
                url: '/login',
                templateUrl: 'views/page/userlogin.html'
            })
            //------------------------------
            // App states
            //------------------------------
          .state('app', {
                url: '/app',
                templateUrl: 'views/app/app.html'
            })
          .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/app/dashboard.view.html'
            })
            .state('app.adduser', {
                url: '/adduser',
                templateUrl: 'views/app/adduser.view.html'
            })
            .state('app.manageuser', {
                url: '/manageuser',
                templateUrl: 'views/app/manageuser.view.html'
            })
            .state('app.addpost', {
                url: '/addpost',
                templateUrl: 'views/app/addpostings.view.html'
            })
            .state('app.addindustry', {
                  url: '/addindustry',
                  templateUrl: 'views/app/addindustry.view.html'
            })
            .state('app.manageindustry', {
                    url: '/manageindustry',
                    templateUrl: 'views/app/manageindustry.view.html'
              })
            .state('app.managepost', {
                  url: '/managepost',
                  templateUrl: 'views/app/managepost.view.html'
            })

    });
