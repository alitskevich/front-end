//                                             -- Tak, soldat, poexali! bystro!
//                                             -- mashina ne zavodit sa, tovaryshq major 
//                                             -- Poexali-poexali, potom zavedzosh
// Promise is like a "time machine" 
// which allows to USE a callback BEFORE it actually DEFINED.
// ```
// (new Promise((handler)=>asynAction(handler))).then(actualHandler)
// ```
export default class Promise {
  constructor(consumer) {
    let resolve = (result) => {
        // DONE-BEFORE-DEFINED: actual `resolve()` will be invoked immediately
        this.then = (actualResolve) => actualResolve(result)  
    }
    this.then = (actualResolve) => {
        // DEFINED-BEFORE-DONE: substitute fake callback with actual ones
        resolve = actualResolve 
        // omit: return new Promise() for chaining
    }
    // run with fake callback, don't wait while actual will be defined
    consumer(r=>resolve(r), /** omit reject*/ )
  }
}