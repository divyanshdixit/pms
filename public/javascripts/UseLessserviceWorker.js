// notificationclose  example
self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  console.log('Closed notification: ' + primaryKey);
});

// notificationclick trigger when user click on the notification
self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
    console.log('Notification closed')
  } else {
    clients.openWindow('http://www.google.com');
    notification.close();
  }
});

self.addEventListener('install', function(event){
  event.waitUntil()
    .then(function(success){
        console.log('Installed successfully!');
    }, function(error){
        console.log('Installed failed!');
    })
})

self.addEventListener('activate', function(event) {
  console.log( 'Activated and ready to fetch');
});

// self.addEventListener('fetch', event => {
//   const url = new URL(event.request.url);

// })

self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body:'body is added'
    })
})

// var CACHE_NAME = 'my-site-cache-v1';
// var urlsToCache = [
//   '/',
//   './public/javascripts/main.js',
//   './public/stylesheets/style.css'
// ];



// self.addEventListener('activate', function(event) {

//     var cacheAllowlist = [];
  
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.map(function(cacheName) {
//             if (cacheAllowlist.indexOf(cacheName) === -1) {
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//     );
//   });