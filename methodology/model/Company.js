
export default class Company {

    constructor({ team, budget, values, mission }) {

      this.team = team;
      this.budget = budget;
      this.values = values;
      this.mission = mission;

      this.establishedAt = new Date();
    }

    establish() {

      Object.join(this);
    }

    hire(record) {

      return this.staff.add(new Employee(record));
    }

    setupProject() {

      return new Project();
    }

    findCustomer() {

      return new Customer();
    }

    negotiate(company, reqiurements) {

      return new Contract(company, reqiurements, budget, calendar);
    }

    onOpportunityEvent({ company, reqiurements }) {

      const contract = this.negotiate(company, reqiurements);

      if (contract) {

        const project = this.setupProject(contract);

        project.run();

      }
    }
}
