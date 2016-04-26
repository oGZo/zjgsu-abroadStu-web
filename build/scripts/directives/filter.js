angular.module('Filter', [])
    .filter('sexFun', function() {
        return function(arr) {
            var sexJson = {
                0 : '男',
                1 : '男',
                2 : '女'
            };
            arr = arr || [];
            $.each(arr,function(i,v){
                v.sexText = sexJson[v.sex];
            })
            return arr;
        };
    });
