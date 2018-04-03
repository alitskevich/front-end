//                                             -- Tak, soldat, poexali! bystro!
//                                             -- mashina ne zavodit sa, tovaryshq major 
//                                             -- Poexali-poexali, potom zavedzosh
// Promise is like a "time machine" 
// which allows to use something BEFORE it actually defined.
// ```(new Promise((handler)=>setTimeout(handler,100))).then(actualHandler)```
export default class Promise {
  constructor(asyncPerformer) {
    let resolve = (result) => {
        // DONE-BEFORE-DEFINED: actual `resolve()` will be invoked immediately
        this.then = (actualResolve) => actualResolve(result)  
    }
    // to define actual callbacks 
    this.then = (actualResolve) => {
        // DEFINED-BEFORE-DONE: substitute fake callback with actual ones
        resolve = actualResolve 
        // return new Promise() for chaining
    }
    // run with fake callback, don't wait while actual will be defined
    asyncPerformer(r=>resolve(r))
  }
}