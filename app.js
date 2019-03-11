/**
 * Created by zhagtingjiang on 2018/12/20.
 */
var app = angular.module('my-app',['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/',{
        controller:'mainCtr',
        templateUrl:'src/views/main/main.html'
    })
    .when('/home',{
        controller:'homeCtr',
        templateUrl:'src/views/home/home.html'
    })
    .when('/page',{
        controller:'pageCtr',
        templateUrl:'src/views/page/page.html'
    })
    .when('/admin',{
        controller:'adminCtr',
        templateUrl:'src/views/admin/admin.html'
    })
    .when('/about',{
        controller:'aboutCtr',
        templateUrl:'src/views/about/about.html'
    });
}]);