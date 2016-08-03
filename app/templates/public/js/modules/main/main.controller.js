class MainController
{
    constructor($scope, $timeout)
    {
        'ngInject';

        $scope.$on('$viewContentLoaded', function(){
            $timeout(function () {
                jQuery('#page-loader').hide();
            });
        });
    }
}

export {MainController};