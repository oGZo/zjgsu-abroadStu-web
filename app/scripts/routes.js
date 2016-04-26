define([], function()
{
    return {
        defaultRoutePath: '/',
        routes: {
            'login': {
                url : '/login',
                abstract: true,
                templateUrl: '/views/login.html',
                dependencies: [
                    'controllers/LoginViewController'
                ],
                controller : 'LoginViewController'
            },
            'app': {
                url : '',
                abstract: true,
                templateUrl: '/views/layout.html',
                dependencies: [
                    'controllers/LayoutViewController'
                ],
                controller : 'LayoutViewController'
            },
            'app.manage': {
                url : '/manage',
                templateUrl: '/views/manage.html',
                dependencies: [
                    'controllers/ManageViewController'
                ],
                controller: 'ManageViewController'
            },
            'app.teacher': {
                url : '/teacher',
                templateUrl: '/views/teacher.html',
                dependencies: [
                    'controllers/TeacherViewController'
                ],
                controller: 'TeacherViewController'
            },
            'app.student': {
                url : '/student',
                templateUrl: '/views/student.html',
                dependencies: [
                    'controllers/StudentViewController'
                ],
                controller: 'StudentViewController'
            }
        }
    };
});