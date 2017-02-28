
export const IO = {
  ...Monad,
  init: ($) => ({
    effect: isFunction($.effect) ? $.effect : () => $.effect
  }),
  map: ($, fn) => $.of( () => fn($.effect())),
  chain: ($, fn) => $.of( () => fn($.effect()).run()),
  ap: ($, ioWithFn) => ioWithFn.map(fn => fn($.effect())),
  run: ($) => $.effect()
};

function wrapReader(fn, args) {
    args = args || [];
    return function () {
        var args1 = args.concat(getArgs(arguments));
        var self = this;
        return args1.length + 1 >= fn.length ?
            Reader(function (c) {
                return fn.apply(self, args1.concat(c));
            }) :
            wrapReader(fn, args1);
    };
}


Reader = {
  $of: (x) => Reader(_ => x),
  $ask: () => Reader(idFunction),

  run: ($, config) => $.valueOf()(config),
  chain: ($, fn) => Reader((config) => fn($.run(config)).run(config)),
  ap: ($, readerWithFn) => readerWithFn.chain(fn => Reader(config=>fn($.run(config)))),
  map: ($, fn) => Reader(config=>fn($.run(config))),
  local: ($, fn) => Reader(c => $.run(fn(c)))
};

export const Suspend = {

  resume: ($) => Left($.valueOf()),

  bind: ($, fn) => Suspend(isFunction($.valueOf()) ?
                      compose( (free) =>free.bind(fn), $.valueOf()) :
                      $.valueOf().map( (free) => free.bind(fn)))
};
export const Return = {

  resume: ($) => Right($.valueOf()),

  bind: ($, fn) => fn($.valueOf())
};

export const Free = {

  $of: (a) => Return(a),

  $liftF: (functor) => Suspend( isFunction(functor) ? compose(Return, functor) : functor.map(Return)),

  run: ($) => $.go(f => f()),

  ap: ($, ff) => $.bind( (x) => ff.map(f => f(x)) ),

  go1($, f) {

      const go2 = $$ => $$.resume().cata( functor => go2(f(functor)), idFunction);

      return go2($);
  },
  go($, f) {

      for (
        let result = $.resume();
        result.isLeft();
        result = f(result.left()).resume()
      ) {}

      return result.right();
  }

};
