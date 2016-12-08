export class Browser extends Program {
    
    constructor(){
        
        this.tabs = [];
    }
    
    newTab() {
        
        this.tabs.push(  new Tab(new Window()) );
    }
    
    focusTab(tab) {
        
    }
    
    closeTab(tab) {
        
    }
}