/**
 *
 *
 The Atomics object provides atomic operations as static methods.
 They are used with SharedArrayBuffer objects.

 The Atomic operations are installed on an Atomics module.
 Unlike the other global objects, Atomics is not a constructor.
 You cannot use it with a new operator or invoke the Atomics object as a function. All properties and methods of Atomics are static (as is the case with the Math object, for example).

 Properties

 Atomics[Symbol.toStringTag]
 The value of this property is "Atomics".

 Methods

 Atomic operations
 When memory is shared, multiple threads can read and write the same data in memory.
 Atomic operations make sure that predictable values are written and read,
 that operations are finished before the next operation starts and that operations are not interrupted.

 Atomics.add()
 Adds a given value at a given position in the array. Returns the old value at that position.
 Atomics.and()
 Computes a bitwise AND at a given position in the array. Returns the old value at that position.
 Atomics.compareExchange()
 Stores a given value at a given position in the array, if it equals a given value. Returns the old value.
 Atomics.exchange()
 Stores a given value at a given position in the array. Returns the old value.
 Atomics.load()
 Returns the value at the given position in the array.
 Atomics.or()
 Computes a bitwise OR at a given position in the array. Returns the old value at that position.
 Atomics.store()
 Stores a given value at the given position in the array. Returns the value.
 Atomics.sub()
 Subtracts a given value at a given position in the array. Returns the old value at that position.
 Atomics.xor()
 Computes a bitwise XOR at a given position in the array. Returns the old value at that position.
 Wait and wake
 The wait() and wake() methods are modeled on Linux futexes ("fast user-space mutex") and provide ways for waiting until a certain condition becomes true and are typically used as blocking constructs.

 Atomics.wait()
 Verifies that a given position in the array still contains a given value and sleeps awaiting or times out. Returns either "ok", "not-equal", or "timed-out". If waiting is not allowed in the calling agent then it throws an Error exception (most browsers will not allow wait() on the browser's main thread).

 Atomics.wake()
 Wakes up some agents that are sleeping in the wait queue on the given array position. Returns the number of agents that were woken up.
 Atomics.isLockFree(size)
 An optimization primitive that can be used to determine whether to use locks or atomic operations. Returns true, if an atomic operation on arrays of the given element size will be implemented using a hardware atomic operation (as opposed to a lock). Experts only.
 */
