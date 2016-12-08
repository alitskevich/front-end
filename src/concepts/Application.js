import { assert, isFunction } from 'utils/fn.js';

const MODULE_TYPES = {};

const app = {
    
    registerModuleType(constr) {
        
        assert(isFunction(constr), 'Module type is not a function');
        
        MODULE_TYPES[constr.name] = constr;
    },
    
    init(defaults) {
        
        Object.assign(app, defaults);
        
        assert(Array.isArray(app.modules), 'No modules config');
        
        const unregisteredTypes = app.modules.map(cfg => cfg.type).filter(type => !MODULE_TYPES[type]);
         
        assert(!unregisteredTypes.length, `Modules types are not registered: ${unregisteredTypes}`);
       
        const modules = app.modules.map(cfg => new MODULE_TYPES[cfg.type]({app, ...cfg}));
        
        app.done = () => Promise.all(modules.filter(m => isFunction(m.done)).map(m => m.done()));
        
        return Promise
            .all(modules.filter(m => isFunction(m.init)).map(m => m.init()))
            .then(() => app);
    }
    
};

export default app;