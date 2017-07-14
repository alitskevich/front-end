const BUDGET_TYPES = [
  { id: 'fixedPrice' },
  { id: 'Time&Material' }
];

export default class Budget {

    constructor(amount) {

      this.amount = amount;
    }

    transact(amount, purpose) {

      this.amount += amount;
    }
}
