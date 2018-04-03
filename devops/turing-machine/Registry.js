
const REGISTRY_NAMES = [
  'AX',
  'BX',
  'CX',
  'DX',
  'IP'
];

export default class Registry {

  constructor(names = REGISTRY_NAMES) {

    this.data = names.map(reg => 0);
    this.names = names.reduce((r,e,i)=>{r[e]=i; return r;}, {});
  }

  reset () {

    this.zero = false;
    this.carry = false;
    this.fault = false;

    this.IP = 0;
  }

  read($){

    return this.data[$]
  }

  write($, V){

    this.data[$] = V;
  }

  get IP(){

    return this.read(this.names.IP)
  }

  set IP(V){

    return this.write(this.names.IP, V)
  }
}
