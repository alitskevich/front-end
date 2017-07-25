
export default class Budget {

    constructor(amount) {

      this.amount = amount;
    }

    transact(amount, purpose) {

      this.amount += amount;
    }
}
