import { BA, QA, Dev, DevOps } from 'team';

import { Customer } from 'customer';

import { BugReport, Product, Feature } from 'artefacts';

import { Release } from 'events';

class SDLC {

    runRelease() {

        const specifications = BA.GatherRequirements();

        const delivery = Dev.Implementation(specifications);

        QA.performQualityAssurance(delivery)
          .onBugReport(bugReport => Dev.fixBug(bugReport));

        DevOps.install().maySuport();
    }
}
/**
 *
 *
 */
