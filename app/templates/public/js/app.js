/* globals angular */
import Navigation from "./modules/navigation";
import {Routes} from "./modules/routes";
import Home from './modules/home';
import Main from './modules/main';

export default angular
    .module("<%= app.name %>", ['ui.router', 'ngResource', 'ngCookies', 'ngSanitize',
        Navigation.name,
        Home.name,
        Main.name
    ])
    .config(Routes)
    .run(function () {
        'ngInject';
    });