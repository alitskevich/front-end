import { StakeHolder, ProductOwner, ScrumMaster, Dev } from 'team';

import { UserStory, BackLog, Spike, Task } from 'artefacts';

import { Sprint } from 'events';

import SoftwareDevelopmentProcess from './SoftwareDevelopmentProcess.js';

export class Scrum extends SoftwareDevelopmentProcess {

  constructor() {

    this.addConcern();
  }

  run() {

    while (sprint = this.nextSprint()) {

      sprint.run();

      this.doRetrospective();

    }

  }
}
