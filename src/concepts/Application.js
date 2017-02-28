/* eslint new-cap: 0 */
import { assert, isFunction } from '../utils/fn.js';
import { apply as applyEventBus } from './EventBus.js';

/**
 * A application is a singletone instance that
 *  - consists from independent modules
 *  - has life-cycle 'init' and 'done'
 *  - enables unified event-driven interaction between modules
 */
const application = {

  init(modulesConfig) {

    applyEventBus(application);

    assert(Array.isArray(modulesConfig), 'Modules config has to be an array');

    const modules = modulesConfig.map(cfg => new cfg.type({ application, ...cfg }));

    application.done = () => Promise
      .all(modules.filter(m => isFunction(m.done)).map(m => m.done()))
      .then(() => application);

    return Promise
      .all(modules.filter(m => isFunction(m.init)).map(m => m.init()))
      .then(() => application);
  }
};

export default application;
