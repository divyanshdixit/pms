self.addEventListener('push', ()=> {
    self.registration.sendNotification('title message', {})
})

/*

                        // for unsubscribe
                            $('.unsubscribe').click(function(){
                              
                                registration.pushManager.getSubscription()
                                .then(subscription => {
                                    if(subscription){
                                        return subscription.unsubscribe()
                                        .then(success => {
                                            // removePushSubscription(subscription);
                                            console.log('Unsubscibed:', success)
                                        })
                                        .catch(error => {
                                            // failed to unsubsrcibe
                                            console.log(error)
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log('failed tp get subscritpion:', error)
                                })
                            });
*/