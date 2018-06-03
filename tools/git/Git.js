export class Git {

  constructor(db, folder, index, config) {
  }

  clone({ path }) {

  }

  branch(data) {

  }

  checkout(data) {

  }

  add({ files }) {
  }

  commit(path) {
    this.db.add(this.stage.createChangeset())
  }

  push(data) {

  }

  pull() {

  }

  fetch(data) {

  }

  merge(commit) {
    const ch = this.newChangeset({parents: [this.current, commit], diff: [this.current, commit]})
    this.commit()
  }

  rebase(data) {

  }
}
