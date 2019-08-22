//var { version } = require('../package.json');
import crumbHandler from './main/crumb';
import routeHandler from './main/route';
import windowHandler from './main/window';


export default {
    //version,
    windowHandler,
    crumbHandler,
    routeHandler
};