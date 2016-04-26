define([], function()
{
    return function(dependencies)
    {
        var definition =
        {
            resolver: ['$q','$route','$rootScope', function($q,$route ,$rootScope)
            {
                var deferred = $q.defer();
                require(dependencies, function()
                {
                    $rootScope.$apply(function()
                    {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }]
        }

        return definition;
    }
});