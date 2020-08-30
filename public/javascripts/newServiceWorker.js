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
    var primaryKey = notification.data.primaryKey;
    var action = e.action;
  
    if (action == 'explore') {
        console.log('User open this notification')
        e.waitUntil(clients.openWindow('https://www.google.com'));
        notification.close();
      
    } else {
        notification.close();
        console.log('Notification closed');
    }
  });

  // notificationclose  example
self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    console.log(notification);
    var primaryKey = notification.data.primaryKey;
    console.log('Closed notification: ' + primaryKey);
  });
  