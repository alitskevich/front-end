const ROOT = new Folder ('/',[
    
    new File('_boot.asm', ''),
    new File('Hello.asm', ''),
    
    new Folder ('Games', [
        new File('qs.exe', 'dhfvuhfvsdhvsudvbsuvbuvb'),
        new File('qs.dat', 'dhfvuhfvsdhvsudvbsuvbuvb'),
        new Folder ('bin', [
            new File('qs2.exe', 'dhfvuhfvsdhvsudvbsuvbuvb'),
            new File('qs4.dat', 'dhfvuhfvsdhvsudvbsuvbuvb')
        ])
    ])
]);

class File {
    
    constructor(name, data) {
        
        this.name = name;
        
        this.address = address;
        
        this.size = size;
        
        this.isOpen = false;
    } 
    
    open(drive) {
        
       this.isOpen = drive.openFile(); 
    }
        
    read(path) {
        
      return this.isOpen ? this.data : null;  
    }
    
    write(data) {
        
        if (this.isOpen) {
            
            this.data = data;
        }
    }
    
    close(){
        
      this.isOpen = false;  
    }
       
    append(data) {
        
     if (this.isOpen) {
        
        this.data = this.data + data; 
     }
     
    }
}

class Folder extends File {
    
    constructor(name, data = []) {
        this.name = name;
        this.data = data;
    } 
    
    files() {
        
        return this.data;
    }
}


export class FileSystem {
    
    constructor(drive) {
        
        this.drive = drive;
    } 
    
    readBootSector() {
        
    }
    
    find(path = '/') {
        
        return file;
    }
    
    ls(path = '/') {
        
        ROOT.ls();
    }
    
    mkdir() {
        
    }
    
    readFile(path) {
        
        const file = this.find(path);
        
        const descr = file.open(this.drive);
        
        const data = file.read();
        
        file.close();
        
        return data;
    }
    
    writeFile(path) {
        
    }
}