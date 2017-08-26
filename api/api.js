/* global process, require */

// Libraries
import host from './host';
import Log from './Utilities/log';
import routes from './routes';

import swagger from './Utilities/swagger/swagger';

Log.info('Authentication MicroService', 'main', 'startup sequence beginning.');

host.initialize();
host.mountRoutes(routes);
host.connectDataSource();

// Initialize swagger if the API process is not started in production mode.
if (process.env.NODE_ENV !== 'production') {
  swagger.initialize(__dirname);
  swagger.host(host.getAppInstance());
}

host.listen();
