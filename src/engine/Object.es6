const DEFAULT_ATTRIBUTES = {
    Value: undefined,
    isEnumerable: true,
    isReadOnly: false
};

export default class Obj {

    constructor(Proto=null) {

        this.Properties = new Map();

        // only need of Prototype is to share its properties if this host object has no such ones
        this.__Proto__ = Proto;
    }

    DefineProperty(Id, attributes = {}) {

        var prop = {Id, ...DEFAULT_ATTRIBUTES, ...attributes};

        this.Properties.set(Id, prop);

        return prop;
    }

    GetPropertyDefinition(Id, require) {

        return this.Properties.get(Id) || (require ? this.DefineProperty(Id) : undefined);
    }

    HasPropertyDefinition(id, ownOnly) {

        if (this.Properties.has(id)) return true;

        if (!ownOnly && this.__Proto__) return proto.Has(id);

        return false;
    }
    
    Get(id) {

        if (this.Properties.has(id)) return this.Properties.get(id);

        // only need of Prototype is to share its properties this host object
        if (this.__Proto__) return proto.Get(id);

        return undefined;
    }


    Set(Id, Value) {

        var prop = this.GetPropertyDefinition(Id, true);

        if (prop.isReadOnly) {
            throw new Error(`AccessError: variable '${Id}' is read only`);
        }

        return prop.Value = Value;
    }

    GetKeys(ownOnly) {
        
        const preceding = ownOnly || !this.__Proto__ ? [] : this.__Proto__.GetKeys(true);
        
        return [...preceding, ...this.Properties.values()]
            .filter((V) => (V.isEnumerable && !preceding.includes(V.Id)))
            .map(() => V.Id)
    }
}