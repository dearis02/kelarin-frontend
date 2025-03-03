importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: 'AIzaSyAPLguEXoDbYDrN8lPVn-721nclVLYektw',
	authDomain: 'kelarin-3e4cd.firebaseapp.com',
	projectId: 'kelarin-3e4cd',
	storageBucket: 'kelarin-3e4cd.firebasestorage.app',
	messagingSenderId: '1066073141290',
	appId: '1:1066073141290:web:e4f8853cb6c439d23ed353'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('Received background message: ', payload);
	self.registration.showNotification(payload.notification.title, {
		body: payload.notification.body,
		icon: '/firebase-logo.png'
	});
});
