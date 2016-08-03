import {NavigationDirective} from './navigation.directive.js';
import {NavigationController} from './navigation.controller.js';

const MODULE_NAME = 'navigation';

export default angular.module(MODULE_NAME, [])
    .directive('navigation', NavigationDirective.directiveFactory)
    .controller('navigationController', NavigationController);