// process the push message

self.addEventListener('push', function(e){
    console.log('Notification pushed');
    var data = e.data.json();
    console.log(data);
    // if(focused){
    //     clients.forEach(client => {
    //         client.postMessage({
    //             message:data.message
    //         })
    //     });
    // }else{
    e.waitUntil(self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        tag: data.tag,
        actions:[
            { action: 'Accept', title:'Yes'},
            { action:'Decline', title:'No'}
        ]
    }))
// }
})

// notificationclick trigger when user click on the notification
self.addEventListener('notificationclick', function(e) {
    console.log('Notification clicked');
    var notification = e.notification;
    console.log(e.notification);
    var primaryKey = notification.data.primaryKey;
    var action = e.action;
  
    if (action === 'Ok') {
        e.waitUntil(clients.openWindow('/'));
        notification.close();
    }else if(action === 'show'){
        e.waitUntil(clients.openWindow('/chat'));
    }else if(action === 'hide'){
        notification.close();
    }else if(action === 'Dismiss'){
        notification.close();
    } else {
        notification.close();
    }
  });

  // notificationclose  example
self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    notification.close();
    // console.log('Slide to notification panel:', notification);
  });
  