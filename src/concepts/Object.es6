
const DEFAULT_ATTRIBUTES = {
    Value: undefined,
    isEnumerable: true,
    isReadOnly: false
};

class Obj {

    constructor(Proto=null) {

        this.Properties = new Map();

        this.__Proto__ = Proto;
    }

    DefineProperty(Id, attributes = {}) {

        var prop = {Id, ...DEFAULT_ATTRIBUTES, ...attributes};

        this.Properties.set(Id, prop);

        return prop;
    }

    Get(id) {

        if (this.Properties.has(id)) return this.Properties.get(id);

        // only need of Prototype is to share its properties this host object
        if (this.__Proto__) return this.__Proto__.Get(id);

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