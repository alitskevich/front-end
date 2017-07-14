export default class Project {

    constructor() {

      this.members = new Set();
    }

    assignTo(empoyee, roles, capacity) {

      return this.members.add(new Member(empoyee, this, roles, capacity));
    }

    unassignFrom(member) {

      this.members.delete(member);
    }

    run() {

        const specifications = this.gatherRequirements();

        const delivery = this.implement(specifications);

        while (bugReport = this.performQualityAssurance(delivery)) {

          this.fixBug(bugReport);
        }

        this.deliver(delivery);
    }

    implement(specifications) {

      return new Delivery(product, documentation);
    }
}
