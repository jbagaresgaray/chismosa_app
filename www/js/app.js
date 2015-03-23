var firebaseUrl = "https://burning-fire-4853.firebaseio.com/";


var Application = Application || {};

Application.Controllers = angular.module('todo.controllers', []);
Application.Services = angular.module('todo.services', []);
Application.Directive = angular.module('todo.directive', []);

angular.module('todo', ['ionic', 'firebase', 'angularMoment', 'todo.controllers', 'todo.services', 'todo.directive'])
    .constant('msdElasticConfig', {
        append: ''
    })
    .run(function($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            ionic.Platform.fullScreen();

            $rootScope.firebaseUrl = firebaseUrl;
            $rootScope.displayName = null;
            $rootScope.user = [];

            Auth.$onAuth(function(authData) {
                if (authData) {
                    console.log("Logged in as:", authData.uid);
                } else {
                    console.log("Logged out");
                    $ionicLoading.hide();
                    $location.path('/login');
                }
            });

            $rootScope.logout = function() {
                console.log("Logging out from the app");
                window.localStorage.removeItem("users");
                $ionicLoading.show({
                    template: 'Logging Out...'
                });
                Auth.$unauth();
            }


            $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
                if (error === "AUTH_REQUIRED") {
                    $location.path("/login");
                }
            });
        });
    })

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl',
            resolve: {
                "currentAuth": ["Auth",
                    function(Auth) {
                        return Auth.$waitForAuth();
                    }
                ]
            }
        })
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html",
            controller: 'AppCtrl',
            resolve: {
                "currentAuth": ["Auth",
                    function(Auth) {
                        return Auth.$requireAuth();
                    }
                ]
            }
        })
        .state('tab.home', {
            url: "/home",
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab-home.html',
                    // controller: 'RoomsCtrl'
                }
            }
        })
        .state('tab.contacts', {
            url: '/contacts',
            views: {
                'tab-contacts': {
                    templateUrl: 'templates/tab-contacts.html',
                    controller: 'ContactsCtrl'
                }
            }
        })
        .state('tab.chatdetail', {
            url: '/chatdetail/:id',
            views: {
                'tab-chat': {
                    templateUrl: 'templates/tab-chatDetail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })
        .state('tab.chat', {
            url: '/chat',
            views: {
                'tab-chat': {
                    templateUrl: 'templates/tab-message.html',
                    controller: 'ChatCtrl'
                }
            }
        })
        .state('tab.profile', {
            url: "/profile",
            views: {
                'tab-profile': {
                    templateUrl: "templates/tab-profile.html",
                    // controller: 'ProfileCtrl'
                }
            }
        })
        /*.state('forgot', {
            url: "/forgot",
            templateUrl: "templates/forgot.html",
            controller: 'ForgotCtrl'
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "templates/signup.html",
            controller: 'SignupCtrl'
        })
        .state('intro', {
            url: "/intro",
            templateUrl: "templates/intro.html",
            controller: 'IntroCtrl'
        })
        .state('app.home', {
            url: "/home",
            views: {
                'home-tab': {
                    templateUrl: "templates/messages.html",
                    controller: 'MsgCtrl'
                }
            }
        })
        .state('app.search', {
            url: "/search",
            views: {
                'menuContent': {
                    templateUrl: "templates/search.html",
                    controller: 'SearchCtrl'
                }
            }
        })
        .state('app.message-detail', {
            url: "/messages/:id",
            views: {
                'menuContent': {
                    templateUrl: "templates/messageDetail.html",
                    controller: 'MsgCtrl'
                }
            }
        });*/

    $urlRouterProvider.otherwise('/login');
});
