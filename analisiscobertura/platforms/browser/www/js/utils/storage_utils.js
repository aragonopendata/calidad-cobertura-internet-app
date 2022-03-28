MAIN.utils.storageUtils = (function() {
    var ret = {};
    
    ret.readFromLocalStorage = function(key){
        if(!key){
            console.error("Error reading from local storage: key is null or void");
            return;
        }
        
        return localStorage.getItem(key);   
    };
    
    ret.saveToLocalStorage = function (key, value){
        if(!key){
            console.error("Error writting to local storage: key is null or void");
            return;
        }

        localStorage.setItem(key, value);
    };
    
    ret.removeFromLocalStorage = function(key){
        if(!key){
            console.error("Error removing from local storage: key is null or void");
            return;
        }
        
        localStorage.removeItem(key);   
    };
    
    ret.readFromSessionStorage = function(key){
        if(!key){
            console.error("Error reading from session storage: key is null or void");
            return;
        }
        
        return sessionStorage.getItem(key);   
    };
    
    ret.saveToSessionStorage = function (key, value){
        if(!key){
            console.error("Error writting to session storage: key is null or void");
            return;
        }
        
        sessionStorage.setItem(key, value);
    };
    
    ret.removeFromSessionStorage = function(key){
        if(!key){
            console.error("Error removing from session storage: key is null or void");
            return;
        }
        
        sessionStorage.removeItem(key);   
    };
    
    ret.clearSessionStorage = function(){
        sessionStorage.clear();
    };
        
    return ret;
}());