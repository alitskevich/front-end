
function ObjectConstructor($) {
}

const ObjectPrototype = $$OBJ_ROOT

const ObjectStatic = {
    Create (prototype) {
        const type = $typeOf(prototype);
        assert(type === 'object' || prototype === $null,
        `Object prototype may only be an Object or null: undefined ${type}`,
        TypeError
        );
        return $Object(prototype);
    },
    Assign(Target, ...Sources){
        assert(Target, `Unable to assign to ${Target}`);
        Sources.forEach(Source => Assign(Target, Source));
        return Target;
    },
    Keys($){
        const preceding = $.__Proto__ ? $.__Proto__.GetKeys() : [];
        const own = $.GetOwnKeys().filter(Id => !preceding.includes(Id));
        return [ ...preceding, ...own ];
    },
    GetOwnKeys($) {
        return [ ...$.Props.Keys() ].filter( p => p.Enumerable )
    },
    DefineProperties($, props){
        Object.keys(props).forEach(key => DefineProperty($, key, props[ key ]));
    }
}