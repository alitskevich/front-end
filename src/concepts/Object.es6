
const DEFAULT_ATTRIBUTES = {
    Value: undefined,
    isEnumerable: true,
    isReadOnly: false
};

class Obj {

    constructor(Constructor, Proto=null) {

        this.Properties = new Map();
        this.Constructor = Constructor;
        this.Proto = Proto;
    }

    DefineProperty(Id, attributes = {}) {

        var prop = {Id, ...DEFAULT_ATTRIBUTES, ...attributes};

        this.Properties.set(Id, prop);

        return prop;
    }

    Get__Proto__() {

        // use explicit Proto or get from constructor
        return this.Proto || this.Constructor.Prototype;
    }

    Set__Proto__(Proto) {
        
        if(Proto) {
            
            this.Proto = Proto;
        }
    }

    Get(id) {

        if (this.Properties.has(id)) return this.Properties.get(id);

        // only need of Prototype is to share its properties this host object
        const proto = this.Get__Proto__();
        if (proto) return proto.Get(id);

        return undefined;
    }

    Set(Id, Value) {

        var prop = this.Properties.get(Id) || this.DefineProperty(Id);

        if (prop.isReadOnly) {
            throw new Error(`AccessError: variable '${Id}' is read only`);
        }

        return prop.Value = Value;
    }

    GetKeys() {

        return [...this.Properties.values()].filter((V) => V.isEnumerable).map(() => V.Id)
    }
}
