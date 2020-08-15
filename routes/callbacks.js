function add(val, callback){
    return callback(val+5, false);
}

function sub(val, callback){
    return callback(val-5, false);
}

function mul(val, callback){
    return callback(val*5, false);
}

add(0, function(addRes, err){
    if(!err){
        sub(addRes, function(subRes, err){
            if(!err){
                mul(subRes, function(mulRes, err){
                    if(!err){
                        console.log('Result: '+ mulRes);
                    }
                })
            }
        })
    }
})