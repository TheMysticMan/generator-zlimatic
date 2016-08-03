class NavigationDirective
{
    constructor()
    {
        'ngInject';

        this.templateUrl = "partials/navigation.jade";
    }

    link(scope, elem, attrs, ngModelController)
    {
    }

    /**
     * angular needs a direectiveFactory
     * @returns {*}
     */
    static directiveFactory(){
        NavigationDirective.instance = new NavigationDirective();
        return NavigationDirective.instance;
    }
}

export {NavigationDirective};