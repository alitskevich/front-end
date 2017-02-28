const REGISTRY = [
  'AX',
  'BX',
  'CX',
  'DX',

  'IP',
  'CS',
  'DS',
  'SP',
  'SS',
  'ES'
];

export default class CentralProcessorUnit {

    constructor(memory, opSet) {

      this.cpu = this;
      this.read = (addr, seg) => addr > 0 ? memory.read(addr, seg) : this.REG[ -addr ];
      this.nextIp = () => memory.read(this.IP++, this.CS);
      this.REG = REGISTRY.map(e => 0);

      REGISTRY.forEach((reg, index) =>
        Object.defineProperty(this, reg, {
          get: ()=> this.REG[ index ],
          set: (value) => { this.REG[ index ] = value;}
        })
      );

      const OPS = opSet(this);

      const update = (delta) => {

        Object.keys(delta).forEach(addr => {
          const naddr = +addr;
          const value = delta[addr];
          if (!isNaN(naddr)) {
            if (naddr > 0) {
              // console.log('cpu', -naddr - 1, value, isNaN(naddr));
              memory.write(naddr, value);
            } else {
              this.REG[ -naddr ] = value;
            }
          } else {
            this[ addr ] = value;
          }
        });
      };

      this.reset = () => {

        REGISTRY.forEach(reg=> { this[reg] = 0;});

        this.zero = false;
        this.carry = false;
        this.fault = false;

        this.IP = 0;

        for (let opcode = this.nextIp(); opcode; opcode = this.nextIp()) {

          const op = OPS.call(null, opcode);

          update(op());
        }
      };

    }
}
