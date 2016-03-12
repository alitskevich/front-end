const DEFAULT_ATTRIBUTES = {
    Value: undefined,
    isEnumerable: true,
    isReadOnly: false,
    getter: (a)=>a,
    setter: (a)=>a
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

    GetPropertyDefinition(Id) {

        if (this.HasOwnPropertyDefinition(Id)) {

            return this.Properties.get(Id)
        }

        // use Prototype if no own property
        if (this.__Proto__) {

            return this.__Proto__.GetPropertyDefinition(Id);
        }

        return undefined;
    }

    HasOwnPropertyDefinition(id) {

        return this.Properties.has(id);
    }

    HasPropertyDefinition(Id) {

        return this.GetPropertyDefinition(Id) !== undefined;
    }

    Get(id) {

        var prop = this.GetPropertyDefinition(Id);

        if (prop) {

            return prop.getter(prop.Value)
        }

        return undefined;
    }


    Set(Id, Value) {

        var prop = this.HasOwnPropertyDefinition(Id) ? this.GetPropertyDefinition(Id) : this.DefineProperty(Id);

        if (prop.isReadOnly) {

            throw new Error(`AccessError: variable '${Id}' is read only`);
        }

        return prop.Value = prop.setter(Value);
    }

    GetKeys(ownOnly) {
        
        const preceding = ownOnly || !this.__Proto__ ? [] : this.__Proto__.GetKeys(true);
        
        return [...preceding, ...this.Properties.values()]
            .filter((V) => (V.isEnumerable && !preceding.includes(V.Id)))
            .map(() => V.Id)
    }
}