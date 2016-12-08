
const guid = ((c) => ()=>c++)(0);
    
class MemoryFragment {
    
    constructor (address, sizeInBlocks) {
        
        this.ref = guid();
        this.address = address;
        this.sizeInBlocks = sizeInBlocks;
    }
    
}

export class MemoryHeap {
    
    constructor(memory, BLOCK_SIZE = 1024){
        
        this.BLOCK_SIZE = BLOCK_SIZE;
        
        this.memory = memory;
       
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
  
    ensureSize(ref, size) {
        
        const fragment = this.allocated.get(ref);
        if (fragment.size < size) {
            
        }
        
        return ref;
    }
   
    write(ref, data) {
        
        const fragment = this.ensureSize(ref);

        for (var i = 0, length = fragment.size = data.length; i < length; i++) {
            this.DATA[fragment.address + i] = data[i];
        }
    }
    
    defrag(){
        
    }
    
}