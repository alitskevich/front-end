

export class Memory {
    
    constructor(TOTAL_SIZE){
        
        this.reset = () => {
            
            this.lastAccess = -1;
            this.data = new Array(TOTAL_SIZE);
        };
        
        this.checkAddr = (address) => {
            
            assert(address >= 0 || address < TOTAL_SIZE, `Memory access violation at ${address}`);
            
            return address;
        };
        
        this.reset();

    }
    
    load(address) {
        
        this.lastAccess = this.checkAddr(address);
 
        return this.data[address];
    }
    
    store(address, value) {

        this.lastAccess = this.checkAddr(address);
        self.data[address] = value;
    }
    
}