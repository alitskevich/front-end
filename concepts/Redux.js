export class ReduxStore { 
  constructor(reducer, observer) {
    let state = {}
    this.dispatch = (action) => {
      state = reducer(state, action);
      observer(state)
    }
  }
}