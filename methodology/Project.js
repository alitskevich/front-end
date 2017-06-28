
export default class Project {

    constructor() {

    }

    run() {

        const specifications = BA.GatherRequirements();

        const delivery = Dev.Implementation(specifications);

        QA.performQualityAssurance(delivery)
          .onBugReport(bugReport => Dev.fixBug(bugReport));

        DevOps.install().maySuport();
    }

    done() {

      return new Delivery(product, documentation);
    }
}
