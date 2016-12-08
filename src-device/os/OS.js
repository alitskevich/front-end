import FileSystem from './FileSystem.js';

class Program {
    
    execute(params , os) {
        
        os.write(1, 'Hello, world!');
        
        return this.exit(0);
    }
    
    exit(code) {
        
        //...
        
        return code;
    }
}


export class OS {
    
    constructor(){
        this.fs = new FileSystem();
    }
    
    boot() {
        
       this.execute('/_boot.exe');
       
    }
    
    reboot() {
        
    }
    
    ls(path = '') {
        
        
    }
    
    mkdir() {
        
    }
    
    openFile(path) {
        
        
    }
   
    close(ref) {
        
        
    }
    
    read(ref) {
        
    }
    
    write(ref, data) {
        
    }
    
    execute(path, params) {
        
        const code = this.fs.readFile(path);
 
        const program = new Program(code, params, this);
        
        return program.execute();
    }
    
    Socket(){
        
    }
    
}