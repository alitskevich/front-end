// Promise is a mean to invoke callbacks BEFORE they are actually defined.
export default class Promise {

  static resolve = v => ensurePromise(v);

  static reject = v => ensurePromise(v, 'reject');

  constructor(performFn) {

    this.handlers = {
      resolve: (result => {
        this.alreadyCompleted = { successfully: true, result };
      }),
      reject: (error => {
        this.alreadyCompleted = { error };
      })
    };

    performFn(
      result => this.handlers.resolve(result),
      error => this.handlers.reject(error)
    );

  }

  then(resolve, reject = () => 0) {

    if (this.alreadyCompleted) {

      const { successfully, result, error } = this.alreadyCompleted;

      return successfully ?
        ensurePromise(guard(resolve, reject)(result)) :
        ensurePromise(reject(error), 'reject');
    }

    return new Promise((rs, rj) => {
      this.handlers = {
        resolve: result => rs(guard(resolve, reject)(result)),
        reject: error => rj(reject(error))
      };
    });
  }
}

function isPromise(value) {

  return value && value.then;
}

function ensurePromise(value, type = 'resolve') {

  if (isPromise(value)) {

    return value;
  }

  return new Promise(
    type === 'resolve' ?
      (resolve, reject) => guard(resolve, reject)(value) :
      (resolve, reject) => reject(value)
  );
}

function guard(resolve, reject) {

  return (result) => {
    try {
      return resolve(result);
    } catch (ex) {
      return reject(ex);
    }
  };

}
