class NavigationController
{
    constructor($scope, $state)
    {
        'ngInject';

        this.$state = $state;
        $scope.name = "Nav";

        $scope.pages =
            [
                {
                    state: 'home',
                    displayValue : 'Home',
                    index: 1
                }
            ];

        $scope.isActive = function (state) {

            return state === $state.current.name;
        };
    }
}

export {NavigationController};