// Check Service worker is suported by browser or not 

if('serviceWorker' in navigator){
    console.log('Service worker is supported ');

    // Register the service Worker on window load

    window.addEventListener('load', () => {
        // registering service worker
        navigator.serviceWorker.register('./fakepath/javascripts/testServiceWorker.js')
        .then(reg => console.log('Service worker registered', reg))
        .catch(err => console.log('Error in registering', err))
    })
}
