define([], function()
{
    return {
        defaultRoutePath: '/',
        // routes: {
        //     '/': {
        //         templateUrl: '/views/student.html',
        //         dependencies: [
        //             'controllers/HomeViewController'
        //         ]
        //     },
        //     '/about/:person': {
        //         templateUrl: '/views/about.html',
        //         dependencies: [
        //             'controllers/AboutViewController',
        //             'directives/app-color'
        //         ]
        //     },
        //     '/contact': {
        //         templateUrl: '/views/contact.html',
        //         dependencies: [
        //             'controllers/ContactViewController'
        //         ]
        //     }
        // }
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
            'register': {
                url : '/register',
                abstract: true,
                templateUrl: '/views/register.html',
                dependencies: [
                    'controllers/RegisterViewController'
                ],
                controller : 'RegisterViewController'
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
            'app.home': {
                url : '/home',
                templateUrl: '/views/student.html',
                dependencies: [
                    'controllers/HomeViewController'
                ],
                controller: 'HomeViewController',
                //css: '/styles/home.css'

            },
            'app.person': {
                url : '/person',
                templateUrl: '/views/person.html',
                dependencies: [
                    'controllers/PersonViewController'
                ],
                controller : 'PersonViewController'
            },
            'app.order': {
                url : '/order',
                templateUrl: '/views/order.html',
                dependencies: [
                    'controllers/OrderViewController'
                ],
                controller: 'OrderViewController'
            },
            'app.orderDetail': {
                url : '/orderDetail',
                templateUrl: '/views/orderDetail.html',
                dependencies: [
                    'controllers/OrderDetailViewController'
                ],
                controller: 'OrderDetailViewController'
            },
            'app.apply': {
                url : '/apply',
                templateUrl: '/views/apply.html',
                dependencies: [
                    'controllers/ApplyViewController'
                ],
                controller : 'ApplyViewController'
            },
            'app.healthFile': {
                url : '/healthFile',
                templateUrl: '/views/healthFile.html',
                dependencies: [
                    'controllers/HealthFileViewController'
                ],
                controller : 'HealthFileViewController'
            },
            'app.health': {
                url : '/health',
                templateUrl: '/views/health.html',
                dependencies: [
                    'controllers/HealthViewController'
                ],
                controller : 'HealthHomeViewController'
            },
            'app.course': {
                url : '/course',
                templateUrl: '/views/course.html',
                dependencies: [
                    'controllers/CourseViewController'
                ],
                controller : 'CourseViewController'
            },
            'app.recordsTreatment': {
                url : '/recordsTreatment',
                templateUrl: '/views/recordsTreatment.html',
                dependencies: [
                    'controllers/RecordsTreatmentController'
                ],
                controller : 'RecordsTreatmentController'
            },
            'app.recordsTreatmentAdd': {
                url : '/recordsTreatmentAdd',
                templateUrl: '/views/recordsTreatmentAdd.html',
                dependencies: [
                    'controllers/RecordsTreatmentAddController'
                ],
                controller : 'RecordsTreatmentAddController'
            },
            'app.recordsTreatmentAddDetail': {
                url : '/recordsTreatmentAddDetail',
                templateUrl: '/views/recordsTreatmentAddDetail.html',
                dependencies: [
                    'controllers/RecordsTreatmentAddDetailController'
                ],
                controller : 'RecordsTreatmentAddDetailController'
            },
            'app.recordsVisit': {
                url : '/recordsVisit',
                templateUrl: '/views/recordsVisit.html',
                dependencies: [
                    'controllers/RecordsVisitController'
                ],
                controller : 'RecordsVisitController'
            },
            'app.recordsConsult': {
                url : '/recordsConsult',
                templateUrl: '/views/recordsConsult.html',
                dependencies: [
                    'controllers/RecordsConsultController'
                ],
                controller : 'RecordsConsultController'
            },
            'app.customer': {
                url : '/customer',
                templateUrl: '/views/customer.html',
                dependencies: [
                    'controllers/CustomerViewController'
                ],
                controller : 'CustomerViewController'
            },
            'app.patient': {
                url : '/patient',
                templateUrl: '/views/patient.html',
                dependencies: [
                    'controllers/PatientViewController'
                ],
                controller : 'PatientViewController'
            },
            'app.healthPatient': {
                url : '/healthPatient',
                templateUrl: '/views/healthPatient.html',
                dependencies: [
                    'controllers/HealthPatientViewController'
                ],
                controller : 'HealthPatientViewController'
            },
            'app.consultPhone': {
                url : '/consultPhone',
                templateUrl: '/views/consultPhone.html',
                dependencies: [
                    'controllers/ConsultPhoneViewController'
                ],
                controller : 'ConsultPhoneViewController'
            },
            'app.invite': {
                url : '/invite',
                templateUrl: '/views/invite.html',
                dependencies: [
                    'controllers/InviteViewController'
                ],
                controller : 'InviteViewController'
            },
            'app.comment': {
                url : '/comment',
                templateUrl: '/views/comment.html',
                dependencies: [
                    'controllers/CommentViewController'
                ],
                controller : 'CommentViewController'
            },
            'app.coupon': {
                url : '/coupon',
                templateUrl: '/views/coupon.html',
                dependencies: [
                    'controllers/CouponViewController'
                ],
                controller : 'CouponViewController'
            },
            'app.memberCard': {
                url : '/memberCard',
                templateUrl: '/views/memberCard.html',
                dependencies: [
                    'controllers/MemberCardViewController'
                ],
                controller : 'MemberCardViewController'
            },
            'app.addPhoneConsultRecord': {
                url : '/addConsultRecord',
                templateUrl: '/views/addConsultRecord.html',
                dependencies: [
                    'controllers/addConsultRecordViewController'
                ],
                controller : 'addConsultRecordViewController'
            },
            'app.addFollowUpRecord': {
                url : '/addFollowUpRecord',
                templateUrl: '/views/addFollowUpRecord.html',
                dependencies: [
                    'controllers/addFollowUpRecordViewController'
                ],
                controller : 'addFollowUpRecordViewController'
            }
        }
    };
});