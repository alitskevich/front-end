import Observable from 'concepts/Observable.js';

class Store extends Observable {

  constructor() {

    super();

    this.list = this.restoreHotReload();
  }

  get counter() {

    return this.list.length;
  }

  update(delta) {

    Object.assign(this, delta);

    this.notify(delta);
  }

  incCounter(inc = 1) {

    const c = Math.max(0, this.counter + inc * 11);
    const gen = () => c < 1 ? [] : Array.apply(null, Array(c)).map((e, i)=>
      ({ id:i, name:'' + ( i + 1) }));
    const result = gen();

    result.forEach(e => (e.children = gen()));

    this.update({ list:result });
  }

  restoreHotReload() {
    const hot = module && module.hot;
    if (hot) {

      hot.addStatusHandler(function (d) {});
      // hot.accept();
      hot.dispose( data2 => {
        data2.list = this.list;
      });
      const data = hot.data;
      if (data) {
        return data.list || [];
      }
    }
    return [];
  }
}

const store = new Store();

export default store;
