// for using caching in service worker , used in install event

// const { cache } = require("ejs");

var cacheName = 'v1';
var cacheAssets = [
    '/',
    '/fakepath/htmlFiles/about.html',
    '/fakepath/stylesheets/style.css',
    '/fakepath/javascripts/offline.js',
    '/fakepath/javascripts/main.js',
]

// Call install event 

self.addEventListener('install', (e) => {
    console.log('Service Worker installed');

    // add cache files in the install event
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.log('Service worker: caching files');
            cache.addAll(cacheAssets);
        })
        .then(() => {
            self.skipWaiting();
        })
    );
})

// Activate event

self.addEventListener('activate', (e) => {
    console.log('Service worker activated', e);
    // remove unwanted cache in activate event
    caches.keys().then( cacheNames => {
        return Promise.all(
            cacheNames.map(cache => {
                if(cache !== cacheName){
                    console.log('Service worker: remove old cache!')
                    return caches.delete(cache);
                }
            })
        )
    })    
})

// Show cache files in fetch event

self.addEventListener('fetch', e => {
    console.log('Service worker fetching!');
    // check live site is available if not then use cached site
    e.respondWith(
        fetch(e.request).catch( () => {
            caches.match(e.request)
        })
    )
})
