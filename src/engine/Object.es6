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

    //////////////////////////////////////
    // Property Definition
    //////////////////////////////////////

    DefineProperty(Id, Attributes = {}) {

        const prop = {...DEFAULT_ATTRIBUTES, ...Attributes, Id};

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

    //////////////////////////////////////
    // Property Values access
    //////////////////////////////////////

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

    //////////////////////////////////////
    // Property keys
    //////////////////////////////////////

    GetKeys() {

        if (!this.__Proto__){

            return this.GetOwnKeys();
        }

        const preceding =  this.__Proto__.GetKeys();

        return [...preceding, ...this.GetOwnKeys().filter(id => !preceding.includes(id))]

    }

    GetOwnKeys() {

        return [...this.Properties.values()].filter(p => p.isEnumerable).map(p => p.Id);
    }

    //////////////////////////////////////
    // Auxilary
    //////////////////////////////////////

    ToString(){

        return `[${this.Get('constructor').name}]`;
    }
}