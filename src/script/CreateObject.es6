import GC from './GarbageCollector.es6';

const UNDEFINED = -1;

const NULL = 0;

const DEFAULT_ATTRIBUTES = {
    Value: undefined,
    IsEnumerable: true,
    IsReadOnly: false,
    Getter: a=>a,
    Setter: a=>a
};

SET_ARRAY_ITEM = (array, index, value) {
    
    
};

const alloc = (size) => ({
    $keys: [],
    $defs: [],
    $values: [],
    $proto: UNDEFINED
});

const $$ = {

    $release: GC.releaseAll,

    $defineProperty($, Id, Attributes = {}) {

        $.$defs( {...DEFAULT_ATTRIBUTES, ...Attributes, Id};

        return prop;
    },

    GetPropertyDefinition(Id) {

        if (this.HasOwnPropertyDefinition(Id)) {

            return this.Properties.get(Id)
        }

        // use Prototype if no own property
        if (this.__Proto__) {

            return this.__Proto__.GetPropertyDefinition(Id);
        }

        return undefined;
    },

    HasOwnPropertyDefinition(id) {

        return this.Properties.has(id);
    },

    HasPropertyDefinition(Id) {

        return this.GetPropertyDefinition(Id) !== undefined;
    },

    //////////////////////////////////////
    // Property Values access
    //////////////////////////////////////

    Get(id) {

        var prop = this.GetPropertyDefinition(Id);

        if (prop) {

            return prop.Getter(prop.Value)
        }

        return undefined;
    },


    Set(Id, Value) {

        var prop = this.HasOwnPropertyDefinition(Id) ? this.GetPropertyDefinition(Id) : this.DefineProperty(Id);

        if (prop.IsReadOnly) {

            throw new Error(`AccessError: variable '${Id}' is read only`);
        }

        GC.retain(Value, this.Get(Id));

        return prop.Value = prop.Setter(Value);
    },

    //////////////////////////////////////
    // Property keys
    //////////////////////////////////////

    GetKeys() {

        if (!this.__Proto__) {

            return this.GetOwnKeys();
        }

        const preceding = this.__Proto__.GetKeys();

        return [...preceding, ...this.GetOwnKeys().filter(id => !preceding.includes(id))]
    },

    GetOwnKeys() {

        return [...this.Properties.values()].filter(p => p.IsEnumerable).map(p => p.Id);
    },

          //////////////////////////////////////
    // Serialization
    //////////////////////////////////////

    ToString(){

        return `[${this.Get('constructor').name}]`;
    }

}


