function add(val, callback){
    return callback(val+5, true);
}

function sub(val, callback){
    return callback(val-5, true);
}

function mul(val, callback){
    return callback(val*5, true);
}

function padd(val){
    return val+5;
}

function psub(val){
    return val-5;
}

function pmul(val){
    return val*5;
}

// do you know what is this and how is it work? if yes then you genius if not you are only one step ahead from nooob
add(5, function(addRes, err){
    if(!err){
        sub(addRes, function(subRes, err){
            if(!err){
                mul(subRes, function(mulRes, err){
                    if(!err){
                        console.log('Result: '+ mulRes);
                    }else{
                        console.log(err);
                    }
                })
            }
        })
    }
})

// solve callback hell using promises

var promise = new Promise(function(resolve, reject){
    if(true){
        resolve(5);
    }else{
        reject(5);
    }
});

promise.then(padd).then(psub).then(pmul).then( (msg) => {
    console.log(msg);
}).catch( (err) => {
    console.log(err);
})