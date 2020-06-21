function createEle(eleName,classArr,styleObj){

    var dom = document.createElement(eleName);

    for(var i=0;i<classArr.length;i++){
         dom.classList.add(classArr[i]);
    }
   
    for(var key in styleObj ){
     dom.style[key] = styleObj[key];
    }

    return dom;
}

function setLocal(key,value){

    if(typeof value === 'object' && value !==null){
        value = JSON.stringify(value);
    }
   localStorage.setItem(key,value);
}

function getLocal(key){
    var value = localStorage.getItem(key);
    
    if(value === null){
        return value
    };
    if(value[0] ==='[' || value[0] ==='{'){ //将数组或者是对象字符串形式的话，就应该将数组字符串或者对象字符串改成数组或者是对象
        return JSON.parse(value);
    }
    return value;
}

function formatNum(num){
   if(num<10){
      
     return '0'+num;
   }
   return num;
}