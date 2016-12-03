    // List and NEL monads commons


export const cons(head, tail) {
        return tail.cons(head)
    }
    function listEquals(list1, list2) {
        var a = list1
        var b = list2
        while (!a.isNil && !b.isNil) {
            if (!equals(a.head())(b.head())) {
                return false
            }
            a = a.tail()
            b = b.tail()
        }
        return a.isNil && b.isNil
    }

    function listMapC(fn, l) {
        return l.isNil ? Return(l) : Suspend(function () {
            return listMapC(fn, l.tail())
        }).map(curry(cons, [])(fn(l.head())))
    }

    function listMap(fn, l) {
        return listMapC(fn, l).run()
    }

    function listFilter(list, fn) {
        return list.foldRight(Nil)(function (a, acc) {
            return fn(a) ? cons(a, acc) : acc
        })
    }
    
    // List monad
    function List() {
        switch (arguments.length) {
            case 0: return new List.fn.init()
            case 1: return new List.fn.init(arguments[0])
            default: return new List.fn.init(arguments[0], arguments[1])
        }
    }

    root.List = List

    var listEach = function (effectFn, l) {
        if (!l.isNil) {
            effectFn(l.head())
            listEach(effectFn, l.tail())
        }
    }

    var foldLeft = function (fn, acc, l) {
        function fL(acc, l) {
            return l.isNil ?
                Return(acc) :
                Suspend(function () {
                    return fL(fn(acc, l.head()), l.tail())
                })
        }

        return fL(acc, l).run()
    }

    var foldRight = function (fn, l, acc) {
        function fR(l, acc) {
            return l.isNil ?
                Return(acc) :
                Suspend(function () {
                    return fR(l.tail(), acc)
                }).map(function (acc1) {
                    return fn(l.head(), acc1)
                })
        }

        return fR(l, acc).run()
    }


    var append = function (list1, list2) {
        function append1(list1, list2) {
            return list1.isNil ?
                Return(list2) :
                Suspend(function () {
                    return append1(list1.tail(), list2).map(function (list) {
                        return list.cons(list1.head())
                    })
                })
        }

        return append1(list1, list2).run()
    }

    var sequence = function (list, type) {
        return list.foldRight(type.of(Nil))(type.map2(cons))
    }

    var sequenceValidation = function (list) {
        return list.foldLeft(Success(Nil))(function (acc, a) {
            return acc.ap(a.map(function (v) {
                return function (t) {
                    return cons(v, t)
                }
            }))
        }).map(listReverse)
    }

    var listReverse = function (list) {
        return list.foldLeft(Nil)(swap(cons))
    }

    var listAp = function (list1, list2) {
        return list1.bind(function (x) {
            return list2.map(function (f) {
                return f(x)
            })
        })
    }

    var Nil

    List.fn = List.prototype = {
        init() {
            var head = arguments[0];
            var tail = arguments[1];
            if (arguments.length === 0) {
                this.isNil = true
                this.size_ = 0
            } else {
                this.isNil = false
                this.head_ = head
                this.tail_ = tail || Nil
                this.size_ = this.tail_.size() + 1
            }
        },
        of(value) {
            return new List(value)
        },
        size() {
            return this.size_
        },
        equals(other) {
            return isFunction(other.head) && listEquals(this, other)
        },
        cons(head) {
            return List(head, this)
        },
        snoc(element) {
            return this.concat(List(element))
        },
        map(fn) {
            return listMap(fn, this)
        },
        toArray() {
            return foldLeft(function (acc, e) {
                acc.push(e)
                return acc
            }, [], this)
        },
        foldLeft(initialValue) {
            var self = this
            return function (fn) {
                return foldLeft(fn, initialValue, self)
            }
        },
        foldRight(initialValue) {
            var self = this
            return function (fn) {
                return foldRight(fn, self, initialValue)
            }
        },
        append(list2) {
            return append(this, list2)
        },
        filter(fn) {
            return listFilter(this, fn)
        },
        flatten() {
            return foldRight(append, this, Nil)
        },
        flattenMaybe() {
            return this.flatMap(Maybe.toList)
        },
        reverse() {
            return listReverse(this)
        },
        bind(fn) {
            return this.map(fn).flatten()
        },
        each(effectFn) {
            listEach(effectFn, this)
        },
        // transforms a list of Maybes to a Maybe list
        sequenceMaybe() {
            return sequence(this, Maybe)
        },
        sequenceValidation() {
            return sequenceValidation(this)
        },
        sequenceEither() {
            return sequence(this, Either)
        },
        sequenceIO() {
            return sequence(this, IO)
        },
        sequenceReader() {
            return sequence(this, Reader)
        },
        sequence(monadType) {
            return sequence(this, monadType)
        },
        head() {
            return this.head_
        },
        headMaybe() {
            return this.isNil ? None() : Some(this.head_)
        },
        tail() {
            return this.isNil ? Nil : this.tail_
        },
        tails() {
            return this.isNil ? List(Nil, Nil) : this.tail().tails().cons(this)
        },
        ap(list) {
            return listAp(this, list)
        },
        isNEL: falseFunction,
        toString() {
            return this.isNil ? 'Nil' : 'List(' + this.toArray().join(', ') + ')'
        },
        inspect() {
            return this.toString()
        }
    }

    List.fn.init.prototype = List.fn

    // Aliases

    List.prototype.empty = function () {
        return Nil
    }

    List.fromArray = function (array) {
        return array.reduceRight(function (acc, next) {
            return acc.cons(next)
        }, Nil)
    }

    List.of = function (a) {
        return new List(a, Nil)
    }

    Nil = root.Nil = new List.fn.init()
