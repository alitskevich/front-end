
export default class Employee {

    constructor(name, degree, target, position) {

      Object.assign(this, { name, degree, target, position });

      this.establishedAt = new Date();
    }
}
