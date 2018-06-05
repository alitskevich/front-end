const global = $$OBJECT({})
const MODULES = {}

global.require= (path)=>{
    return MODULES[path];
}

// ...