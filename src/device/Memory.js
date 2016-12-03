
const guid = ((c) => ()=>c++)(0);
    
class MemoryFragment {
    
    constructor (address, sizeInBlocks){
        
        this.ref = guid();
        this.address = address;
        this.sizeInBlocks = sizeInBlocks;
    }
    
}

export class Memory {
    
    constructor(TOTAL_SIZE, BLOCK_SIZE = 1024){
        
        this.BLOCK_SIZE = 1024;
        this.TOTAL_SIZE = TOTAL_SIZE;
        
        this.DATA = new Array(TOTAL_SIZE);
       
        this.allocated = new Map();
        this.released = new Map();
        this.frontier = 0;
    }
    
    alloc(size) {
        
        const sizeInBlocks = Math.ceil(size / BLOCK_SIZE);
        
        let fragment = this.findAvailable(sizeInBlocks) || this.newMemoryFragment(sizeInBlocks);
        
        this.allocated.set(fragment.ref, fragment);
    }
    
    newMemoryFragment(sizeInBlocks) {
        
        const fragment = new MemoryFragment(this.frontier, sizeInBlocks);
               
        this.frontier  = this.frontier + sizeInBlocks;

        return fragment;
    }
    
    findAvailable(sizeInBlocks) {
               
        const fragment = this.released.values().find(e => e.sizeInBlocks === sizeInBlocks);
        
        if (fragment) {
            
            this.released.delete(fragment.ref);
        }
        
        return fragment;
 
    }
    
    release(ref) {
        
        const fragment = this.allocated.get(ref);
        
        this.allocated.delete(ref);
        
        this.released.set(ref, fragment);
        
    }
   
    read(ref) {
        
        const fragment = this.allocated.get(ref);
        
        return this.DATA.slice(fragment.address, fragment.size);
    }
   
    write(ref, data) {
        
        const fragment = this.allocated.get(ref);

        for (var i = 0, length = fragment.size = data.length; i < length; i++) {
            this.DATA[fragment.address + i] = data[i];
        }
    }
    
    checkAddr(newIP) {
        
        if (newIP < 0 || newIP >= this.DATA.length) {
            throw "IP outside memory";
        }
        return newIP;
    }
    
    load(address) {
        var self = this;

        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.lastAccess = address;
        return self.data[address];
    }
    
    store(address, value) {
        var self = this;

        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.lastAccess = address;
        self.data[address] = value;
    }
    
    reset() {
        var self = this;

        self.lastAccess = -1;
        for (var i = 0, l = self.data.length; i < l; i++) {
            self.data[i] = 0;
        }
    }
    
    defrag(){
        
    }
    
}