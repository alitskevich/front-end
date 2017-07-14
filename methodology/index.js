import Company from './Company.js';

const COMPANIES = [
  {
    code:'epam',
    name: 'EPAM Systems',
    board: []

  },
  {
    code:'palmolive',
    name: 'Palmolive',
    board: []

  }
];

function main() {

  COMPANIES.forEach(cfg => (new Company(cfg)).establish());
}

main();
