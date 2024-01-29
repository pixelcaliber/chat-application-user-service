importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDQ1VIFGUObFxZiJlG7rUHn3yzVskUJZus",
    authDomain: "chat-app-54f49.firebaseapp.com",
    projectId: "chat-app-54f49",
    storageBucket: "chat-app-54f49.appspot.com",
    messagingSenderId: "415140999887",
    appId: "1:415140999887:web:9b17ad8f98bb298461fdba",
    measurementId: "G-HKWN45ZLX9"
  };
  
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});