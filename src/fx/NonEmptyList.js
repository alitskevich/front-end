
    /*
     * Non-Empty List monad
     * This is also a comonad because there exists the implementation of extract(copure), which is just head
     * and cobind and cojoin.
     *
     */

    function NEL(head, tail) {
        if (head == null) {
            throw 'Cannot create an empty Non-Empty List.'
        }
        return new NEL.fn.init(head, tail)
    }

    root.NEL = root.NonEmptyList = NEL

    NEL.of = function (a) {
        return NEL(a, Nil)
    }

    NEL.fn = NEL.prototype = {
        init(head, tail) {
            if (head == null) {
                this.isNil = true
                this.size_ = 0
            } else {
                this.isNil = false
                this.head_ = head
                this.tail_ = tail == null ? Nil : tail
                this.size_ = this.tail_.size() + 1
            }
        },
        equals(other) {
            if (!isFunction(other.head)) {
                return false
            }
            return listEquals(this, other)
        },
        map(fn) {
            return NEL(fn(this.head_), listMap(fn, this.tail_))
        },

        bind(fn) {
            var p = fn(this.head_)
            if (!p.isNEL()) {
                throw 'function must return a NonEmptyList.'
            }
            var list = this.tail().foldLeft(Nil.snoc(p.head()).append(p.tail()))(function (acc, e) {
                var list2 = fn(e).toList()
                return acc.snoc(list2.head()).append(list2.tail())
            })

            return new NEL(list.head(), list.tail())
        },

        head() {
            return this.head_
        },

        tail() {
            return this.tail_
        },
        //NEL[A] -> NEL[NEL[A]]
        tails() {
            var listsOfNels = this.toList().tails().map(NEL.fromList).flattenMaybe()
            return NEL(listsOfNels.head(), listsOfNels.tail())
        },
        toList() {
            return List(this.head_, this.tail_)
        },
        reverse() {
            if (this.tail().isNil) {
                return this
            } else {
                var reversedTail = this.tail().reverse()
                return NEL(reversedTail.head(), reversedTail.tail().append(List(this.head())))
            }
        },
        foldLeft(initialValue) {
            return this.toList().foldLeft(initialValue)
        },
        foldRight(initialValue) {
            return this.toList().foldRight(initialValue)
        },
        reduceLeft(fn) {
            return this.tail().foldLeft(this.head())(fn)
        },
        filter(fn) {
            return listFilter(this.toList(), fn)
        },
        append(list2) {
            return NEL.fromList(this.toList().append(list2.toList())).some()
        },
        // NEL[A] -> (NEL[A] -> B) -> NEL[B]
        cobind(fn) {
            return this.cojoin().map(fn)
        },
        size() {
            return this.size_
        },
        isNEL: trueFunction,
        toString() {
          return 'NEL(' + this.toArray().join(', ') + ')'
        },
        inspect() {
          return this.toString()
        }
    }

    NEL.fromList = function (list) {
        return list.isNil ? None() : Some(NEL(list.head(), list.tail()))
    }

    NEL.fn.init.prototype = NEL.fn
    NEL.prototype.toArray = List.prototype.toArray
    NEL.prototype.extract = NEL.prototype.copure = NEL.prototype.head
    NEL.prototype.cojoin = NEL.prototype.tails
    NEL.prototype.coflatMap = NEL.prototype.mapTails = NEL.prototype.cobind
    NEL.prototype.ap = List.prototype.ap
