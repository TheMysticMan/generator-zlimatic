import {HomeController} from './home.controller.js';

const MODULE_NAME = 'home';

export default angular.module(MODULE_NAME, [])
    .controller('HomeController', HomeController);