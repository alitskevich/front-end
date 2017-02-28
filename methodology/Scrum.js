import { StakeHolder, ProductOwner, ScrumMaster, Dev } from 'team';

import { UserStory, BackLog, Spike, Task } from 'artefacts';

import { Sprint } from 'events';

import SoftwareDevelopmentProcess from './SoftwareDevelopmentProcess.js';

export class Scrum extends SoftwareDevelopmentProcess {

  configure() {

    this.addConcern();
  }

  run() {

    for (const sprint = Sprint.first(); sprint; sprint = sprint.next()) {

      sprint.run();

      team.doRetrospective();

    }

  }
}
