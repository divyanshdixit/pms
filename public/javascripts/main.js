
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

const vapidPublicKey = 'BMGXM4VPeJeOg1wJk0ppNKR-MSot66cL1Hwwy8JcIknOWIzJptDT4B7YSIL0yRkRLdkY6XAH-Q81W7T23gbilfo'
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

// function setUsername(){
 
// if('serviceWorker' in navigator){
//     if('PushManager' in window){

//         window.Notification.requestPermission()
//         .then(status => {
//             if (window.Notification.permission == 'granted') {
//                 // displayNotification();
//                 console.log('Notification permission status:', status);
                
//                 navigator.serviceWorker.register('./fakepath/javascripts/newServiceWorker.js')

//                 .then( (regObj) => {

//                     console.log('registration success', regObj)
//                     var options = {
//                         body:'Dynamic Body changed',
//                         icon:'./fakepath/uploads/2016-09-08 (2).png',
//                         vibrate:[100, 50, 100],
//                         data:{
//                             dateOfArrival:Date.now(),
//                             primaryKey:1
//                         },
//                         actions:[
//                             {
//                                 action:'explore',
//                                 title:'explore this world',
//                                 icon:'./fakepath/uploads/2016-09-08 (2).png'
//                             },
//                             {
//                                 action:'close',
//                                 title:'Close the notification',
//                                 icon:'./fakepath/uploads/2016-09-08 (2).png'
//                             },
//                         ]
//                     }

//                     regObj.showNotification('Dynamic Title', options);

//                     // subscription
//                     navigator.serviceWorker.ready.then(function(registration){
//                         console.log(registration);
//                         // subscribe
//                         registration.pushManager.subscribe({
//                             userVisibleOnly: true,
//                             applicationServerKey: convertedVapidKey
//                         })
//                         .then(subscription => {
//                               // The subscription was successful

//                             //   savePushSubscription(subscription);

//                               $.ajax({
//                                 url:'/subscribe',  
//                                 type:'POST',
//                                 headers:{
//                                     'Content-Type':'application/json'
//                                 },
//                                 data:JSON.stringify(subscription),
//                               })
//                         })
//                         .catch(error => {
//                             // failed to subscribe
//                             console.log(error)
//                         })

//                         // for unsubscribe
//                             $('.unsubscribe').click(function(){
                              
//                                 registration.pushManager.getSubscription()
//                                 .then(subscription => {
//                                     if(subscription){
//                                         return subscription.unsubscribe()
//                                         .then(success => {
//                                             // removePushSubscription(subscription);
//                                             console.log('Unsubscibed:', success)
//                                         })
//                                         .catch(error => {
//                                             // failed to unsubsrcibe
//                                             console.log(error)
//                                         })
//                                     }
//                                 })
//                                 .catch(error => {
//                                     console.log('failed tp get subscritpion:', error)
//                                 })
//                             });

//                     })
//                     .catch(error => {
//                         console.log('Service worker is not ready!', error)
//                     })

//                 })
//                 .catch( (error) => {
//                     console.log('registration failed:' , error)
//                 })

//             }else{
//                 console.log('Permission not granted:', status);
//                 // so registration will not be done
//             }
//         })
//         .catch(error => {
//             console.log(error)
//         })

//     }else{
//         console.log('push manager is not in window')
//     }
//   }else{
//     console.log('service worker is not in navigator')
//   }   
  
// }

// get the button having class trigger-push using querySelector => retruns the first element

const triggerPush = document.querySelector('.trigger-push');

// make async function which returns promise 

// async function triggerPushNotification(){
//     // check wether serviceWorker is supported by browers or not 
//     if('serviceWorker' in navigator){
//         console.log('service worker is supported in this browser')
//         // if serviceWorker is supported then register 
//         const register = await navigator.serviceWorker.register('./fakepath/javascripts/serviceWorker.js');
        
//         if(register.installing){
//             var sts = register.installing
//         }else if(register.waiting){
//             var sts = register.waiting
//         }else if(register.active){
//             var sts = register.active
//         }
//         console.log(sts)
//         if(sts.state == "activated"){
//         const subscription = await register.pushManager.subscribe({
//             userVisibleOnly:true,
//             applicationServerKey: convertedVapidKey
//         })

//         await fetch('/subscribe', {
//             method:'POST',
//             body:JSON.stringify(subscription),
//             headers:{
//                 'Content-Type':'application/json'
//             }
//         })
//     }
        
//     }else{
//         console.error('Service Worker are not supported in this browser');
//     }
    
// }

//     triggerPush.addEventListener('click', () => {

//         triggerPushNotification()
//         .catch(error => console.error(error));
//     });