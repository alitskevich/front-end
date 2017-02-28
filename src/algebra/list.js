// List and NEL monads commons

export const cons = (head, tail) => tail.cons(head);

function listEquals(list1, list2) {
  var a = list1;
  var b = list2;
  while (!a.isNil && !b.isNil) {
      if (!equals(a.head())(b.head())) {
          return false;
      }
      a = a.tail();
      b = b.tail();
  }
  return a.isNil && b.isNil;
}

var foldLeft = function (fn, acc, l) {
  function fL(acc, l) {
      return l.isNil ?
          Return(acc) :
          Suspend( () => fL(fn(acc, l.head()), l.tail()) );
  }

  return fL(acc, l).run();
};

var foldRight = function (fn, l, acc) {
  function fR(l, acc) {
      return l.isNil ?
          Return(acc) :
          Suspend(() => fR(l.tail(), acc)).map( (acc1) => fn(l.head(), acc1) );
  }

  return fR(l, acc).run();
};

export const Nil = {
  size: () => 0,
  map:($, fn) => Return($).run(),
  toString: ($) => 'Nil'
};

export const List = {

    init($, head, tail) {
        if (arguments.length === 0) {
            $.isNil = true;
            $.size_ = 0;
        } else {
            $.isNil = false;
            $.head_ = head;
            $.tail_ = tail || Nil;
            $.size_ = $.tail_.size() + 1;
        }
    },
    size() {
        return $.size_;
    },
    equals: ($, other) => isFunction(other.head) && listEquals($, other),
    cons: ($, head) => List(head, $),
    snoc: ($, element) => $.concat(List(element)),
    map:($, fn) => Suspend(() => $.tail().map(fn)).map(curry(cons, [])(fn($.head()))).run(),
    toArray: ($) => foldLeft( (acc, e) =>( acc.push(e), acc), [], $),
    foldLeft: ($, initialValue) => fn => foldLeft(fn, initialValue, $),
    foldRight: ($, initialValue) => fn => foldRight(fn, $, initialValue),
    append: ($, list2) => {
        const append1 = (l1, l2) => l1.isNil ?
                Return(l2) :
                Suspend( () => append1(l1.tail(), l2).map((list) => list.cons(l1.head()) ));

        return append1(list1, list2).run();
    },
    filter:($, fn) => $.foldRight(Nil)( (a, acc) => fn(a) ? cons(a, acc) : acc ),
    flatten: ($) => foldRight(append, $, Nil),
    flattenMaybe: ($) => $.flatMap(Maybe.toList),
    reverse: ($) => $.foldLeft(Nil)(swap(cons)),
    bind: ($, fn) => $.map(fn).flatten(),
    each: ($, fn) => ( $.isNil ? null : (fn($.head()), $.tail().each(fn))),
    head: ($) => $.head_,
    headMaybe: ($) => $.isNil ? None() : Some($.head_),
    tail: ($) => $.isNil ? Nil : $.tail_,
    tails: ($) => $.isNil ? List(Nil, Nil) : $.tail().tails().cons($),
    ap: ($, list) => $.bind(x => list2.map( f => f(x))),
    isNEL: falseFunction,
    toString: ($) => 'List(' + $.toArray().join(', ') + ')',

    sequence:($, type) => $.foldRight(type.of(Nil))(type.map2(cons)),
    // transforms a list of Maybes to a Maybe list
    sequenceMaybe: ($) => $.sequence(Maybe),
    sequenceValidation:  ($) => $.foldLeft(Success(Nil))( (acc, a) => acc.ap(a.map( v => t => cons(v, t)))).map(listReverse),
    sequenceEither: ($) => $.sequence(Either),
    sequenceIO: ($) => $.sequence(IO),
    sequenceReader: ($) => $.sequence(Reader)
};
// Aliases

List.prototype.empty = function () {
    return Nil;
};

List.fromArray = function (array) {
    return array.reduceRight(function (acc, next) {
        return acc.cons(next);
    }, Nil);
};

List.of = function (a) {
    return new List(a, Nil);
};

Nil = root.Nil = new List.fn.init();


/*
 * Non-Empty List monad
 * This is also a comonad because there exists the implementation of extract(copure), which is just head
 * and cobind and cojoin.
 *
 */

function NEL(head, tail) {
    if (head == null) {
        throw 'Cannot create an empty Non-Empty List.';
    }
    return new NEL.fn.init(head, tail);
}

root.NEL = root.NonEmptyList = NEL;

NEL.of = function (a) {
    return NEL(a, Nil);
};

NEL.fn = NEL.prototype = {
  init(head, tail) {
      if (head == null) {
          this.isNil = true;
          this.size_ = 0;
      } else {
          this.isNil = false;
          this.head_ = head;
          this.tail_ = tail == null ? Nil : tail;
          this.size_ = this.tail_.size() + 1;
      }
  },
  equals(other) {
      if (!isFunction(other.head)) {
          return false;
      }
      return listEquals(this, other);
  },
  map(fn) {
      return NEL(fn(this.head_), listMap(fn, this.tail_));
  },

  bind(fn) {
      var p = fn(this.head_);
      if (!p.isNEL()) {
          throw 'function must return a NonEmptyList.';
      }
      var list = this.tail().foldLeft(Nil.snoc(p.head()).append(p.tail()))(function (acc, e) {
          var list2 = fn(e).toList();
          return acc.snoc(list2.head()).append(list2.tail());
      });

      return new NEL(list.head(), list.tail());
  },

  head() {
      return this.head_;
  },

  tail() {
      return this.tail_;
  },
  // NEL[A] -> NEL[NEL[A]]
  tails() {
      var listsOfNels = this.toList().tails().map(NEL.fromList).flattenMaybe();
      return NEL(listsOfNels.head(), listsOfNels.tail());
  },
  toList() {
      return List(this.head_, this.tail_);
  },
  reverse() {
      if (this.tail().isNil) {
          return this;
      } else {
          var reversedTail = this.tail().reverse();
          return NEL(reversedTail.head(), reversedTail.tail().append(List(this.head())));
      }
  },
  foldLeft(initialValue) {
      return this.toList().foldLeft(initialValue);
  },
  foldRight(initialValue) {
      return this.toList().foldRight(initialValue);
  },
  reduceLeft(fn) {
      return this.tail().foldLeft(this.head())(fn);
  },
  filter(fn) {
      return listFilter(this.toList(), fn);
  },
  append(list2) {
      return NEL.fromList(this.toList().append(list2.toList())).some();
  },
  // NEL[A] -> (NEL[A] -> B) -> NEL[B]
  cobind(fn) {
      return this.cojoin().map(fn);
  },
  size() {
      return this.size_;
  },
  isNEL: trueFunction,
  toString() {
    return 'NEL(' + this.toArray().join(', ') + ')';
  }
};

NEL.fromList = function (list) {
    return list.isNil ? None() : Some(NEL(list.head(), list.tail()));
};

NEL.fn.init.prototype = NEL.fn;
NEL.prototype.toArray = List.prototype.toArray;
NEL.prototype.extract = NEL.prototype.copure = NEL.prototype.head;
NEL.prototype.cojoin = NEL.prototype.tails;
NEL.prototype.coflatMap = NEL.prototype.mapTails = NEL.prototype.cobind;
NEL.prototype.ap = List.prototype.ap;
