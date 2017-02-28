
// Monad - a value wrapper with map, join,chain,ap
export const Monad = {

  ...Identity,
  ...Chain,
  ...Applicative
};

const monadT = {
  map:($, fn) => monadT($.monad.map(v=> v.map(fn))),
  chain:($, fn) => monadT($.monad.map(v => v.chain(fn))),
  ap:($, monadWithFn)=> monadT.of($.monad.chain(v=> monadWithFn.perform().map(v2=>v.ap(v2)))),
  perform:($) => $.monad
};
// Add aliases

function addAliases(type) {
  type.prototype.flatMap = type.prototype.chain = type.prototype.bind;
  type.pure = type.unit = type.of;
  type.prototype.of = type.of;
  if (type.prototype.append != null) {
      type.prototype.concat = type.prototype.append;
  }
  type.prototype.point = type.prototype.pure = type.prototype.unit = type.prototype.of;
}

// Wire up aliases
function addMonadOps(type) {
  type.prototype.join = function () {
      return this.flatMap(idFunction);
  };

  type.map2 = function (fn) {
      return function (ma, mb) {
          return ma.flatMap(function (a) {
              return mb.map(function (b) {
                  return fn(a, b);
              });
          });
      };
  };
}

function addApplicativeOps(type) {
  type.prototype.takeLeft = function (m) {
      return apply2(this, m, function (a, b) {
          return a;
      });
  };

  type.prototype.takeRight = function (m) {
      return apply2(this, m, function (a, b) {
          return b;
      });
  };
}
