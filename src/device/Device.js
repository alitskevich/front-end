import Memory from './Memory.js';
import CPU from './CPU.js';

export class DeviceFactory {
    
    static build(config) {
        
        const device = new Device(config);
        
        return device;
    }
}

export class Device {
 
    constructor({ MEMORY_SIZE, OPS}) {
        
        this.cpu = new CPU(OPS, new Memory(MEMORY_SIZE));
    }
    
    install(os) {
        
        this.os = os;
        
        os.device = this;
        
        return this;
    }
    
    launch() {
        
        this.cpu.reset();
        
        this.os.boot();
    }
    
    shutdown () {
        
        this.os.shutdown();
    }
    
    restart() {
        
        this.cpu.reset();
        
        this.os.reboot();
    }
}
